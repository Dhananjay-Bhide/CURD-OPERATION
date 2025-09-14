import express from "express";
const router = express.Router();

import { getUsers, getUserById, addUser, updateUser, deleteUser } from "../controller/userController.js";

// const { con } = require("../db/database");

router.get("/", getUsers);

// router.get("/:firstname", getUserById);
router.get("/:id", getUserById);

router.post("/", addUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

// router.get("/search/:sort_column&:sort_order", sortTable);

export default router;