import { RequestHandler } from "express";
import prisma from "../db/pool";

const readPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      skip: req.body.skip,
      take: req.body.take,
      orderBy: req.body.orderBy,
      where: {
        status: "PUBLISHED",
      },
      select: {
        id: true,
        datetime: true,
        title: true,
        content: true,
        User: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!posts) {
      res.status(404).json({ error: "posts not found" });
      return;
    }
    res.status(200).json(JSON.stringify(posts));
  } catch (error) {
    next(error);
  }
};

const readPost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        datetime: true,
        title: true,
        content: true,
        User: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!post) {
      res.status(404).json({ error: "post not found" });
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const readPostComments: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      res.status(400).json({ error: "bad request" });
      return;
    }
    const comments = await prisma.comment.findMany({
      skip: req.body.skip,
      take: req.body.take,
      orderBy: req.body.orderBy,
      where: {
        post_id: postId,
        Post: {
          status: "PUBLISHED",
        },
      },
      select: {
        id: true,
        datetime: true,
        content: true,
        User: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!comments) {
      res.status(404).json({ error: "comments not found" });
      return;
    }
    res.status(200).json(JSON.stringify(comments));
  } catch (error) {
    next(error);
  }
};

const readPostComment: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    if (!postId || !commentId) {
      res.status(400).json({ error: "bad request" });
      return;
    }
    const comment = await prisma.comment.findUnique({
      where: {
        post_id: postId,
        id: commentId,
        Post: {
          status: "PUBLISHED",
        },
      },
    });
    if (!comment) {
      res.status(404).json({ error: "comment not found" });
      return;
    }
    res.status(200).json(JSON.stringify(comment));
  } catch (error) {
    next(error);
  }
};

const createPost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }
    if (!req.body || !req.body.status || !req.body.title || !req.body.content) {
      res.status(400).json({ error: "bad request" });
      return;
    }
    const post = await prisma.post.create({
      data: {
        author_id: req.user.id,
        status: req.body.status,
        title: req.body.title,
        content: req.body.content,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const updatePost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    if (!postId || !req.body.title || !req.body.content) {
      res.status(400).json({ error: "bad request" });
    }
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title: req.body.title,
        content: req.body.content,
        datetime: new Date().toISOString(),
      },
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      res.status(400).json({ error: "bad request" });
      return;
    }
    const post = await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    if (!post) {
      res.status(404).json({ error: "post not found" });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export default {
  createPost,
  readPost,
  readPosts,
  readPostComments,
  readPostComment,
  updatePost,
  deletePost,
};
