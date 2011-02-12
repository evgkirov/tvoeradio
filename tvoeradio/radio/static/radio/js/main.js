$(document).ready(function(){
    $(window).resize(ui.resz);
    ui.resz();
    ui.update_topnav();
    $("#mp3player").jPlayer({
        'swfPath': config.jplayer_swfpath.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, ''),
        'ended': player.control.next
    });
    $('#station_change').click(player.control.stop);
    $('.popup__close').click(function(){
        $(this).parent('.popup').hide();
    });
    $('a.bbcode_artist').live('click', function() {
        var artist = $(this).attr('href');
        artist = artist.replace('http://www.last.fm/music/', '');
        artist = artist.replace('+', ' ');
        $('#popup_infoblock').show();
        ui.infoblock.show($('#popup_infoblock .popup__content'), 'artist', artist);
        return false;
    });
});


network.vkontakte.init({apiId: config.vk_api_id});

