register_namespace('player.playlist');


player.playlist.list = [];
player.playlist.current_track_num = 0;


player.playlist.clear = function() {
    this.list = [];
    ui.update_playlist();
};

player.playlist.filter_tail = function(artist, title, ban_artist) {
    for (var i = player.playlist.list.length-1; i > this.current_track_num; i--) {
        if ((artist == player.playlist.list[i].artist) && (ban_artist || (title == player.playlist.list[i].title))) {
            player.playlist.list.splice(i, 1);
        }
    }
    ui.update_playlist();
};


player.playlist.autocorrect = function(artist, title) {
    var original_title = title;
    if (title.indexOf(' ') == -1) {
        title = title.replace(/_/g, ' '); // Hold_Your_Colour
    }
    title = title.replace(/^\d\d\.\s(.+)$/, '$1'); // 03. Watercolour
    title = title.replace(/^\d\d\s-\s(.+)$/, '$1'); // 03 - Watercolour
    title = title.replace(/^0\d\s(.+)$/, '$1'); // 03 Watercolour
    function endswith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
    if (endswith(title, ' - ' + artist)) {
        title = title.replace(' - ' + artist, ''); // Watercolour - Pendulum
    }
    if (title.indexOf(artist + ' - ') === 0) {
        title = title.replace(artist + ' - ', ''); // Pendulum - Watercolour
    }
    return title;
};


player.playlist.add_track = function(artist, title, callback) {
    var search_callback = function(mp3){
        var track = {
            'artist': artist,
            'title': title,
            'duration': mp3.duration,
            'mp3_url': mp3.url,
            'vk_oid': mp3.owner_id,
            'vk_aid': mp3.aid,
            'vk_lyrics_id': mp3.lyrics_id,
            'lastfm_loved': false
        };
        player.playlist.list.push(track);
        ui.update_playlist();
        if (callback) {
            callback();
        }
    };
    var search_callback_notfound = function(){
        setTimeout(function() {
            player.station.current.add_to_playlist(callback);
        }, 1000);
    };
    title = player.playlist.autocorrect(artist, title);
    if (userdata.bans.is_banned(artist, title)) {
        search_callback_notfound();
        return;
    }
    var title_lc = title.toLowerCase();
    var include_remixes = (player.station.include_remixes || player.station.current.include_remixes);
    if (!include_remixes && (
            (title_lc.indexOf('remix') > -1) ||
            ((title_lc.indexOf('mix)') > -1) && (title_lc.indexOf('original mix)') == -1)) ||
            ((title_lc.indexOf('mix]') > -1) && (title_lc.indexOf('original mix]') == -1))
       )) {
        search_callback_notfound();
        return;
    }
    var last_tracks = this.list.slice(-5);
    for (var i = 0; i < last_tracks.length; i++) {
        var max_distance = (title.length > 10) ? 5 : 1;
        if (util.string.levenshtein(title, last_tracks[i].title) <= max_distance) {
            search_callback_notfound();
            return;
        }
    };
    network.vkontakte.search_audio(artist, title, search_callback, search_callback_notfound);
};


player.playlist.add_tracks = function(list, callback, additional_info) {
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var track = {
            'artist': item.artist.name,
            'title': item.name,
            'duration': null,
            'mp3_url': null,
            'vk_oid': null,
            'vk_aid': null,
            'vk_lyrics_id': null,
            'lastfm_loved': false
        };
        for (var key in additional_info) {
            track[key] = additional_info[key];
        }
        player.playlist.list.push(track);
    }
    ui.update_playlist();
    if (callback) {
        callback();
    }
};


player.playlist.get_current_track = function() {
    return this.list[this.current_track_num];
};

