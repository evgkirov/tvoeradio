register_namespace('player.playlist');


player.playlist.playlist = [];
player.playlist.current_track_num = 0;


player.playlist.clear = function() {
    this.playlist = [];
    ui.update_playlist();
};

player.playlist.filter_tail = function(artist, title, ban_artist) {
    for (var i = player.playlist.playlist.length-1; i > this.current_track_num; i--) {
        if ((artist == player.playlist.playlist[i].artist) && (ban_artist || (title == player.playlist.playlist[i].title))) {
            player.playlist.playlist.splice(i, 1);
        }
    }
    ui.update_playlist();
}


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
        }
        player.playlist.playlist.push(track);
        ui.update_playlist()
        if (callback) {
            callback();
        }
    };
    var search_callback_notfound = function(){
        //network.vkontakte.search_audio(artist, title, search_callback, search_callback_notfound);
        player.station.current.add_to_playlist(callback);
    }
    if (userdata.bans.is_banned(artist, title)) {
        search_callback_notfound();
        return;
    }
    network.vkontakte.search_audio(artist, title, search_callback, search_callback_notfound);
};


player.playlist.get_current_track = function() {
    return this.playlist[this.current_track_num];
};

