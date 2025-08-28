const express = require("express");
const router = express.Router();

const {getUsers, getUserById, addUser, updateUser, deleteUser, sortTable} = require("../controller/userController");

// const { con } = require("../db/database");

router.get("/", getUsers);

router.get("/:firstname", getUserById);

router.post("/", addUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

// router.get("/search/:sort_column&:sort_order", sortTable);

module.exports = router;
