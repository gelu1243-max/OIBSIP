import {PrismaClient} from '@prisma/client';
export const prisma =new PrismaClient();
export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("PostgreSQL connected sucessfully")
        } catch (error) {
            console.error("Error connecting to PostgreSQL:", error);
            process.exit(1);
    }; 
}
export default {connectDB, prisma}; 