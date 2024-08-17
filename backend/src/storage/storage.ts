import { STORAGE_TYPE } from "../constant/file.contant";
import { IMessage, TMetaDataMapper, TWhere } from "../model/fileType.model";

export interface Storage {
  get<T>(
    where: TWhere,
    metadata: TMetaDataMapper[STORAGE_TYPE]
  ): Promise<T | undefined>;

  list<T>(where: TWhere, metadata: TMetaDataMapper[STORAGE_TYPE]): Promise<T>;

  save<T>(data: T, metadata: TMetaDataMapper[STORAGE_TYPE]): Promise<IMessage>;

  saveList<T>(
    data: T,
    metadata: TMetaDataMapper[STORAGE_TYPE]
  ): Promise<IMessage>;

  delete(
    where: TWhere,
    metadata: TMetaDataMapper[STORAGE_TYPE]
  ): Promise<IMessage>;
}
