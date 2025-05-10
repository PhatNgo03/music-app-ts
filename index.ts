import express, { Express } from "express";
import dotenv from 'dotenv';
dotenv.config();
import * as database from "./config/database";
database.connect();
import path from "path";
import clientRoutes from "./routes/client/index.route";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import adminRoutes from "./routes/admin/index.route";
import { systemConfig } from "./config/config";
const app: Express = express();

const port : number | string = process.env.PORT || 3000;

app.set("views", "./views");
app.set("view engine", "pug");

//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride("_method"));
//Client routes
clientRoutes(app);
//End Client routes

//Admin routes
adminRoutes(app);

app.use(express.static(`${__dirname}/public`));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

