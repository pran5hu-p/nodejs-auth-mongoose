import mongoose from "mongoose";

export const connectmongoDB = async(connectionURL) => {
    const connection = mongoose.connect(connectionURL);
    return connection;
}