register_namespace('player.station.vkrecommendations');


player.station.vkrecommendations.add_to_playlist = function(callback) {

    network.vkontakte.api('audio.get', {'uid': player.station.name}, function(data){
        if (!data.response.length) {
            ui.notification.show('error permanent', 'У этого пользователя нет добавленных аудиозаписей');
            ui.hide_loader_fullscreen();
            return;
        }
        var artist = util.random.choice(data.response).artist;
        network.lastfm.api('artist.getSimilar', {'artist': artist}, function(data) {
            var sim_artist = util.random.choice_similar(network.lastfm.arrayize(data.similarartists.artist));
            player.station.common.play_track_by_artist(sim_artist.name, callback);
        });
    });


};


player.station.vkrecommendations.get_html = function(name) {
    return 'рекомендации для <b>' + util.string.htmlspecialchars(name) + '</b>';
};


