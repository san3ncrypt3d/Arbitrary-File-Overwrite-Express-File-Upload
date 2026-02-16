const axios = require("axios");
const FormData = require("form-data");

const PORT = 3100;

async function upload(filename, content) {
  const form = new FormData();
  form.append("file", Buffer.from(content), { filename });

  const r = await axios.post(`http://127.0.0.1:${PORT}/upload`, form, {
    headers: form.getHeaders(),
    validateStatus: () => true
  });

  console.log("\n[CLIENT] filename:", JSON.stringify(filename));
  console.log("[CLIENT] status  :", r.status);
  console.log("[CLIENT] body    :", r.data);
}

upload("ok.txt", "OK");
