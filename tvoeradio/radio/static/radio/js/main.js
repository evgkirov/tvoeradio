$(document).ready(function(){
    $("#mp3player").jPlayer({
        'swfPath': config.jplayer_swfpath.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '')
    });
});

network.vkontakte.init({apiId: config.vk_api_id});

