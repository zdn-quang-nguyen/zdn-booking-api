import { Filtering } from 'src/decorators/filter.decorator';
import { ILike } from 'typeorm';

export const getWhere = (filter: Filtering) => {
  if (!filter) return {};

  return {
    [filter.property]: ILike(`%${filter.value}%`),
  };
};
