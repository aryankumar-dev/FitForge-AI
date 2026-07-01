import express from "express";
import { getGyms } from "../controllers/gymController.js";

const router = express.Router();

router.get("/", getGyms);

export default router;
