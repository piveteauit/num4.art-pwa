import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

// const models = global?.prisma ? global.prisma : new PrismaClient();

const globalPrisma = global?.prisma ? global.prisma : new PrismaClient()

globalPrisma.$use(async (params, next) => {
  if (params.action === "create" && params.model === "VerificationToken") { 
    await globalPrisma.verificationToken.deleteMany({
      where: { identifier: params.args.data.identifier}
    })
  }
  return await next(params);
})

export default globalPrisma;
