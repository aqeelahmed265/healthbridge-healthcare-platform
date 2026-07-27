import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { StorageService } from './storage.service';

@Injectable()
export class MinioStorageService implements StorageService, OnModuleInit {
  private readonly logger = new Logger(MinioStorageService.name);
  private client!: Minio.Client;
  private bucketName!: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const endPoint = this.configService.get<string>('MINIO_ENDPOINT') || 'localhost';
    const port = parseInt(this.configService.get<string>('MINIO_PORT') || '9000', 10);
    const useSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true';
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY') || 'minioadmin';
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY') || 'minioadmin';

    this.bucketName =
      this.configService.get<string>('MINIO_BUCKET_NAME') || 'healthbridge-documents';

    this.client = new Minio.Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });

    try {
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Created MinIO bucket: ${this.bucketName}`);
      }
    } catch (err: any) {
      this.logger.warn(
        `MinIO connection check deferred: ${err.message}. Storage adapter falling back to signed mock URLs.`,
      );
    }
  }

  async getUploadSignedUrl(
    bucketName: string = this.bucketName,
    objectKey: string,
    expiresSeconds = 900,
  ): Promise<string> {
    try {
      return await this.client.presignedPutObject(bucketName, objectKey, expiresSeconds);
    } catch {
      return `http://localhost:9000/${bucketName}/${objectKey}?mock-presigned-upload=true`;
    }
  }

  async getDownloadSignedUrl(
    bucketName: string = this.bucketName,
    objectKey: string,
    expiresSeconds = 900,
  ): Promise<string> {
    try {
      return await this.client.presignedGetObject(bucketName, objectKey, expiresSeconds);
    } catch {
      return `http://localhost:9000/${bucketName}/${objectKey}?mock-presigned-download=true`;
    }
  }

  async putObject(
    bucketName: string = this.bucketName,
    objectKey: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<void> {
    try {
      await this.client.putObject(bucketName, objectKey, buffer, buffer.length, {
        'Content-Type': mimeType,
      });
    } catch (err: any) {
      this.logger.error(`MinIO putObject error: ${err.message}`);
    }
  }

  async deleteObject(bucketName: string = this.bucketName, objectKey: string): Promise<void> {
    try {
      await this.client.removeObject(bucketName, objectKey);
    } catch (err: any) {
      this.logger.error(`MinIO deleteObject error: ${err.message}`);
    }
  }
}
