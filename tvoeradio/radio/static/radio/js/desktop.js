if (window['bridge']) {

    bridge.previous.connect(player.control.previous);
    bridge.pause.connect(player.control.pause);
    bridge.next.connect(player.control.next);

    // TODO fix this
    $(document).ready(function(){
        $('#menu_track__poststatus').remove();
        $('#menu_track__postwall').remove();
        $('#menu_station__poststatus').remove();
        $('#menu_station__postwall').remove();
    });

}