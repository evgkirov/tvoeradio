register_namespace('player.control');


player.control.start = function(type, name) {
	player.playlist.clear();
	player.station.set(type, name);
	player.station.current.add_to_playlist(function(){
	    player.playlist.current_track = player.playlist.playlist[0];
		ui.go_to_page('player');
		ui.player.update_info();
		$('#mp3player').jPlayer('setMedia', {'mp3': player.playlist.current_track.mp3_url}).jPlayer("play");
		player.station.current.add_to_playlist();
	});
	
}
