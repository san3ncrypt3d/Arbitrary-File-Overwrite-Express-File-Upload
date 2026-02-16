const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

const PORT = 3100;
const UPLOAD_DIR = path.join(__dirname, "uploads");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/efu-temp",
  createParentPath: true
}));

app.post("/upload", async (req, res) => {
  if (!req.files || !req.files.file) return res.status(400).send("No file uploaded");
  const f = req.files.file;

  const dest = path.join(UPLOAD_DIR, f.name);

  console.log("\n[SERVER] file.name    =", JSON.stringify(f.name));
  console.log("[SERVER] tempFilePath =", f.tempFilePath);
  console.log("[SERVER] dest         =", dest);

  try {
    await f.mv(dest);
    res.json({ ok: true, dest });
  } catch (e) {
    res.status(500).json({ ok: false, err: e.message });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`PoC server listening on http://127.0.0.1:${PORT}`);
  console.log(`Uploads dir: ${UPLOAD_DIR}`);
});
