import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import * as envConfig from 'config';

const awsConfig = envConfig.get('aws');

@Injectable()
export class FilesService {
  async uploadPublicFile(
    dataBuffer: Buffer,
    fileName: string,
    contentType: string,
    folder: string,
  ) {
    const s3 = new S3();

    const uploadResult = await s3
      .upload({
        Bucket: awsConfig.bucket,
        Body: dataBuffer,
        ContentType: contentType,
        Key: `${folder}/${uuid()}-${fileName.split(' ').join('-')}`,
      })
      .promise();

    return uploadResult;
  }

  async deletePublicFile(key: string) {
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: awsConfig.bucket,
        Key: key,
      })
      .promise();
  }
}
