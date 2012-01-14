register_namespace('player.station');


player.station.type = null;
player.station.name = null;
player.station.current = null;
player.station.include_remixes = false;
player.station.only_similar = false;  // Играть «только похожие» а не «похожие + исполнитель»


player.station.set = function(type, name) {
    this.type = type;
    this.name = name;
    this.current = player.station[type];
};


player.station.get_current_html = function() {
    return this.current.get_html(this.name);
};


player.station.get_current_desc = function() {
    return util.string.strip_tags(player.station.get_current_html());
};

player.station.get_current_hash = function() {
    return this.type + '/' + util.string.urlencode(this.name);
};