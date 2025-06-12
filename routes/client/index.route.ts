import { Express } from "express";
import { topicRoutes } from "../client/topic.route";
import { songRoutes } from "../client/song.route";
import { favoriteSongRoutes } from "./favorite-song.route";
import { searchRoutes } from "../client/search.route";
import { userRoutes } from "./user.route";
import { homeRoutes } from "./home.route";
import { infoUser } from "../../middlewares/client/user.middleware";

const clientRoutes = (app: Express): void => {
  
  app.use("/", homeRoutes);

  app.use(`/topics`,infoUser, topicRoutes);

  app.use(`/songs`,infoUser, songRoutes);

  app.use(`/favorite-songs`,infoUser, favoriteSongRoutes);

  app.use(`/search`,infoUser, searchRoutes);

  app.use("/user", userRoutes);
};

export default clientRoutes;