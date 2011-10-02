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
            }
            player.control.next();
        },
        'timeupdate': function(e) {
            $('#slider_seek div').width(Math.round(e.jPlayer.status.seekPercent)+'%');
            $('#slider_seek').css('background-position', Math.ceil(100*e.jPlayer.status.currentTime/player.playlist.get_current_track().duration)+'% 0');
            $('#slider_seek span').text($.jPlayer.convertTime(e.jPlayer.status.currentTime)+' / '+$.jPlayer.convertTime(player.playlist.get_current_track().duration));
        },
        'play': function(e) {
            ui.update_player_controls();
        },
        'pause': function(e) {
            ui.update_player_controls();
        },
        'volumechange': function(e) {
            $('#slider_volume').css('background-position', e.jPlayer.status.volume*100+'% 0');
        }
    });

    var volume = util.cookie.get('tvoeradio_player_volume');
    if (volume == null) {
        volume = 0.8;
    } else {
        volume = parseInt(volume) / 100;
    }

    $('#mp3player').jPlayer('volume', volume);


    // Логинимся в Last.fm, если были залогинены ранее

    network.lastfm.cookielogin();
    ui.update_topnav();
    ui.update_popup_lastfm();


    $('.popup__close').click(function(){
        $(this).parent('.popup').hide();
    });

    $('a.bbcode_artist').live('click', function(e) {
        e.preventDefault();
        var artist = $(this).attr('href');
        artist = artist.replace('http://www.last.fm/music/', '');
        artist = util.string.urldecode(artist);
        ui.infoblock.show_popup('artist', artist)
    });

    $('#topnav__lastfm').live('click', function() {
        $('#popup_lastfm').show();
    });

    $('#popup_lastfm__auth1 button').click(function() {
        var open_link = window.open('','_blank');
        network.lastfm.api('auth.getToken', {}, function(data){
            open_link.location='http://www.last.fm/api/auth/?api_key='+network.lastfm.api_key+'&token='+data.token;
            network.lastfm.auth_token = data.token;
            $('#popup_lastfm__auth1').hide();
            $('#popup_lastfm__auth2').show();
        });
    });

    $('#popup_lastfm__auth2 button').click(function() {
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

    $('#popup_lastfm__authed button').click(function() {
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

    $('#slider_seek').click(function(e) {
        var percent = e.offsetX / $(this).width();
        var max_percent = $('#mp3player').data('jPlayer').status.seekPercent / 100;
        percent = Math.min(percent, max_percent);
        var time = Math.round(percent * player.playlist.get_current_track().duration)-1;
        if (time - 2 >= 0) {
            time = time - 2;
        }
        player.audio.seek(time);
    });

    function change_volume(e) {
        var slider_width = 10;
        var x = e.pageX-$('#slider_volume').position().left-Math.round(slider_width/2);
        var k = ($('#slider_volume').width()-slider_width)/100;
        var vol = Math.round(x/k);
        if (vol>100) vol=100;
        if (vol<0) vol=0;
        $('#mp3player').jPlayer('volume', vol/100);
        util.cookie.set('tvoeradio_player_volume', vol, 60*60*24*1000);
    }

    $('#slider_volume').mousedown(function(e) {
        e.preventDefault();
        change_volume(e);
        $(window).mousemove(change_volume);
    });

    $('#slider_volume').click(change_volume);

    $(window).mouseup(function(){
        $(this).unbind('mousemove', change_volume);
    });

    $('#menu_track__love').click(function(){
        $('#menu_track__love').hide();
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

