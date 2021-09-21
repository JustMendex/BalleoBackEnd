import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.schema';
import { CreateListingtDto } from './dto/create-listing.dto';
import { Listing, ListingDocument } from './listing.schema';

@Injectable()
export class ListingService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
  ) {}

  async getListings(user: User): Promise<Listing[]> {
    const listings = this.listingModel.find({ userId: user });

    return listings;
  }

  async createListing(
    user: User,
    createListingtDto: CreateListingtDto,
  ): Promise<Listing> {
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
      placement,
      images,
      price,
    } = createListingtDto;

    const listing = new this.listingModel();
    listing.userId = user;
    listing.title = title;
    listing.size = size;
    listing.condition = condition;
    listing.description = description;
    listing.style = style;
    listing.category = category;
    listing.gender = gender;
    listing.subCategory = subCategory;
    listing.color = color;
    listing.placement = placement;
    listing.images = images;
    listing.price = price;

    try {
      await listing.save();
      listing.depopulate('userId');
      return listing;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }
}
