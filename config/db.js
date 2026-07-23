import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Idea-drop",
        });
        console.log(
            `MongoDB Connected: ${conn.connection.host} | db: ${conn.connection.name}`
        );
    }catch(error){
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;