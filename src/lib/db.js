import { PrismaClient } from '@prisma/client';

if (!global.prisma) {
    global.prisma = new PrismaClient();
}

export const db = global.prisma;

if (process.env.NODE_ENV !== 'production') {
    global.prisma = db;
}