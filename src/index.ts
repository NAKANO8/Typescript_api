import express from "express";
const app = express();

app.get("/", (_req, res) => res.json({ ok: true, msg: "Hot reload works!" }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server on http://localhost:${port}`));
