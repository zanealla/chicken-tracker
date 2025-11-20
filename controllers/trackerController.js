import fs from "fs-extra";
import path from "path";

const dataDir = path.resolve("./data");

export const saveData = async (req, res) => {
  try {
    const { userId, startDate } = req.body;
    if (!userId || !startDate)
      return res.status(400).json({ message: "Missing userId or startDate" });

    const filePath = path.join(dataDir, `${userId}_${startDate}.json`);
    await fs.writeJson(filePath, req.body, { spaces: 2 });
    res.json({ success: true, message: "Data saved", file: filePath });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const loadData = async (req, res) => {
  try {
    const { userId, startDate } = req.query;
    const filePath = path.join(dataDir, `${userId}_${startDate}.json`);
    if (!(await fs.pathExists(filePath)))
      return res.status(404).json({ message: "No saved data found" });
    const data = await fs.readJson(filePath);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
