register_namespace('userdata.recent_stations');


userdata.recent_stations.list = [];


userdata.recent_stations.add = function(type, name, campaign) {
    var data = {'name': name, 'type': type};
    if (campaign) {
        data.campaign = campaign;
    }
    $.post('/app/_/started/', data, function(data){
        userdata.recent_stations.list = data.recent_stations;
        ui.update_dashboard();
    });
}