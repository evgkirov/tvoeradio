register_namespace('player.station.library');


player.station.library.add_to_playlist = function(callback) {

    network.lastfm.api('library.getArtists', {'user': player.station.name, 'limit': 50}, function(data) {
        var total_pages = Math.ceil(data.artists['@attr'].totalPages / 3);
        var page = util.random.randint(1, total_pages);
        network.lastfm.api('library.getArtists', {'user': player.station.name, 'limit': 50, 'page': page}, function(data) {
            var artist = util.random.choice(network.lastfm.arrayize(data.artists.artist));
            player.station.common.play_track_by_artist(artist.name, callback);
        });
    });

};


player.station.library.get_html = function(name) {
    return interpolate('<b>%s</b>’s library', [util.string.htmlspecialchars(name)]);
};