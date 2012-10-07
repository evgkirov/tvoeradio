register_namespace('player.control');


player.control.is_loading = false;  // сейчас загружается следующий трек
player.control.timeout_start = 0;


player.control.start = function(type, name, campaign) {
    ui.show_loader_fullscreen();
    player.control.timeout_start = window.setTimeout(function(){
        $('#loader_fullscreen__cancel').fadeIn();
    }, 15000);
    player.playlist.clear();
    player.playlist.current_track_num = 0;
    player.station.set(type, name);
    player.station.current.add_to_playlist(function(){
        window.clearTimeout(player.control.timeout_start);
        player.playlist.current_track_num = 0;
        player.control.is_loading = false;
        ui.hide_loader_fullscreen();
        ui.go_to_page('player');
        $('#search-widget__clear').click();
        userdata.recent_stations.add(type, name, campaign);
        ui.update_track_info();
        ui.update_station_info();
        player.control.play_current_track();
        player.station.current.add_to_playlist();
        if (config.mode == 'vk') {
            network.vkontakte.callMethod('setLocation', type+'/'+util.string.urlencode(name));
        }
        if (window['bridge']) {
            bridge.playing_change(true);
        }
    });
};


player.control.play_current_track = function() {
    // Если слушаем альбом, то mp3_url может быть не подгружен
    var current_track = player.playlist.get_current_track();
    function do_play() {
        player.audio.set_file(current_track.mp3_url);
        player.audio.play();
        ui.update_track_controls();
    }
    player.audio.stop();
    if (current_track.mp3_url) {
        do_play();
    } else {
        network.vkontakte.search_audio(current_track.artist, current_track.title, function(mp3){
            current_track.duration = mp3.duration;
            current_track.mp3_url = mp3.url;
            current_track.vk_oid = mp3.owner_id;
            current_track.vk_aid = mp3.aid;
            current_track.vk_lyrics_id = mp3.lyrics_id;
            do_play();
        },
        function(){
            player.control.next();
        });
    }
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
            player.control.play_current_track();
            ui.update_playlist();
            if (player.playlist.list.length == player.playlist.current_track_num + 1) {
                // если в очереди не осталось треков
                player.station.current.add_to_playlist(do_next);
            }
        }
    }
    player.control.is_loading = true;
    ui.update_track_controls();
    if (player.playlist.list.length == player.playlist.current_track_num + 1) {
        var result = player.station.current.add_to_playlist(do_next);
        if (result == 'no_more_tracks') {
            player.control.stop();
        }
    } else {
        do_next();
    }
};



player.control.navigate = function(to) {
    player.control.is_loading = false;
    ui.update_track_controls();
    player.playlist.current_track_num = parseInt(to, 10);
    if (player.playlist.current_track_num < 0) {
        player.playlist.current_track_num = 0;
    }
    ui.update_track_info();
    player.control.play_current_track();
    ui.update_playlist();
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