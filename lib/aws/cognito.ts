import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { awsConfig } from "@/config/aws";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: awsConfig.REGION,
});
