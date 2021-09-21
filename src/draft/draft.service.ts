import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UserRole } from 'src/auth/user-role.enum';
import { User } from 'src/auth/user.schema';
import { FilesService } from 'src/files/files.service';
import { CreateListingtDto } from 'src/listing/dto/create-listing.dto';
import { ListingService } from 'src/listing/listing.service';
import { DraftStatus } from './draft-status.enum';
import { Draft, DraftDocument } from './draft.schema';
import { CreateDraftDto } from './dto/create-draft.dto';
import { DeleteImageFromDraftDto } from './dto/delete-draft-image.dto';
import { DeleteDraftDto } from './dto/delete-draft.dto';
import { TransitionDraftDto } from './dto/transition-draft.dto';
import { UpdateDraftPickUpDateDto } from './dto/update-draft-delivery-date.dto';
import { UpdateDraftDetailsDto } from './dto/update-draft-details.dto';
import { AddImageToDraftDto } from './dto/update-draft-image.dto';
import { UpdateDraftStatusDto } from './dto/update-draft-status.dto';

@Injectable()
export class DraftService {
  constructor(
    @InjectModel(Draft.name) private draftModel: Model<DraftDocument>,
    private readonly fileService: FilesService,
    private listingService: ListingService,
    private authService: AuthService,
  ) {}

  //Function that gets all drafts for a user
  async getDrafts(user: User): Promise<Draft[]> {
    const drafts = this.draftModel.find({ userId: user });

    return drafts;
  }

  //Funciton that creates a new draft
  async createDraft(
    user: User,
    files: Array<Express.Multer.File>,
    createDraftDto: CreateDraftDto,
  ): Promise<any> {
    const {
      title,
      size,
      condition,
      description,
      style,
      category,
      gender,
      subCategory,
      color,
      price,
    } = createDraftDto;

    const uploadedFiles = await Promise.all(
      files.map((file) =>
        this.fileService.uploadPublicFile(
          file.buffer,
          file.originalname,
          'image/jpeg',
          'tt',
        ),
      ),
    );

    const images = uploadedFiles.map((uploadedFile) => ({
      loaction: uploadedFile.Location,
      key: uploadedFile.Key,
    }));

    const draft = new this.draftModel();
    draft.userId = user;
    draft.title = title;
    draft.size = size;
    draft.condition = condition;
    draft.description = description;
    draft.style = style;
    draft.category = category;
    draft.gender = gender;
    draft.subCategory = subCategory;
    draft.color = color;
    draft.price = price;
    draft.images = images;

    try {
      await draft.save();
      draft.depopulate('userId');
      return draft;
    } catch (error) {
      await Promise.all(
        images.map((image) => this.fileService.deletePublicFile(image.key)),
      );

      throw new InternalServerErrorException();
    }
  }

  //Fnction that update draft details
  async updateDraftDetails(
    user: User,
    updateDraftDetailsDto: UpdateDraftDetailsDto,
  ): Promise<Draft> {
    const {
      _id,
      title,
      size,
      condition,
      description,
      style,
      category,
      gender,
      subCategory,
      color,
      price,
    } = updateDraftDetailsDto;

    const draft = await this.draftExists(_id, user);

    if (draft.status !== DraftStatus.pending) {
      throw new BadRequestException(`Can't update drafts that are not pending`);
    }

    const updatedAt = new Date();

    draft.title = title;
    draft.size = size;
    draft.condition = condition;
    draft.description = description;
    draft.style = style;
    draft.category = category;
    draft.gender = gender;
    draft.subCategory = subCategory;
    draft.color = color;
    draft.price = price;
    draft.updatedAt = updatedAt;

    await draft.save();

    return draft;
  }

