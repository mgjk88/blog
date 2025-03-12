import { Router } from "express";
import { parseQueries } from "../utils/controlUtils";
import controller from "../controllers/postController";
const router = Router();

//create
//protected route
router.post("/", controller.createPost);

//read
router.get(
  "/",
  parseQueries(["title", "datetime", "content"]),
  controller.readPosts
);
router.get("/:postId", controller.readPost);
router.get(
  "/:postId/comments",
  parseQueries(["datetime", "content"]),
  controller.readPostComments
);
router.get("/:postId/comments/:commentId", controller.readPostComment);

//update
//protected route
router.put("/:postId", controller.updatePost);

//delete
//protected route
router.delete("/:postId", controller.deletePost);
export default router;
