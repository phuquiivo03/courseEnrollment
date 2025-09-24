export interface PrismaPaginationOptions {
  page?: number; // page number
  limit?: number; // items per page
}

export interface PrismaFindManyOptions<T, Where, Select, Include, OrderBy> {
  where?: Where; // filter conditions
  select?: Select; // select specific fields
  include?: Include; // join relations
  orderBy?: OrderBy | OrderBy[]; // sort
  pagination?: PrismaPaginationOptions;
}

export interface PrismaFindOneOptions<WhereUnique, Select, Include> {
  where: WhereUnique; // unique filter (id, etc.)
  select?: Select;
  include?: Include;
}
