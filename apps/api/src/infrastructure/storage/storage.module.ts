import { Global, Module } from '@nestjs/common';
import { MinioStorageService } from './minio-storage.service';

@Global()
@Module({
  providers: [
    {
      provide: 'StorageService',
      useClass: MinioStorageService,
    },
    MinioStorageService,
  ],
  exports: ['StorageService', MinioStorageService],
})
export class StorageModule {}
