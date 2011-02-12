register_namespace('player.control');


player.control.start = function(type, name) {
    ui.show_loader_fullscreen();
	player.playlist.clear();
	player.station.set(type, name);
	player.station.current.add_to_playlist(function(){
	    player.playlist.current_track_num = 0;
	    ui.hide_loader_fullscreen();
		ui.go_to_page('player');
		ui.update_track_info();
		ui.update_station_info();
		player.audio.set_file(player.playlist.get_current_track().mp3_url);
		player.audio.play();
		player.station.current.add_to_playlist();
	});
}


player.control.stop = function() {
    ui.go_to_page('tune');
    player.audio.stop();
}


player.control.next = function() {
    player.playlist.current_track_num++;
    ui.update_track_info();
    player.audio.set_file(player.playlist.get_current_track().mp3_url);
    player.audio.play();
    player.station.current.add_to_playlist();
}