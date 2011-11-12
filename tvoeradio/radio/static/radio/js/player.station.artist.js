register_namespace('player.station.artist');


player.station.artist.add_to_playlist = function(callback) {
    player.station.common.play_track_by_artist(player.station.name, callback);
};


player.station.artist.get_html = function(name) {
    return 'только <b>' + util.string.htmlspecialchars(name) + '</b>';
};