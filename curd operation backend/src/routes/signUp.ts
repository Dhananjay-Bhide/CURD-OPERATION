import express from "express";
import { signUp } from "../controller/adminController.js";
const router = express.Router();

router.post("/", signUp)

export default router;

