import { S3Client } from '@aws-sdk/client-s3';
import { CloudWatchClient } from '@aws-sdk/client-cloudwatch';
import { env } from './env';

const awsConfig = {
  region: env.AWS_REGION,
  ...(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      }
    : {}),
};

export const s3Client = new S3Client(awsConfig);
export const cloudWatchClient = new CloudWatchClient(awsConfig);
