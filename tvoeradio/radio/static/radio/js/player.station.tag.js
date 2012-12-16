register_namespace('player.station.tag');


player.station.tag.add_to_playlist = function(callback) {

    network.lastfm.api('tag.getTopArtists', {'tag': player.station.name, 'limit': 150}, function(data) {
        var artist = util.random.choice(network.lastfm.arrayize(data.topartists.artist));
        player.station.common.play_track_by_artist(artist.name, callback);
    });

};


player.station.tag.get_html = function(name) {
    return interpolate('tag <b>%s</b>', [util.string.htmlspecialchars(name)]);
};