import { Router } from "express";
import { parseQueries, handleError } from "../utils/controlUtils";
import controller from "../controllers/userController";
const router = Router();

//create
router.post("/", controller.createUser, handleError);

//read
router.get(
  "/",
  parseQueries(["username", "datetime"]),
  controller.readUsers,
  handleError
);
router.get("/:userId", controller.readUser, handleError);

//update
router.put("/:userId", controller.updateUser, handleError);

//delete
router.delete("/:userId", controller.deleteUser, handleError);
export default router;
