import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';

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
    if (!session) return apiError('Unauthorized', 401);

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

    return apiSuccess({
      url: result.url,
      public_id: result.publicId,
    });
  } catch (error) {
    console.error('POST /api/upload:', error);
    return apiError('Upload failed', 500);
  }
}

