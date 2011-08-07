register_namespace('userdata.recent_stations');


userdata.recent_stations.list = null;


userdata.recent_stations.add = function(type, name) {
    var data = {'name': name, 'type': type};
    this.list.unshift(data);
    ui.update_dashboard();
    //$.post('/app/recent_station_add/', data);
}