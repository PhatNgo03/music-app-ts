"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_route_1 = require("../client/topic.route");
const song_route_1 = require("../client/song.route");
const favorite_song_route_1 = require("./favorite-song.route");
const search_route_1 = require("../client/search.route");
const clientRoutes = (app) => {
    app.use(`/topics`, topic_route_1.topicRoutes);
    app.use(`/songs`, song_route_1.songRoutes);
    app.use(`/favorite-songs`, favorite_song_route_1.favoriteSongRoutes);
    app.use(`/search`, search_route_1.searchRoutes);
};
exports.default = clientRoutes;
