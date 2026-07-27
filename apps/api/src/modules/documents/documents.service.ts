import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { MinioStorageService } from '../../infrastructure/storage/minio-storage.service';
import { DocumentVisibility } from '@healthbridge/shared';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private storageService: MinioStorageService,
  ) {}

  async requestPresignedUploadUrl(
    organizationId: string,
    fileName: string,
    fileSize: number,
    mimeType: string,
    patientId: string,
    category: string,
    uploadedBy: string,
    encounterId?: string,
    visibility: DocumentVisibility = DocumentVisibility.CLINICAL_ONLY,
  ) {
    if (fileSize > MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds the 15MB limit');
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException(`MIME type ${mimeType} is not permitted`);
    }

    const storageKey = `org_${organizationId}/pat_${patientId}/${Date.now()}_${fileName.replace(/\s+/g, '_')}`;

    const uploadUrl = await this.storageService.getUploadSignedUrl(undefined, storageKey, 900);

    const documentRecord = await this.prisma.medicalDocument.create({
      data: {
        organizationId,
        patientId,
        encounterId,
        fileName,
        fileSize,
        mimeType,
        storageKey,
        category,
        visibility,
        uploadedBy,
      },
    });

    return {
      document: documentRecord,
      uploadUrl,
    };
  }

  async listDocuments(
    organizationId: string,
    patientId?: string,
    category?: string,
    visibility?: DocumentVisibility,
  ) {
    const where: any = { organizationId };
    if (patientId) where.patientId = patientId;
    if (category) where.category = category;
    if (visibility) where.visibility = visibility;

    return this.prisma.medicalDocument.findMany({
      where,
      include: { patient: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPresignedDownloadUrl(id: string, organizationId: string) {
    const doc = await this.prisma.medicalDocument.findFirst({
      where: { id, organizationId },
    });

    if (!doc) throw new NotFoundException('Medical document record not found');

    const downloadUrl = await this.storageService.getDownloadSignedUrl(
      undefined,
      doc.storageKey,
      900,
    );

    return {
      document: doc,
      downloadUrl,
    };
  }
}
