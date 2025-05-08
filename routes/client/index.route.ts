import { Express } from "express";
import { topicRoutes } from "../client/topic.route";
import { songRoutes } from "../client/song.route";
import { favoriteSongRoutes } from "./favorite-song.route";
import { searchRoutes } from "../client/search.route";

const clientRoutes = (app: Express): void => {
  
  app.use(`/topics`, topicRoutes);

  app.use(`/songs`, songRoutes);

  app.use(`/favorite-songs`, favoriteSongRoutes);

  app.use(`/search`, searchRoutes);
};

export default clientRoutes;