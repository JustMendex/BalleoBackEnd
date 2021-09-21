import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  SetMetadata,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DraftService } from './draft.service';

import { FilesValidationPipe } from 'src/files/pipes/files-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { Getuser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { CreateDraftDto } from './dto/create-draft.dto';
import { Draft } from './draft.schema';
import { UpdateDraftDetailsDto } from './dto/update-draft-details.dto';
import { UserRole } from 'src/auth/user-role.enum';
import { AddImageToDraftDto } from './dto/update-draft-image.dto';
import { DeleteImageFromDraftDto } from './dto/delete-draft-image.dto';
import { DeleteDraftDto } from './dto/delete-draft.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateDraftStatusDto } from './dto/update-draft-status.dto';
import { UpdateDraftPickUpDateDto } from './dto/update-draft-delivery-date.dto';
import { TransitionDraftDto } from './dto/transition-draft.dto';

@Controller('draft')
export class DraftController {
  constructor(private draftService: DraftService) {}

  @Get('getDrafts')
  @SetMetadata('roles', [UserRole.store, UserRole.user])
  @UseGuards(AuthGuard(), RolesGuard)
  async getDrafts(@Getuser() user: User): Promise<Draft[]> {
    return this.draftService.getDrafts(user);
  }

  @Post('createDraft')
  @SetMetadata('roles', [UserRole.store, UserRole.user])
  @UseGuards(AuthGuard(), RolesGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async createDraft(
    @Getuser() user: User,
    @UploadedFiles(FilesValidationPipe) files: Array<Express.Multer.File>,
    @Body() createDraftDto: CreateDraftDto,
  ): Promise<Draft> {
    return this.draftService.createDraft(user, files, createDraftDto);
  }

  @Patch('updateDraftDetails')
  @SetMetadata('roles', [UserRole.store, UserRole.user])
  @UseGuards(AuthGuard(), RolesGuard)
  async updateDraftDetails(
    @Getuser() user: User,
    @Body() updateDraftDetailsDto: UpdateDraftDetailsDto,
  ): Promise<Draft> {
    return this.draftService.updateDraftDetails(user, updateDraftDetailsDto);
  }

  @Patch('addImageToDraft')
  @SetMetadata('roles', [UserRole.store, UserRole.user])
  @UseGuards(AuthGuard(), RolesGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async addImageToDraft(
    @Getuser() user: User,
    @UploadedFiles(FilesValidationPipe) files: Array<Express.Multer.File>,
    @Body() addImageToDraftDto: AddImageToDraftDto,
  ): Promise<Draft> {
    return this.draftService.addImageToDraft(user, files, addImageToDraftDto);
  }

  @Delete('deleteImageFromDraft')
  @SetMetadata('roles', [UserRole.store, UserRole.user])
  @UseGuards(AuthGuard(), RolesGuard)
  async deleteImageFromDraft(
    @Getuser() user: User,
    @Body() deleteImageFromDraftDto: DeleteImageFromDraftDto,
  ): Promise<Draft> {
    return this.draftService.deleteImageFromDraft(
      user,
      deleteImageFromDraftDto,
    );
  }

  @Patch('updateDraftStatus')
  @SetMetadata('roles', [UserRole.admin, UserRole.worker])
  @UseGuards(AuthGuard(), RolesGuard)
  async updateDraftStatus(
    @Getuser() user: User,
    @Body() updateDraftStatusDto: UpdateDraftStatusDto,
  ): Promise<Draft> {
    return this.draftService.updateDraftStatus(user, updateDraftStatusDto);
  }

  @Patch('updateDraftPickUpDate')
  @SetMetadata('roles', [UserRole.admin, UserRole.worker])
  @UseGuards(AuthGuard(), RolesGuard)
  async updateDraftPickUpDate(
    @Getuser() user: User,
    @Body() updateDraftPickUpDateDto: UpdateDraftPickUpDateDto,
  ): Promise<Draft> {
    return this.draftService.updateDraftPickUpDate(
      user,
      updateDraftPickUpDateDto,
    );
  }

  @Post('transitionDraft')
  @SetMetadata('roles', [UserRole.admin, UserRole.worker])
  @UseGuards(AuthGuard(), RolesGuard)
  async transitionDraft(
    @Getuser() user: User,
    @Body() transitionDraftDto: TransitionDraftDto,
  ): Promise<boolean> {
    return this.draftService.transitionDraft(user, transitionDraftDto);
  }

  @Delete('deleteDraft')
  @SetMetadata('roles', [UserRole.store, UserRole.user])
  @UseGuards(AuthGuard(), RolesGuard)
  async deleteDraft(
    @Getuser() user: User,
    @Body() deleteDraftDto: DeleteDraftDto,
  ): Promise<boolean> {
    return this.draftService.deleteDraft(user, deleteDraftDto);
  }
}
