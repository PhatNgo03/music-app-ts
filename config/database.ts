import mongoose from "mongoose";

export const connect = async (): Promise<void> => {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        throw new Error("MONGO_URL is not defined in environment variables");
    }

    try {
        await mongoose.connect(mongoUrl);
        console.log("Connect mongodb success");
    } catch (error) {
        console.log("Connect mongodb error", error);
    }
};
