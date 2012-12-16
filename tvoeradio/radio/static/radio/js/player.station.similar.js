register_namespace('player.station.similar');


player.station.similar.add_to_playlist = function(callback) {
    network.lastfm.api('artist.getSimilar', {'artist': player.station.name}, function(data) {
        var sim_artists = network.lastfm.arrayize(data.similarartists.artist);
        if (!player.station.only_similar) {
            sim_artists.splice(0, 0, {
                'match': 1,
                'name': player.station.name
            });
        }
        var sim_artist = util.random.choice_similar(sim_artists);
        player.station.common.play_track_by_artist(sim_artist.name, callback);
    });
};


player.station.similar.get_html = function(name) {
    return interpolate('similar to <b>%s</b>', [util.string.htmlspecialchars(name)]);
};