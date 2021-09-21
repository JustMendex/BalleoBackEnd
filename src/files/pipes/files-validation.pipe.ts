import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value.length === 0) {
      throw new BadRequestException('Files are required');
    }

    return value;
  }
}
