register_namespace('userdata.favorited_stations');


userdata.favorited_stations.list = [];


userdata.favorited_stations.add = function(type, name) {
	var data = {'name': name, 'type': type};
    $.post('/app/_/favorite/add/', data, function(data){
        userdata.favorited_stations.list = data.favorited_stations;
        ui.update_dashboard();
        ui.update_station_controls();
    });
};


userdata.favorited_stations.remove = function(type, name) {
	var data = {'name': name, 'type': type};
    $.post('/app/_/favorite/remove/', data, function(data){
        userdata.favorited_stations.list = data.favorited_stations;
        ui.update_dashboard();
        ui.update_station_controls();
    });
};


userdata.favorited_stations.is_favorited = function(type, name) {
	for (var i in this.list) {
		if ((type == this.list[i].type) && (name == this.list[i].name)) {
			return true;
		}
	}
	return false;
};