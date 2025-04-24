import * as streamifier from 'streamifier';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'events' },
                (error, result: UploadApiResponse | undefined) => {
                    if (error || !result) {
                        reject(error || new Error('Upload failed with unknown error'));
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );

            streamifier.createReadStream(file.buffer).pipe(stream);
        });
    }
}
