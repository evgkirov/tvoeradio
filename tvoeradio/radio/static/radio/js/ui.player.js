register_namespace('ui.player');

ui.player.update_info = function() {
    $('#track_artist').text(player.playlist.current_track.artist);
    $('#track_name').text(player.playlist.current_track.title);
}