register_namespace('userdata.bans');


userdata.bans.list = [];


userdata.bans.add = function(artist, title, ban_artist) {
    var data = {
        'artist': artist,
        'title': ban_artist ? '' : title,
        'ban_artist': ban_artist ? 1 : ''
    };
    $.post('/app/_/ban/add/', data, function(data){
        userdata.bans.list = data.bans;
        player.playlist.filter_tail(artist, title, ban_artist);
        player.control.next();
        var message = '';
        if (ban_artist) {
            message = gettext('This artist is in your ban list now and it will be not played again ever.');
        } else {
            message = gettext('This track is in your ban list now and it will be not played again ever.');
        }
        ui.notification.show('info', message);
    });
};


userdata.bans.is_banned = function(artist, title) {
    for (var i in this.list) {
        if ((artist == this.list[i].artist) && ((this.list[i].ban_artist) || (title == this.list[i].title))) {
            return true;
        }
    }
    return false;
};