register_namespace('player.audio');


player.audio.set_file = function(mp3_url) {
    $('#mp3player').jPlayer('setMedia', {'mp3': mp3_url});
};


player.audio.play = function() {
    $('#mp3player').jPlayer('play');
    player.playlist.get_current_track().started = Math.round((new Date()).getTime()/1000);
};


player.audio.stop = function() {
    $('#mp3player').jPlayer('stop');
};

