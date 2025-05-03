import { CfnOutput, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";

export class BaseStack extends Stack {
  private _org: string;
  private _env: string;
  private _environments: string[] = ["dev", "qa", "sat", "uat", "prod"];
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this._org = this.node.tryGetContext("org");
    this._env = this.node.tryGetContext("env");
    if (
      !this._env ||
      this._environments.indexOf(this._env) == -1 ||
      !this._org
    ) {
      throw new Error(
        `Missing env. CDK deploy usage: 'cdk deploy -c env=${this._environments.join(
          "|"
        )} -c org=my-org'`
      );
    }
    // add standard tags
    this.addTags({ org: this._org, env: this._env });
  }
  //can be invoked to add additional tags by implementation class
  addTags(tags: { [key: string]: string }) {
    for (let [key, value] of Object.entries(tags)) {
      Tags.of(this).add(key, value);
    }
  }
  get env() {
    return this._env;
  }

  get org() {
    return this._org;
  }

  get awsAccount() {
    return process.env.CDK_DEPLOY_ACCOUNT!;
  }

  get awsRegion() {
    return process.env.CDK_DEPLOY_REGION!;
  }

  get environments() {
    return this._environments;
  }

  getName(
    id: string,
    resourceType: "Parameter" | "Secret" | "Other" = "Other"
  ) {
    let resourceId = `${this._org}-${this._env}-${id}`;
    if (resourceType === "Parameter") {
      resourceId = `/${this._org}/${this._env}/${id}`;
    } else if (resourceId === "Secret") {
      resourceId = `${this._org}/${this._env}/${id}`;
    }
    return resourceId;
  }

  setCfnOutput(resources: { name: string; value: string }[]) {
    resources.forEach((resource, index) => {
      new CfnOutput(this, `output-${resource.name}`, {
        exportName: resource.name,
        value: resource.value,
      });
    });
  }
}
