register_namespace('player.station.artist');


player.station.artist.add_to_playlist = function(callback) {
    player.station.artist.play_track_by_artist(player.station.name, callback);
};


player.station.artist.play_track_by_artist = function(artist, callback) {
    network.lastfm.api('artist.getTopTracks', {'artist': artist, 'limit': 50}, function(data) {
        // Это для получения количества страниц было
        var total_pages = Math.ceil(data.toptracks['@attr'].totalPages); // Защита от мусора
        var page = util.random.randint(1, total_pages);
        network.lastfm.api('artist.getTopTracks', {'artist': artist, 'limit': 50, 'page': page}, function(data) {
            // А вот тут уже вытаскиваем трек
            var track = util.random.choice(network.lastfm.arrayize(data.toptracks.track));
            player.playlist.add_track(artist, track.name, callback);
        });
    });
}


player.station.artist.get_html = function(name) {
    return 'только <b>' + util.string.htmlspecialchars(name) + '</b>';
};