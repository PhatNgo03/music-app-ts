import dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response } from "express";

const app: Express = express();

const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/topics", (req: Request, res: Response) => {
  res.render("client/pages/topics/index.pug");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});