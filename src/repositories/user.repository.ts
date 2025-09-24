import { prisma } from "../db";
import { BaseRepositoryImpl } from "./base";
import type { Prisma } from "@prisma/client";

type Where = Prisma.UserWhereInput;
type WhereUnique = Prisma.UserWhereUniqueInput;
type Select = Prisma.UserSelect;
// Prisma.UserInclude does not exist; remove or replace with appropriate type
type Include = unknown;
type OrderBy = Prisma.UserOrderByWithRelationInput;

export const userRepository = new BaseRepositoryImpl<
  Prisma.UserGetPayload<{
    select?: Select;
    include?: Include;
  }>,
  Where,
  WhereUnique,
  Select,
  Include,
  OrderBy
>(prisma.user);
