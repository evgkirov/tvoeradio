$(document).ready(function(){
    $("#mp3player").jPlayer({
        'swfPath': config.jplayer_swfpath.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, ''),
        'ended': player.control.next
    });
    $('#station_change').click(player.control.stop);
});

network.vkontakte.init({apiId: config.vk_api_id});

