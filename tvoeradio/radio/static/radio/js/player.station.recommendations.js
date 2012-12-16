register_namespace('player.station.recommendations');


player.station.recommendations.add_to_playlist = function(callback) {

    network.lastfm.api('user.getRecommendedArtists', {}, function(data) {
        var total_pages = Math.ceil(data.recommendations['@attr'].totalPages / 3);
        var page = util.random.randint(1, total_pages);
        network.lastfm.api('user.getRecommendedArtists', {'page': page}, function(data) {
            var artist = util.random.choice(network.lastfm.arrayize(data.recommendations.artist));
            player.station.common.play_track_by_artist(artist.name, callback);
        });
    });

};


player.station.recommendations.get_html = function(name) {
    return interpolate('recommendations for <b>%s</b>', [util.string.htmlspecialchars(name)]);
};


player.station.recommendations.noshare = true;