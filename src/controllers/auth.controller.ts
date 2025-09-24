import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository";
import { config } from "../config";
import type { LoginDto, AuthResponseDto, UserDto } from "../dto/user";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password }: LoginDto = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user by username
    const user = await userRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      config.auth.secret,
      { expiresIn: config.auth.expiresIn } as SignOptions
    );

    // Return user data without password
    const userDto: UserDto = {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };

    const response: AuthResponseDto = {
      user: userDto,
      token,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, role = "USER" } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await userRepository.create({
      username,
      password: hashedPassword,
      role,
    });

    if (!user) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      config.auth.secret,
      { expiresIn: config.auth.expiresIn } as SignOptions
    );

    // Return user data without password
    const userDto: UserDto = {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };

    const response: AuthResponseDto = {
      user: userDto,
      token,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
