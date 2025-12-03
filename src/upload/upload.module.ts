import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uploadPath = configService.get('UPLOAD_PATH', join(process.cwd(), 'uploads'));

        // Ensure upload directory exists
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }

        return {
          storage: diskStorage({
            destination: uploadPath,
            filename: (req, file, callback) => {
              const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
              const ext = extname(file.originalname);
              callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
          }),
          fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
              callback(new Error('Only image files are allowed!'), false);
            }
            callback(null, true);
          },
          limits: {
            fileSize: 5 * 1024 * 1024, // 5MB
          },
        };
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
