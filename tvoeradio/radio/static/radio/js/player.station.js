register_namespace('player.station');

player.station.type = null;
player.station.name = null;
player.station.current = null;

player.station.set = function(type, name) {
	this.type = type;
	this.name = name;
	this.current = player.station[type];
}