import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserId } from 'src/common/decorator/user-id.decorator';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadFile(
    @UserId() userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    const index = avatar.destination.lastIndexOf('/');
    const dirPath = avatar.destination.slice(0, index);
    const newAvatar = `${avatar.destination.slice(index + 1)}/${
      avatar.filename
    }`;
    return this.uploadService.saveAvatarUrl(userId, dirPath, newAvatar);
  }
}
