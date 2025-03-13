import { Router } from "express";
import { parseQueries, handleError } from "../utils/controlUtils";
import controller from "../controllers/userController";
import auth from "../controllers/authController";
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
//protected route
router.put("/:userId", auth.authenticate, controller.updateUser, handleError);

//delete
//protected route
router.delete("/:userId", auth.authenticate, controller.deleteUser, handleError);
export default router;
