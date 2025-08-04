import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
export const useAuthController = () => {
  const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const userPassword = user.password;
    const verifyPassword = await bcrypt.compare(password, userPassword);
    if (!verifyPassword) {
      return res.status(401).json({ status: 401, message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        algorithm: "HS512",
      }
    );

    return res.status(200).json({
      status: 200,
      message: "Login successful",
      payload: {
        token: token,
      },
    });
  };

  const register = async (req, res) => {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res
        .status(400)
        .json({ status: 400, message: "All fields are required" });
    }

    const existingUser = await User.find({ username: username });
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ status: 409, message: "Username already exists" });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        username,
        password: hashedPassword,
      });
      await newUser.save();
      return res
        .status(201)
        .json({ status: 201, message: "User registered successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  };
  return {
    login,
    register,
  };
};
