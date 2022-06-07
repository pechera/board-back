import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "./middlewares/cors.js";

const prisma = new PrismaClient();

const app = express();
const port = 7000;

app.use(express.json());
app.use(cors);

app.get("/post", async (req, res) => {
  const result = await prisma.post.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
  res.send(result);
});

app.post("/post", async (req, res) => {
  const { title, content } = req.body;

  const result = await prisma.Post.create({
    data: {
      title,
      content,
    },
  });

  res.json(result);
});

app.get(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const result = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  res.json(result);
});

app.get(`/comment/:id`, async (req, res) => {
  const { id } = req.params;
  const result = await prisma.Comment.findMany({
    where: {
      postId: Number(id),
    },
  });

  res.json(result);
});

app.post(`/comment/:id`, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const result = await prisma.Comment.create({
    data: {
      title,
      content,
      postId: Number(id),
    },
  });

  await prisma.Post.update({
    where: {
      id: Number(id),
    },
    data: {
      totalCom: {
        increment: 1,
      },
      updatedAt: new Date(),
    },
  });

  res.json(result);
});

app.get(`/feed`, async (req, res) => {
  const { search } = req.query;

  const result = await prisma.post.findMany({
    where: {
      title: {
        contains: search,
      },
    },
  });
  console.log(result);

  res.json(result);
});

app.listen(port, () => {
  console.log(`Server at ${port}...`);
});
