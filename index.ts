import express, { Express } from "express";
import dotenv from 'dotenv';
dotenv.config();
import * as database from "./config/database";
database.connect();

import clientRoutes from "./routes/client/index.route";

const app: Express = express();

const port : number | string = process.env.PORT || 3000;

app.set("views", "./views");
app.set("view engine", "pug");

//Client routes
clientRoutes(app);
//End Client routes

app.use(express.static(`${__dirname}/public`));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});