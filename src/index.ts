import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.get("/", (_req, res) => res.json({ ok: true, msg: "API up" }));

// Users: list
app.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
  res.json(users);
});

// Users: get by id
app.get("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

// Users: create
app.post("/users", async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: "email required" });
  try {
    const user = await prisma.user.create({ data: { email, name } });
    res.status(201).json(user);
  } catch (e: any) {
    if (e.code === "P2002") {
      return res.status(409).json({ error: "email already exists" });
    }
    console.error(e);
    res.status(500).json({ error: "internal error" });
  }
});

// Users: delete
app.delete("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.user.delete({ where: { id } }).catch(() => null);
  res.status(204).end();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server on http://localhost:${port}`));
