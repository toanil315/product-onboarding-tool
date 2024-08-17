import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Tour } from './model/Tour.model';

@Controller('tours')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getTours() {
    return this.appService.getTours();
  }

  @Get(':id')
  getTourById(@Param('id') id: string) {
    return this.appService.getTourByID(id);
  }

  @Post()
  createTour(@Body() tour: Tour) {
    return this.appService.createTour(tour);
  }

  @Put()
  updateTour(@Body() tour: Tour) {
    return this.appService.updateTour(tour);
  }

  @Delete(':id')
  deleteTour(@Param('id') id: string) {
    return this.appService.deleteTour(id);
  }
}
