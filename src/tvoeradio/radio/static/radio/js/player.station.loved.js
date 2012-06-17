register_namespace('player.station.loved');


player.station.loved.add_to_playlist = function(callback) {

    network.lastfm.api('user.getLovedTracks', {'user': player.station.name, 'limit': 50}, function(data) {
        var page = util.random.randint(1, data.lovedtracks['@attr'].totalPages);
        network.lastfm.api('user.getLovedTracks', {'user': player.station.name, 'limit': 50, 'page': page}, function(data) {
            var track = util.random.choice(network.lastfm.arrayize(data.lovedtracks.track));
            player.playlist.add_track(track.artist.name, track.name, callback);
        });
    });

};


player.station.loved.get_html = function(name) {
    return 'любимое <b>' + util.string.htmlspecialchars(name) + '</b>';
};