import { Injectable } from '@nestjs/common';
import { AppRepository } from './app.repository';
import { Tour } from './model/Tour.model';

@Injectable()
export class AppService {
  constructor(private readonly repository: AppRepository) {}

  getTours() {
    return this.repository.getTours();
  }

  getTourByID(tourId: string) {
    return this.repository.getTourById(tourId);
  }

  createTour(tour: Tour) {
    return this.repository.createTour(tour);
  }

  updateTour(tour: Tour) {
    return this.repository.updateTour(tour);
  }

  deleteTour(tourId: string) {
    return this.repository.deleteTour(tourId);
  }
}
