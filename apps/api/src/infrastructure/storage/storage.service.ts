export interface StorageService {
  getUploadSignedUrl(bucketName: string, objectKey: string, expiresSeconds?: number): Promise<string>;
  getDownloadSignedUrl(bucketName: string, objectKey: string, expiresSeconds?: number): Promise<string>;
  putObject(bucketName: string, objectKey: string, buffer: Buffer, mimeType: string): Promise<void>;
  deleteObject(bucketName: string, objectKey: string): Promise<void>;
}
