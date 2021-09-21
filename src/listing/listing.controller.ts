import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Getuser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { Listing } from './listing.schema';
import { ListingService } from './listing.service';

@Controller('listing')
export class ListingController {
  constructor(private listingService: ListingService) {}

  @Get('getListings')
  @UseGuards(AuthGuard())
  async getListings(@Getuser() user: User): Promise<Listing[]> {
    return this.listingService.getListings(user);
  }
}
