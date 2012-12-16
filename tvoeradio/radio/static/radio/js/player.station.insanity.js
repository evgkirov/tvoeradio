register_namespace('player.station.insanity');


player.station.insanity.add_to_playlist = function(callback) {
    $.post('/app/_/random_station/', {}, function(data){
        var name = data.name;
        if (data.type == 'tag') {
            network.lastfm.api('tag.getTopArtists', {'tag': name, 'limit': 150}, function(data) {
                var artist = util.random.choice(network.lastfm.arrayize(data.topartists.artist));
                player.station.common.play_track_by_artist(artist.name, callback);
            });
        } else {
            network.lastfm.api('artist.getSimilar', {'artist': name}, function(data) {
                var sim_artists = network.lastfm.arrayize(data.similarartists.artist);
                sim_artists.splice(0, 0, {
                    'match': 1,
                    'name': name
                });
                var sim_artist = util.random.choice(sim_artists);
                player.station.common.play_track_by_artist(sim_artist.name, callback);
            });
        }
    });
};


player.station.insanity.get_html = function(name) {
    return gettext('insanity');
};