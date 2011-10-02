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


player.audio.is_playing = function() {
    return !$('#mp3player').data('jPlayer').status.paused;
}


player.audio.pause = function() {
    if (this.is_playing()) {
        $('#mp3player').jPlayer('pause');
    } else {
        $('#mp3player').jPlayer('play');
    }
};


player.audio.seek = function(time) {
    $('#mp3player').jPlayer('play', time);
};


player.audio.status = function() {
    return $('#mp3player').data('jPlayer').status;
};