import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../db/pool";
import { RequestHandler } from "express";
import { UserPayload } from "../../types";

const login: RequestHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      res.status(401).end();
      return;
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      res.status(401).end();
      return;
    }

    let payload = { id: user.id, username: user.username };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    if (!accessToken || !refreshToken) {
      next(new Error("token generation fail"));
      return;
    }
    res.status(200).cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const logout: RequestHandler = (req, res, next) => {
    res.status(200).clearCookie("refreshToken");
};

const authenticate: RequestHandler = (req, res, next) => {
  const authHdr = req.headers["authorization"];
  if (!authHdr) {
    res.status(401).end();
    return;
  }
  const token = authHdr.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) {
    res.status(403).end();
    return;
  }
  req.user = payload;
  next();
};

const refresh: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(403).json({ message: "no refresh token" });
      return;
    }
    const payload = verifyToken(refreshToken);
    if(!payload){
        res.status(403).end();
        return;
    }
    const accessToken = generateAccessToken(payload);
    res.status(200).json({accessToken});

  } catch (error) {
    next(error);
  }
};

function generateAccessToken(payload: UserPayload): string | null {
  try {
    return jwt.sign(payload, process.env.ACCESS_SECRET as string, {
      expiresIn: "5min",
    });
  } catch (error) {
    return null;
  }
}

function generateRefreshToken(payload: UserPayload): string | null {
  try {
    return jwt.sign(payload, process.env.REFRESH_SECRET as string, {
      expiresIn: "1day",
    });
  } catch (error) {
    return null;
  }
}

function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, process.env.ACCESS_SECRET as string) as UserPayload;
  } catch (error) {
    return null;
  }
}

export default { login, logout, authenticate, refresh};
