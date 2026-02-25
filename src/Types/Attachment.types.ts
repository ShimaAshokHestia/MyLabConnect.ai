// types/Attachment.types.ts
export interface Attachment {
    existingFileUrl: string;
    existingFileName: string;
    attachmentId: number;
    tableName: string;
    recordId: number;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
    description?: string;
    uploadedBy: string;
    uploaddedOn: string;
    updatedAt?: string;
}

export interface AttachmentUploadRequest {
    file: File;
    tableName: string;
    recordId: number;
    description?: string;
}

export interface AttachmentResponse {
    success: boolean;
    message: string;
    data?: Attachment;
    error?: string;
}

export interface AttachmentListResponse {
    success: boolean;
    data: Attachment[];
    total: number;
}