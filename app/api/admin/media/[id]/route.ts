import { connectDB } from '@/lib/mongodb';
import { MediaAsset } from '@/lib/models';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { v2 as cloudinary } from 'cloudinary';
import { logActivity } from '@/lib/logger';
import { NotFoundError } from '@/lib/errors';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requirePermission('manage_media');
    if (!session || !session.user) return apiError('Forbidden', 403);

    await connectDB();
    const asset = await MediaAsset.findById(params.id);
    if (!asset) {
      throw new NotFoundError('Media asset not found');
    }

    // Delete from Cloudinary
    const isRaw = asset.fileType === 'application/pdf' || asset.fileName.toLowerCase().endsWith('.pdf');
    await cloudinary.uploader.destroy(asset.publicId, {
      resource_type: isRaw ? 'raw' : 'image',
    });

    // Delete from database
    await MediaAsset.findByIdAndDelete(params.id);

    // Log activity
    await logActivity({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userEmail: session.user.email || '',
      action: 'delete',
      module: 'media',
      targetId: asset._id.toString(),
      targetName: asset.fileName,
      details: 'Deleted file from media library and Cloudinary',
    });

    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
