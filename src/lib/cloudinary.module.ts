// cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.config';

@Module({
    providers: [CloudinaryService],
    exports: [CloudinaryService], // <-- Important: export it!
})
export class CloudinaryModule { }
