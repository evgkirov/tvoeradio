$(document).ready(function(){


    // Настройка каких-то общих вещей

    network.lastfm.api_key = config.lastfm_api_key;
    network.lastfm.api_secret = config.lastfm_api_secret;
    network.lastfm.api_url = config.lastfm_api_url;
    $.ajaxSetup({
        'cache': true,
        'beforeSend': function(xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                xhr.setRequestHeader("X-CSRFToken", $("[name='csrfmiddlewaretoken']").val());
            }
        }
    });
    
    
    $('#search-widget__text').focus();

    
    // Настройка UI    

    $(window).resize(ui.resz);
    ui.resz();

    
    // Поднимаем плеер

    $("#mp3player").jPlayer({
        'swfPath': config.jplayer_swfpath.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, ''),
        'play': function(e) {
            if (network.lastfm.authorized) {
                network.lastfm.api(
                    'track.updateNowPlaying',
                    {
                        'track': player.playlist.get_current_track().title,
                        'artist': player.playlist.get_current_track().artist,
                        'duration': e.jPlayer.status.duration
                    }
                );
            }
        },
        'ended': function(e) {
            if (network.lastfm.authorized) {
                network.lastfm.api(
                    'track.scrobble',
                    {
                        'track[0]': player.playlist.get_current_track().title,
                        'timestamp[0]': player.playlist.get_current_track().started,
                        'artist[0]': player.playlist.get_current_track().artist
                    }
                );
                player.control.next();
            }
        },
        'timeupdate': function(e) {
            $('#slider_seek div').width(Math.round(e.jPlayer.status.seekPercent)+'%');
            $('#slider_seek').css('background-position', Math.round(e.jPlayer.status.currentPercentAbsolute)+'% 0');
            $('#slider_seek span').text($.jPlayer.convertTime(e.jPlayer.status.currentTime)+' / '+$.jPlayer.convertTime(e.jPlayer.status.duration));
        }
    });
    
    
    // Логинимся в Last.fm, если были залогинены ранее
    
    network.lastfm.cookielogin();
    ui.update_topnav();
    ui.update_popup_lastfm();

    
    $('.popup__close').click(function(){
        $(this).parent('.popup').hide();
    });
    
    $('a.bbcode_artist').live('click', function() {
        var artist = $(this).attr('href');
        artist = artist.replace('http://www.last.fm/music/', '');
        artist = util.string.urldecode(artist);
        $('#popup_infoblock').show();
        ui.infoblock.show($('#popup_infoblock .popup__content'), 'artist', artist);
        return false;
    });
    $('#topnav__lastfm').live('click', function() {
        $('#popup_lastfm').show();
    });
    
    $('#popup_lastfm__auth1 .button').click(function() {
        var open_link = window.open('','_blank');
        network.lastfm.api('auth.getToken', {}, function(data){
            open_link.location='http://www.last.fm/api/auth/?api_key='+network.lastfm.api_key+'&token='+data.token;
            network.lastfm.auth_token = data.token;
            $('#popup_lastfm__auth1').hide();
            $('#popup_lastfm__auth2').show();
        }); 
    });
    
    $('#popup_lastfm__auth2 .button').click(function() {
        network.lastfm.api('auth.getSession', {'token': network.lastfm.auth_token}, function(data) {
            if (data.error) {
                $('#popup_lastfm__auth1 p').text('Вы не подтвердили доступ, придётся начать сначала.');
            } else {
                network.lastfm.login(data.session.name, data.session.key);
                ui.update_topnav();
            }
            ui.update_popup_lastfm();
        });
    });
    
    $('#popup_lastfm__authed .button').click(function() {
        network.lastfm.logout();
        $('#popup_lastfm').hide();
        ui.update_topnav();
        ui.update_popup_lastfm();
    });
    
    
    // События в плеере
    
    $('#station_change').click(player.control.stop);
    
    $('#button_next').click(player.control.next);
    
    $('#button_previous').click(player.control.previous);
    
    $('#button_play, #button_pause').click(player.control.pause);
    
    
    $('#menu_track__love').click(function(){
        $('#menu_track__love').hide(); //TODO: найти более подходящее место для этого 
        network.lastfm.api(
            'track.love',
            {
                'track': player.playlist.get_current_track().title,
                'artist': player.playlist.get_current_track().artist
            }
        );
    });
    
    $('#menu_track__poststatus').click(function(){
        var current_track = player.playlist.get_current_track();
        network.vkontakte.api(
            'wall.post',
            {
                'message': 'Слушаю '+current_track.artist+' "'+current_track.title+'"',
                'attachment': 'audio'+current_track.vk_oid+'_'+current_track.vk_aid
            },
            function(data) {}
        );
    });
    
    $('#menu_station__poststatus').click(function(){
        network.vkontakte.api(
            'wall.post',
            {
                'message': 'Советую послушать: http://vkontakte.ru/app'+config.vk_api_id+'#'+player.station.type+'/'+util.string.urlencode(player.station.name)
            },
            function(data) {}
        );
    });

});

if (config.mode == 'vk') {
    
    network.vkontakte.init(function() {
         // API initialization succeeded
         // Your code here
      });

    network.vkontakte.addCallback('onLocationChanged', function(str){
        if (str) {
            var parts = util.string.urldecode(str).split('/', 2);
            player.control.start(parts[0], parts[1]);
        } else {
            player.control.stop();
        }
    });

} else {
    network.vkontakte.init({apiId: config.vk_api_id});
}

