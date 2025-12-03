import { Injectable, NotFoundException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class UploadService {
  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = join(process.cwd(), 'uploads', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`File ${filename} not found`);
    }

    await unlink(filePath);
  }
}
