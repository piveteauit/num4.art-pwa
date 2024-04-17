import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

// const models = global?.prisma ? global.prisma : new PrismaClient();

export default global?.prisma ? global.prisma : new PrismaClient();
