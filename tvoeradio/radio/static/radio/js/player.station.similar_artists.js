register_namespace('player.station.similar_artists');


player.station.similar_artists.add_to_playlist = function(callback) {

    network.lastfm.api('artist.getSimilar', {'artist': player.station.name}, function(data) {

        var sim_artist = util.random.choice_similar(network.lastfm.arrayize(data.similarartists.artist));

        network.lastfm.api('artist.getTopTracks', {'artist': sim_artist.name}, function(data) {
            var track = util.random.choice(data.toptracks.track);
            player.playlist.add_track(sim_artist.name, track.name, callback);
            
            /*if (callback) {
                callback();
            }*/
        });
    });
};


player.station.similar_artists.get_html = function(name) {
    return 'похожее на <b>' + util.string.htmlspecialchars(name) + '</b>';
};