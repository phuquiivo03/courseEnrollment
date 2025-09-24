import type { AppResponse } from "../types/response";
import type { PrismaFindManyOptions, PrismaFindOneOptions } from "./type";
import { prisma } from "../db";

interface BaseRepository<T, Where, WhereUnique, Select, Include, OrderBy> {
  create(data: Partial<T>): Promise<T | null>;
  findOne(
    options: PrismaFindOneOptions<WhereUnique, Select, Include>
  ): Promise<T | null>;
  findById(
    id: any,
    options?: PrismaFindOneOptions<WhereUnique, Select, Include>
  ): Promise<T | null>;
  update(id: any, data: Partial<T>): Promise<T | null>;
  findAll(
    options?: PrismaFindManyOptions<T, Where, Select, Include, OrderBy>
  ): Promise<AppResponse<T[]>>;
  findMany(
    options?: PrismaFindManyOptions<T, Where, Select, Include, OrderBy>
  ): Promise<AppResponse<T[]>>;
}

class BaseRepositoryImpl<T, Where, WhereUnique, Select, Include, OrderBy>
  implements BaseRepository<T, Where, WhereUnique, Select, Include, OrderBy>
{
  model: any;
  constructor(model: any) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T | null> {
    console.log("data", data);
    const created = await this.model.create({ data });
    return created || null;
  }

  async createMany(data: Partial<T[]>): Promise<T[] | null> {
    const created = await this.model.createMany({ data });
    // Prisma createMany returns count; for uniformity, fallback to fetching
    if (created && typeof created.count === "number") {
      return null;
    }
    return created || null;
  }

  async findOne(
    options: PrismaFindOneOptions<WhereUnique, Select, Include>
  ): Promise<T | null> {
    return this.model.findUnique(options);
  }

  async findById(
    id: any,
    options?: PrismaFindOneOptions<WhereUnique, Select, Include>
  ): Promise<T | null> {
    // Assume id is part of WhereUnique
    return this.model.findUnique({ ...(options || {}), where: { id } as any });
  }

  async update(id: any, data: Partial<T>): Promise<T | null> {
    return this.model.update({ where: { id } as any, data });
  }

  async delete(id: any): Promise<T | null> {
    return this.model.delete({ where: { id } as any });
  }

  async findAll(
    options?: PrismaFindManyOptions<T, Where, Select, Include, OrderBy>
  ): Promise<AppResponse<T[]>> {
    return this.findMany(options);
  }

  async findMany(
    options?: PrismaFindManyOptions<T, Where, Select, Include, OrderBy>
  ): Promise<AppResponse<T[]>> {
    const page = options?.pagination?.page || 1;
    const limit = options?.pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await prisma.$transaction([
      this.model.findMany({
        where: options?.where,
        select: options?.select,
        include: options?.include,
        orderBy: options?.orderBy,
        skip,
        take: limit,
      }),
      this.model.count({ where: options?.where }),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export { BaseRepositoryImpl, type BaseRepository };
