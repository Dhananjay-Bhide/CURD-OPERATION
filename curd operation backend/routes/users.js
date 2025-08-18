const express = require("express");
const router = express.Router();

const {getUsers, getUserById, addUser, updateUser, deleteUser} = require("../controller/userController");

// const { con } = require("../db/database");

router.get("/", getUsers);

router.get("/:id", getUserById);

router.post("/", addUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;
