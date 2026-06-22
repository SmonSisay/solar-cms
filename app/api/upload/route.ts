import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { MediaAsset } from '@/lib/models';
import { logActivity } from '@/lib/logger';
import { connectDB } from '@/lib/mongodb';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'];

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session || !session.user) return apiError('Unauthorized', 401);

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) ?? 'media';

    if (!file) {
      return apiError('No file provided', 400);
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return apiError('File size exceeds the 10MB limit', 400);
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return apiError('Invalid file type. Allowed: JPEG, PNG, WEBP, GIF, and PDF.', 400);
    }

    // Validate extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return apiError('Invalid file extension.', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isPdf = file.type === 'application/pdf' || extension === 'pdf';
    const resourceType = isPdf ? 'raw' : 'image';

    const result = await uploadToCloudinary(buffer, folder, resourceType);

    await connectDB();
    const mediaAsset = await MediaAsset.create({
      url: result.url,
      publicId: result.publicId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      folder: folder,
      uploadedBy: session.user.id,
    });

    // Log the upload activity
    await logActivity({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userEmail: session.user.email || '',
      action: 'create',
      module: 'media',
      targetId: mediaAsset._id.toString(),
      targetName: file.name,
      details: `Uploaded file to folder: ${folder}`,
    });

    return apiSuccess({
      url: result.url,
      public_id: result.publicId,
      _id: mediaAsset._id,
      fileName: mediaAsset.fileName,
      fileSize: mediaAsset.fileSize,
      fileType: mediaAsset.fileType,
    });
  } catch (error) {
    console.error('POST /api/upload:', error);
    return apiError('Upload failed', 500);
  }
}

