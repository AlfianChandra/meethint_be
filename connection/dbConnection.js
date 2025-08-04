import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
export const useDbConnection = () => {
  const dbConnect = (path) => {
    mongoose
      .connect(path || process.env.DB_CONNECTION)
      .then(() => {
        console.log("[DATABASE]: Connected to Local Database");
      })
      .catch((err) => {
        console.error("[DATABASE]: Error connecting to Local Database:", err);
      });
  };

  return {
    dbConnect,
  };
};
