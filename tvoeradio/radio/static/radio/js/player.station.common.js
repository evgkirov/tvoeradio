register_namespace('player.station.common');


player.station.common.play_track_by_artist = function(artist, callback) {

    network.lastfm.api('artist.getTopTracks', {'artist': artist, 'limit': 50}, function(data) {
        var page = util.random.randint(1, data.toptracks['@attr'].totalPages);
        network.lastfm.api('artist.getTopTracks', {'artist': artist, 'limit': 50, 'page': page}, function(data) {
            var track = util.random.choice(network.lastfm.arrayize(data.toptracks.track));
            player.playlist.add_track(artist, track.name, callback);
        });
    });

};
