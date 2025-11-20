import express from "express";
import { saveData, loadData } from "../controllers/trackerController.js";
const router = express.Router();
router.post("/save", saveData);
router.get("/load", loadData);
export default router;
