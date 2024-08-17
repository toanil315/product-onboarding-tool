import * as fs from 'fs';

export const processAddOrUpdateItemToList = <T>(
  element: T,
  listData: T[] = [],
) => {
  const elementIndex = listData.findIndex(
    (item) => (item as any).id === (element as any).id,
  );
  if (elementIndex === -1) {
    listData.push(element);
  } else {
    listData[elementIndex] = element;
  }

  return listData;
};

export const checkFileExist = async (path: string) => {
  try {
    const isFileExist = await fs.promises.stat(path);
    if (isFileExist) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const generateFileUtil = async (path: string) => {
  if (!path) {
    throw new Error('file path does not exist');
  }

  const isFileExisted = await checkFileExist(path);

  if (!isFileExisted) {
    const initJsonData = JSON.stringify({ data: [] }, null, 2);
    await fs.promises.writeFile(path, initJsonData, 'utf-8');
  }
};
