register_namespace('player.control');


player.control.is_loading = false;  // сейчас загружается следующий трек
player.control.timeout_start = 0;


player.control.start = function(type, name) {
    ui.show_loader_fullscreen();
    player.control.timeout_start = window.setTimeout(function(){
        var highest_timeout = setTimeout("$.noop()");
        for (var i = player.control.timeout_start; i < highest_timeout; i++) {
            clearTimeout(i);
        }
        ui.notification.show('error permanent', 'Не удалось начать воспроизведение станции.');
        ui.hide_loader_fullscreen();
        player.control.stop();
    }, 30000);
    player.playlist.clear();
    player.station.set(type, name);
    player.station.current.add_to_playlist(function(){
        window.clearTimeout(player.control.timeout_start);
        player.playlist.current_track_num = 0;
        player.control.is_loading = false;
        ui.hide_loader_fullscreen();
        ui.go_to_page('player');
        $('#search-widget__clear').click();
        userdata.recent_stations.add(type, name);
        ui.update_track_info();
        ui.update_station_info();
        player.audio.set_file(player.playlist.get_current_track().mp3_url);
        player.audio.play();
        ui.update_track_controls();
        player.station.current.add_to_playlist();
        if (config.mode == 'vk') {
            network.vkontakte.callMethod('setLocation', type+'/'+util.string.urlencode(name));
        }
        if (window['bridge']) {
            bridge.playing_change(true);
        }
    });
};


player.control.stop = function() {
    ui.go_to_page('tune');
    player.audio.stop();
    document.title = 'Твоёрадио';
    if (config.mode == 'vk') {
        network.vkontakte.callMethod('setTitle', 'Твоёрадио');
    }
    if (window['bridge']) {
        bridge.playing_change(false);
    }
    if (config.mode == 'vk') {
        network.vkontakte.callMethod('setLocation', '');
    }
};


player.control.next = function() {
    if (player.control.is_loading) {
        return;
    }
    function do_next() {
        if (player.control.is_loading) {
            player.control.is_loading = false;
            player.playlist.current_track_num++;
            ui.update_track_info();
            player.audio.set_file(player.playlist.get_current_track().mp3_url);
            player.audio.play();
            ui.update_playlist()
            ui.update_track_controls();
            if (player.playlist.list.length == player.playlist.current_track_num + 1) {
                // если в очереди не осталось треков
                player.station.current.add_to_playlist(do_next);
            }
        }
    }
    player.control.is_loading = true;
    ui.update_track_controls();
    if (player.playlist.list.length == player.playlist.current_track_num + 1) {
        player.station.current.add_to_playlist(do_next);
    } else {
        do_next();
    }
};



player.control.navigate = function(to) {
    player.control.is_loading = false;
    ui.update_track_controls();
    player.playlist.current_track_num = parseInt(to);
    if (player.playlist.current_track_num < 0) {
        player.playlist.current_track_num = 0;
    }
    ui.update_track_info();
    player.audio.set_file(player.playlist.get_current_track().mp3_url);
    player.audio.play();
    ui.update_playlist();
    ui.update_track_controls();
    if (player.playlist.list.length == player.playlist.current_track_num + 1) {
        // если в очереди не осталось треков
        player.station.current.add_to_playlist();
    }
};


player.control.previous = function() {
    player.control.navigate(player.playlist.current_track_num - 1);
};



player.control.pause = function() {
    player.audio.pause();
    ui.update_track_controls();
};


player.control.is_playing = function() {
    return player.audio.is_playing();
};