import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import prisma from "../db/pool";

const createUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password) {
      res.status(400).end();
      return;
    }
    const passHash = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: passHash,
      },
      select: {
        id: true,
        username: true,
        datetime: true
      }
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const readUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      skip: req.body.skip,
      take: req.body.take,
      orderBy: req.body.orderBy,
      select: {
        id: true,
        username: true,
        datetime: true,
      },
    });
    if (!users) {
      res.status(404).end();
      return;
    }
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const readUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.userId,
      },
      select: {
        username: true,
        datetime: true,
      },
    });
    if (!user) {
      res.status(404).end();
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body.password || !req.body.username) {
      res.status(400).end();
      return;
    }

    const passHash = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.update({
      where: {
        id: req.params.userId,
      },
      data: {
        username: req.body.username,
        password: passHash,
      },
    });

    if (!user) {
      res.status(404).end();
      return;
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: req.params.userId,
      },
    });
    if (!user) {
      res.status(404).end();
      return;
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export default { createUser, readUsers, readUser, updateUser, deleteUser };
