import { Stack, StackProps } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { BaseStack } from "./base-stack";
import { HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";

export type RestApiProps = {
  apiName: string;
  apiIdCfnOutputName: string;
};

export type RestApiStackProps = StackProps & {
  resourceProps: RestApiProps;
};

export class RestApiStack extends BaseStack {
  private readonly restApi: RestApi;
  constructor(scope: Construct, id: string, props: RestApiStackProps) {
    super(scope, id, props);
    this.restApi = this.createAPiGateway(props.resourceProps.apiName);
    this.restApi.root.addMethod(HttpMethod.ANY);
    this.setCfnOutput([
      {
        name: props.resourceProps.apiIdCfnOutputName,
        value: this.restApi.restApiId,
      },
    ]);
  }

  createAPiGateway(apiName: string): RestApi {
    const restApi = new RestApi(this, apiName, {
      restApiName: this.getName(apiName),
      deploy: true,
      defaultMethodOptions: {},
    });
    return restApi;
  }

  get restApiId() {
    return this.restApi.restApiId;
  }

  get restApiName() {
    return this.restApi.restApiName;
  }
}
