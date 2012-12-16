register_namespace('userdata.audio');


userdata.audio.list = [];


userdata.audio.load = function() {
    network.vkontakte.api('audio.get', {}, function(data) {
        userdata.audio.list = data.response;
    });
};


userdata.audio.add = function(artist, title, vk_aid, vk_oid) {
    network.vkontakte.api('audio.add', {'aid': vk_aid, 'oid': vk_oid}, function(data) {
        userdata.audio.list.push({
            'artist': artist,
            'title': title
        });
        ui.update_track_controls();
        ui.notification.show('info', gettext('Added on your VK page'));
    });
};


userdata.audio.is_added = function(artist, title) {
    for (var i in this.list) {
        if ((artist == this.list[i].artist) && (title == this.list[i].title)) {
            return true;
        }
    }
    return false;
};

