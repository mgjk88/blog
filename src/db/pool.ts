//creates only 1 instance of PrismaClient, singleton pattern

import { PrismaClient } from "@prisma/client";
export default new PrismaClient();
