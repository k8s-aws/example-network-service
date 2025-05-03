import { Construct } from "constructs";
import { BaseStack } from "./base-stack";
import { AllowedMethods, Distribution } from "aws-cdk-lib/aws-cloudfront";
import { StackProps } from "aws-cdk-lib";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";

export type DistributionProps = {
  distributionName: string;
  websiteBucketName: string;
  distributionIdCfnOutputName: string;
  defaultRootObject?: string;
  domainNames?: string[];
};

export type CloudFrontStackProps = StackProps & {
  resourceProps: DistributionProps;
};

export class CloudFrontStack extends BaseStack {
  private readonly distribution: Distribution;
  constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
    super(scope, id, props);
    this.distribution = this.createCloudFront(props.resourceProps);
    this.setCfnOutput([
      {
        name: props.resourceProps.distributionIdCfnOutputName,
        value: this.distribution.distributionId,
      },
    ]);
  }

  private getBucket(bucketName: string) {
    return Bucket.fromBucketName(this, bucketName, bucketName);
  }

  private createCloudFront(props: DistributionProps): Distribution {
    return new Distribution(this, props.distributionName, {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(
          this.getBucket(props.websiteBucketName)
        ),
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      },
      defaultRootObject: props.defaultRootObject,
      domainNames: props.domainNames,
    });
  }

  get distributionId() {
    return this.distribution.distributionId;
  }
}
