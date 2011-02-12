register_namespace('ui.player');


ui.player.update_track_info = function() {
    $('#track_artist').text(player.playlist.get_current_track().artist);
    $('#track_name').text(player.playlist.get_current_track().title);
    ui.infoblock.show($('#trackinfo_panel'), 'artist', player.playlist.get_current_track().artist);
}

ui.player.update_station_info = function() {
    $('#station_name').html(player.station.get_current_html());
}