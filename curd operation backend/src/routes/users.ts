import express from "express";
const router = express.Router();

import { getUsers, getUserById, addUser, updateUser, deleteUser } from "../controller/userController.js";
import { auth } from "../middleware/auth.js";
// import { auth } from "../middleware/auth.js"

// const { con } = require("../db/database");

router.get("/", getUsers);

// router.get("/:firstname", getUserById);
router.get("/:id", getUserById);

router.post("/", auth, addUser);

router.put("/:id", auth, updateUser);

router.delete("/:id", auth, deleteUser);

// router.get("/search/:sort_column&:sort_order", sortTable);

export default router;