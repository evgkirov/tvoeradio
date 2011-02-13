register_namespace('player.playlist');


player.playlist.playlist = [];
player.playlist.current_track_num = 0;


player.playlist.clear = function() {
    this.playlist = [];
};


player.playlist.add_track = function(artist, title, callback) {
    var search_callback = function(mp3){
        var track = {
            'artist': artist,
            'title': title,
            'mp3_url': mp3.url
        }
        player.playlist.playlist.push(track);
        if (callback) {
            callback();
        }
    };
    var search_callback_notfound = function(){
        //network.vkontakte.search_audio(artist, title, search_callback, search_callback_notfound);
        player.station.current.add_to_playlist(callback);
    }
    network.vkontakte.search_audio(artist, title, search_callback, search_callback_notfound);
};


player.playlist.get_current_track = function() {
    return this.playlist[this.current_track_num];
};