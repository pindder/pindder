import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  
  async deleteImage(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      
      // result.result will typically be 'ok' if successful or 'not found' if it didn't exist
      return result;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new InternalServerErrorException('Failed to delete image');
    }
  }

  // Helper method if you only have the full secure URL saved in your database
  extractPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    
    // Get everything after 'upload/' and version number (if present, e.g., 'v123456/')
    const pathSegments = parts.slice(uploadIndex + 1);
    if (pathSegments[0]?.startsWith('v')) {
      pathSegments.shift(); // remove version segment
    }
    
    const fullPathWithExtension = pathSegments.join('/');
    // Remove the file extension (.jpg, .png, etc.)
    return fullPathWithExtension.substring(0, fullPathWithExtension.lastIndexOf('.'));
  }
}