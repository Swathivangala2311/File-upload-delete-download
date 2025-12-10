const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files allowed'), false);
};

const upload = multer({ storage, fileFilter });

app.post('/documents/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  const stmt = db.prepare(`INSERT INTO documents (filename, filepath, filesize) VALUES (?, ?, ?)`);

  stmt.run(req.file.originalname, req.file.filename, req.file.size, function (err) {
    if (err) return res.status(500).json({ success: false, message: 'Database insert failed' });

    res.json({ success: true, message: 'File uploaded successfully', id: this.lastID });
  });
});

app.get('/documents', (req, res) => {
  db.all(`SELECT * FROM documents ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, documents: rows });
  });
});

app.get('/documents/:id', (req, res) => {
  db.get(`SELECT * FROM documents WHERE id=?`, [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false });

    res.download(path.join(UPLOADS_DIR, row.filepath), row.filename);
  });
});

app.delete('/documents/:id', (req, res) => {
  db.get(`SELECT * FROM documents WHERE id=?`, [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false });

    const filePath = path.join(UPLOADS_DIR, row.filepath);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    db.run(`DELETE FROM documents WHERE id=?`, [req.params.id]);

    res.json({ success: true, message: 'File deleted successfully' });
  });
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
