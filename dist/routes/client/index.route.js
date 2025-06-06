"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_route_1 = require("../client/topic.route");
const song_route_1 = require("../client/song.route");
const favorite_song_route_1 = require("./favorite-song.route");
const search_route_1 = require("../client/search.route");
const user_route_1 = require("./user.route");
const user_middleware_1 = require("../../middlewares/client/user.middleware");
const clientRoutes = (app) => {
    app.use(`/topics`, user_middleware_1.infoUser, topic_route_1.topicRoutes);
    app.use(`/songs`, user_middleware_1.infoUser, song_route_1.songRoutes);
    app.use(`/favorite-songs`, user_middleware_1.infoUser, favorite_song_route_1.favoriteSongRoutes);
    app.use(`/search`, user_middleware_1.infoUser, search_route_1.searchRoutes);
    app.use("/user", user_route_1.userRoutes);
};
exports.default = clientRoutes;
