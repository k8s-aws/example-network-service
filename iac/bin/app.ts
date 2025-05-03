#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { WebsiteBucketStack } from "../lib/website-bucket";
import { CloudFrontStack } from "../lib/cloudfront";
import { RestApiStack } from "../lib/rest-api";

const app = new cdk.App();
const org = app.node.tryGetContext("org");
const envName = app.node.tryGetContext("env");

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT!,
  region: process.env.CDK_DEFAULT_REGION,
};

const websiteStackName = "website-bucket";
const websiteBucketStack = new WebsiteBucketStack(app, websiteStackName, {
  stackName: `${org}-${envName}-${websiteStackName}`,
  env,
  resourceProps: {
    websiteBucketName: "global-website",
    websiteCfnOutputName: "GlobalWebsiteBucketName",
  },
});

const cloudFrontStackName = "website-distribution";
const clodFrontStack = new CloudFrontStack(app, cloudFrontStackName, {
  stackName: `${org}-${envName}-${cloudFrontStackName}`,
  env,
  resourceProps: {
    distributionName: "global-website",
    distributionIdCfnOutputName: "GLobalWebsiteDistributionId",
    websiteBucketName: websiteBucketStack.bucketName,
    defaultRootObject: "index.html",
  },
});

clodFrontStack.node.addDependency(websiteBucketStack);

const apiStackName = "global-api";

const apiGatewayStack = new RestApiStack(app, apiStackName, {
  stackName: `${org}-${envName}-${apiStackName}`,
  resourceProps: {
    apiName: apiStackName,
    apiIdCfnOutputName: "GlobalRestApiId",
  },
});
