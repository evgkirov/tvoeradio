register_namespace('userdata.recent_stations');


userdata.recent_stations.list = [];


userdata.recent_stations.add = function(type, name) {
    var data = {'name': name, 'type': type};
    $.post('/app/started/', data, function(data){
        userdata.recent_stations.list = data.recent_stations;
        ui.update_dashboard();
    });
}