  //Function that adds an image to a draft
  async addImageToDraft(
    user: User,
    files: Array<Express.Multer.File>,
    addImageToDraftDto: AddImageToDraftDto,
  ): Promise<Draft> {
    const { _id } = addImageToDraftDto;

    const draft = await this.draftExists(_id, user);

    if (draft.status !== DraftStatus.pending) {
      throw new BadRequestException(`Can't update drafts that are not pending`);
    }

    const uploadedFiles = await Promise.all(
      files.map((file) =>
        this.fileService.uploadPublicFile(
          file.buffer,
          file.originalname,
          'image/jpeg',
          'tt',
        ),
      ),
    );

    const images = uploadedFiles.map((uploadedFile) => ({
      loaction: uploadedFile.Location,
      key: uploadedFile.Key,
    }));

    const updatedAt = new Date();
    const newImages = draft.images.concat(images);
    draft.images = newImages;
    draft.updatedAt = updatedAt;

    try {
      await draft.save();
      return draft;
    } catch (error) {
      await Promise.all(
        images.map((image) => this.fileService.deletePublicFile(image.key)),
      );

      throw new InternalServerErrorException();
    }
  }

  //Function that deletes an image from a draft
  async deleteImageFromDraft(
    user: User,
    deleteImageFromDraft: DeleteImageFromDraftDto,
  ): Promise<Draft> {
    const { _id, key } = deleteImageFromDraft;

    const draft = await this.draftExists(_id, user);

    if (draft.status !== DraftStatus.pending) {
      throw new BadRequestException(`Can't update drafts that are not pending`);
    }

    await this.fileService.deletePublicFile(key);

    const updatedAt = new Date();
    draft.images = draft.images.filter((image) => image.key !== key);
    draft.updatedAt = updatedAt;

    try {
      await draft.save();
      return draft;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //Function that deletes a draft
  async deleteDraft(
    user: User,
    deleteDraftDto: DeleteDraftDto,
  ): Promise<boolean> {
    const { _id } = deleteDraftDto;

    const draft = await this.draftExists(_id, user);

    if (draft.status !== DraftStatus.pending) {
      throw new BadRequestException(`Can't update drafts that are not pending`);
    }

    await Promise.all(
      draft.images.map((image) => this.fileService.deletePublicFile(image.key)),
    );

    try {
      await draft.delete();
      return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateDraftStatus(
    user: User,
    updateDraftStatusDto: UpdateDraftStatusDto,
  ): Promise<Draft> {
    const { _id, status } = updateDraftStatusDto;

    const updatedAt = new Date();

    const draft = await this.draftExists(_id, user);

    draft.status = status;
    draft.updatedAt = updatedAt;
    try {
      await draft.save();
      return draft;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //Function that updates the draft delivery date
  async updateDraftPickUpDate(
    user: User,
    updateDraftPickUpDateDto: UpdateDraftPickUpDateDto,
  ): Promise<Draft> {
    const { _id, pickUpDate } = updateDraftPickUpDateDto;

    const draft = await this.draftExists(_id, user);

    const updatedAt = new Date();
    const pickUpDateString = new Date(pickUpDate);

    if (
      updatedAt > pickUpDateString ||
      !(updatedAt.toDateString() !== pickUpDateString.toDateString())
    ) {
      throw new BadRequestException(`Pick Up date can't be a date that passed`);
    }

    draft.pickUpDate = pickUpDate;
    draft.status = DraftStatus.waitingPickUp;
    draft.updatedAt = updatedAt;

    try {
      await draft.save();
      return draft;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async transitionDraft(
    user: User,
    transitionDraftDto: TransitionDraftDto,
  ): Promise<boolean> {
    const { _id, placement } = transitionDraftDto;

    const draft = await this.draftExists(_id, user);
    const userId = await this.authService.getUser(draft.userId);

    const createListingtDto: CreateListingtDto = {
      title: draft.title,
      size: draft.size,
      condition: draft.condition,
      description: draft.description,
      style: draft.style,
      category: draft.category,
      gender: draft.gender,
      subCategory: draft.subCategory,
      color: draft.color,
      placement,
      images: draft.images,
      price: draft.price,
    };

    try {
      await this.listingService.createListing(userId, createListingtDto);
      draft.delete();
      return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //Function that checks if a draft exist
  async draftExists(_id: string, user: User) {
    const draft =
      user.userType === UserRole.user || user.userType === UserRole.store
        ? await this.draftModel.findOne({ _id, userId: user })
        : await this.draftModel.findOne({ _id });

    if (!draft) {
      throw new BadRequestException('No draft was found');
    }

    return draft;
  }
}
