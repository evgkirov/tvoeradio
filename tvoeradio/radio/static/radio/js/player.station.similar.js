register_namespace('player.station.similar');


player.station.similar.add_to_playlist = function(callback) {

    network.lastfm.api('artist.getSimilar', {'artist': player.station.name}, function(data) {
        var sim_artist = util.random.choice_similar(network.lastfm.arrayize(data.similarartists.artist));
        network.lastfm.api('artist.getTopTracks', {'artist': sim_artist.name, 'limit': 50}, function(data) {
            // Это для получения количества страниц было
            var total_pages = Math.ceil(data.toptracks['@attr'].totalPages / 3); // Защита от мусора
            var page = util.random.randint(1, total_pages);
            page = 1;
            network.lastfm.api('artist.getTopTracks', {'artist': sim_artist.name, 'limit': 5, 'page': page}, function(data) {
                // А вот тут уже вытаскиваем трек
                var track = util.random.choice(network.lastfm.arrayize(data.toptracks.track));
                player.playlist.add_track(sim_artist.name, track.name, callback);
            });
        });
    });
};


player.station.similar.get_html = function(name) {
    return 'похожее на <b>' + util.string.htmlspecialchars(name) + '</b>';
};