import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function logAction(action: string, target: string, entityId: string, actorId: string) {
  await prisma.auditLog.create({
    data: {
      action,
      target,
      entityId,
      actorId,
    },
  });
}
