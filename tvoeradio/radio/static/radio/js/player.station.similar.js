register_namespace('player.station.similar');


player.station.similar.add_to_playlist = function(callback) {

    network.lastfm.api('artist.getSimilar', {'artist': player.station.name}, function(data) {
        var sim_artist = util.random.choice_similar(network.lastfm.arrayize(data.similarartists.artist));
        network.lastfm.api('artist.getTopTracks', {'artist': sim_artist.name, 'limit': 50}, function(data) {
            player.station.artist.play_track_by_artist(sim_artist.name, callback);
        });
    });
};


player.station.similar.get_html = function(name) {
    return 'похожее на <b>' + util.string.htmlspecialchars(name) + '</b>';
};