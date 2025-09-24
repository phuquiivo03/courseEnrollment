import { prisma } from "../db";
import { BaseRepositoryImpl } from "./base";
import type { Prisma } from "@prisma/client";

type Where = Prisma.CourseWhereInput;
type WhereUnique = Prisma.CourseWhereUniqueInput;
type Select = Prisma.CourseSelect;
type Include = Prisma.CourseInclude;
type OrderBy = Prisma.CourseOrderByWithRelationInput;

export const courseRepository = new BaseRepositoryImpl<
  Prisma.CourseGetPayload<{}>,
  Where,
  WhereUnique,
  Select,
  Include,
  OrderBy
>(prisma.course);
