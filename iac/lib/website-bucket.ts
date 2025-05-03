import { StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { BaseStack } from "./base-stack";

export type WebsiteBucketProps = {
  websiteBucketName: string;
  websiteCfnOutputName: string;
};

export type WebsiteBucketStackProps = StackProps & {
  resourceProps: WebsiteBucketProps;
};

export class WebsiteBucketStack extends BaseStack {
  private readonly bucket: Bucket;
  constructor(scope: Construct, id: string, props: WebsiteBucketStackProps) {
    super(scope, id, props);
    this.bucket = this.createBucket(props.resourceProps.websiteBucketName);
    this.setCfnOutput([
      {
        name: props.resourceProps.websiteCfnOutputName,
        value: this.bucket.bucketName,
      },
    ]);
  }

  private createBucket(bucketName: string): Bucket {
    const bucket = new Bucket(this, `${bucketName}-bucket`, {
      bucketName: this.getName(bucketName),
    });
    return bucket;
  }

  get bucketInstance() {
    return this.bucket;
  }

  get bucketName() {
    return this.bucket.bucketName;
  }

  get bucketArn() {
    return this.bucket.bucketArn;
  }
}
