import express from 'express';
import multer from 'multer';
import path from 'path';
import { parseCSV } from '../lib/parseCSV.js';
import { parsePDF } from '../lib/parsePDF.js';
import { analyzeStats } from '../lib/analyzeStats.js';
import { generateInsights } from '../lib/generateInsights.js';
import { authMiddleware } from '../middleware/auth.js';


const router = express.Router();


const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, './uploads'),
filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });


router.post('/analyze', authMiddleware, upload.single('file'), async (req, res) => {
try {
const file = req.file;
if (!file) return res.status(400).json({ error: 'No file uploaded' });


let students = [];
const ext = path.extname(file.originalname).toLowerCase();


if (ext === '.csv' || file.mimetype.includes('csv')) {
students = await parseCSV(file.path);
} else if (ext === '.pdf' || file.mimetype.includes('pdf')) {
students = await parsePDF(file.path);
} else {
return res.status(400).json({ error: 'Unsupported file type' });
}


const stats = analyzeStats(students);


// Call LLM to generate insights
const insights = await generateInsights(stats);


res.json({ stats, insights });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error', details: err.message });
}
});


export default router;