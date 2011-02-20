register_namespace('player.control');


player.control.start = function(type, name) {
    ui.show_loader_fullscreen();
	player.playlist.clear();
	player.station.set(type, name);
	player.station.current.add_to_playlist(function(){
	    player.playlist.current_track_num = 0;
	    ui.hide_loader_fullscreen();
		ui.go_to_page('player');
		userdata.recent_stations.add(type, name);
		ui.update_track_info();
		ui.update_station_info();
		player.audio.set_file(player.playlist.get_current_track().mp3_url);
		player.audio.play();
		ui.update_player_controls();
		player.station.current.add_to_playlist();
		if (config.mode == 'vk') {
		    network.vkontakte.callMethod('setLocation', type+'/'+util.string.urlencode(name));
		}
	});
};


player.control.stop = function() {
    ui.go_to_page('tune');
    player.audio.stop();
    if (config.mode == 'vk') {
        network.vkontakte.callMethod('setLocation', '');
    }
};


player.control.next = function() {
    function do_next() {
        player.playlist.current_track_num++;
        ui.update_track_info();
        player.audio.set_file(player.playlist.get_current_track().mp3_url);
        player.audio.play();
        ui.update_player_controls();
        player.station.current.add_to_playlist();
    }
    if (player.playlist.playlist.length == player.playlist.current_track_num + 1) {
        player.station.current.add_to_playlist(do_next);
    } else {
        do_next();
    }
};


player.control.previous = function() {
    player.playlist.current_track_num--;
    if (player.playlist.current_track_num < 0) {
        player.playlist.current_track_num = 0;
    }
    ui.update_track_info();
    player.audio.set_file(player.playlist.get_current_track().mp3_url);
    player.audio.play();
    ui.update_player_controls();
};


player.control.pause = function() {
    player.audio.pause();
    ui.update_player_controls();
};


player.control.is_playing = function() {
    return player.audio.is_playing();
};