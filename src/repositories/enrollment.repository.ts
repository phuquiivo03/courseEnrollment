import { prisma } from "../db";
import { BaseRepositoryImpl } from "./base";
import type { Prisma } from "@prisma/client";

type Where = Prisma.EnrollmentWhereInput;
type WhereUnique = Prisma.EnrollmentWhereUniqueInput;
type Select = Prisma.EnrollmentSelect;
type Include = Prisma.EnrollmentInclude;
type OrderBy = Prisma.EnrollmentOrderByWithRelationInput;

export const enrollmentRepository = new BaseRepositoryImpl<
  Prisma.EnrollmentGetPayload<{}>,
  Where,
  WhereUnique,
  Select,
  Include,
  OrderBy
>(prisma.enrollment);
