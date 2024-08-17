import { Injectable, NotFoundException } from "@nestjs/common";
import StorageProvider from "./storage/storage.provider";
import { DATA_FOLDER_PATH, STORAGE_TYPE } from "./constant";
import { Tour } from "./model/Tour.model";
import * as fs from "fs";
import { checkFileExist, generateFileUtil } from "./utils";

@Injectable()
export class AppRepository {
  constructor(private readonly store: StorageProvider) {}

  async getTours(): Promise<Tour[]> {
    const tourFiles = await this.getExistedTourFiles();
    const tours = await Promise.all(
      tourFiles.map((path) => {
        return this.store.list<Tour[]>({
          storage: STORAGE_TYPE.FILE,
          where: {},
          metadata: {
            pathToFile: path,
            rootProperty: "data",
          },
        });
      })
    );
    return tours.flat() || [];
  }

  async getTourById(tourId: string): Promise<Tour> {
    const tourFilePath = await this.getTourFile(tourId);
    const isExist = await checkFileExist(tourFilePath);

    if (!isExist)
      throw new NotFoundException(`Tour with id "${tourId}" not found`);

    return this.store.get<Tour>({
      storage: STORAGE_TYPE.FILE,
      where: {
        id: {
          equals: tourId,
        },
      },
      metadata: {
        pathToFile: tourFilePath,
        rootProperty: "data",
      },
    });
  }

  async createTour(tour: Tour) {
    if (!tour.id) tour.id = Date.now().toString();
    const tourFilePath = `${DATA_FOLDER_PATH}/tour.${tour.id}.json`;
    await generateFileUtil(tourFilePath);

    await this.store.save(
      tour,
      {
        pathToFile: tourFilePath,
        rootProperty: "data",
      },
      STORAGE_TYPE.FILE
    );

    return tour;
  }

  async updateTour(tour: Tour) {
    const tourFilePath = `${DATA_FOLDER_PATH}/tour.${tour.id}.json`;
    const isExist = await checkFileExist(tourFilePath);
    if (!isExist)
      throw new NotFoundException(`Tour with id "${tour.id}" not found`);

    return this.store.save(
      {
        ...tour,
        steps: tour.steps || [],
      },
      {
        pathToFile: tourFilePath,
        rootProperty: "data",
      },
      STORAGE_TYPE.FILE
    );
  }

  async deleteTour(tourId: string) {
    const tourFilePath = `${DATA_FOLDER_PATH}/tour.${tourId}.json`;
    fs.promises.unlink(tourFilePath);
  }

  private async getExistedTourFiles() {
    const paths = (
      await fs.promises.readdir(DATA_FOLDER_PATH, {
        withFileTypes: true,
      })
    )
      .filter((item) => !item.isDirectory())
      .map((item) => `${DATA_FOLDER_PATH}/${item.name}`);
    return paths;
  }

  private async getTourFile(tourId: string) {
    const tourFilePath = `${DATA_FOLDER_PATH}/tour.${tourId}.json`;
    const isExist = await checkFileExist(tourFilePath);
    if (!isExist) {
      return null;
    }
    return tourFilePath;
  }
}
