import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permission, DocumentVisibility } from '@healthbridge/shared';
import { UserPayload } from '@healthbridge/contracts';

@ApiTags('Medical Documents')
@Controller('documents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DocumentsController {
  constructor(private readonly docsService: DocumentsService) {}

  @Post('presigned-upload')
  @RequirePermissions(Permission.DOCUMENT_UPLOAD)
  @ApiOperation({ summary: 'Request presigned MinIO S3 upload URL for medical file' })
  requestUpload(
    @Body('fileName') fileName: string,
    @Body('fileSize') fileSize: number,
    @Body('mimeType') mimeType: string,
    @Body('patientId') patientId: string,
    @Body('category') category: string,
    @Body('encounterId') encounterId?: string,
    @Body('visibility') visibility?: DocumentVisibility,
    @CurrentUser() user?: UserPayload,
  ) {
    const uploadedBy = `${user?.firstName} ${user?.lastName}`;
    return this.docsService.requestPresignedUploadUrl(
      user!.organizationId,
      fileName,
      fileSize,
      mimeType,
      patientId,
      category,
      uploadedBy,
      encounterId,
      visibility,
    );
  }

  @Get()
  @RequirePermissions(Permission.DOCUMENT_READ)
  @ApiOperation({ summary: 'List medical documents' })
  listDocuments(
    @CurrentUser() user: UserPayload,
    @Query('patientId') patientId?: string,
    @Query('category') category?: string,
    @Query('visibility') visibility?: DocumentVisibility,
  ) {
    return this.docsService.listDocuments(user.organizationId, patientId, category, visibility);
  }

  @Get(':id/download-url')
  @RequirePermissions(Permission.DOCUMENT_READ)
  @ApiOperation({ summary: 'Generate time-limited presigned download URL with audit logging' })
  getDownloadUrl(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.docsService.getPresignedDownloadUrl(id, user.organizationId);
  }
}
