$(document).ready(function() {

    // Начальная громкость

    var default_volume = util.cookie.get('tvoeradio_player_volume');
    if (default_volume == null) {
        default_volume = 0.8;
    } else {
        default_volume = parseInt(default_volume) / 100;
    }
    $('#slider_volume').css('background-position', default_volume*100+'% 0');


    // Поднимаем плеер

    $("#mp3player").jPlayer({

        'swfPath': config.jplayer_swfpath.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, ''),

        'solution': 'flash, html',

        'volume': default_volume,

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
            ui.update_track_controls();
        },

        'pause': function(e) {
            ui.update_track_controls();
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

        'volumechange': function(e) {
            $('#slider_volume').css('background-position', e.jPlayer.status.volume*100+'% 0');
        }

    });


    // Кнопки плеера

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
        var k = ($('#slider_volume').width() - slider_width) / 100;
        var vol = Math.round(x/k);
        if (vol > 100) vol = 100;
        if (vol < 0) vol = 0;
        $('#mp3player').jPlayer('volume', vol / 100);
        ui.notification.show('info', 'Громкость: ' + vol +'%');
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


    // Меню трека

    $('#menu_track__love').click(function(){
        $('#menu_track__love').hide();
        player.playlist.get_current_track().lastfm_loved = true;
        network.lastfm.api(
            'track.love',
            {
                'track': player.playlist.get_current_track().title,
                'artist': player.playlist.get_current_track().artist
            },
            function(data) {
                ui.notification.show('info', 'Трек добавлен в любимые на Last.fm');
            }
        );
    });

    $('#menu_track__tag').click(function(){
        var current_track = player.playlist.get_current_track();
        ui.popup.show('Добавить теги', ich.tpl_popup__tag_add(current_track), 300);
    });

    $('#form_tag_add .form__submit').live('click', function(){
        var form = $(this).parents('.form');
        var what = form.find('select').val();
        var params = {
            'artist': form.data('artist'),
            'title': form.data('title'),
            'album': form.data('album'),
            'tags': form.find('input').val()
        };
        ui.popup.hide();
        network.lastfm.api(what + '.addTags', params, function(data) {
            ui.notification.show('info', 'К '+ ({'track':'треку','album':'альбому','artist':'исполнителю'})[what]+' добавлены теги');
        });
    });

    $('#menu_track__poststatus').click(function(){
        var current_track = player.playlist.get_current_track();
        network.vkontakte.api(
            'wall.post',
            {
                'services': 'twitter,facebook',
                'message': '#np #tvoeradio',
                'attachment': 'audio'+current_track.vk_oid+'_'+current_track.vk_aid
            },
            function(data) {
                ui.notification.show('info', 'Сообщение отправлено');
            }
        );
    });

    $('#menu_track__postwall').click(function(){
        var current_track = player.playlist.get_current_track();
        network.vkontakte.choose_friend(function(uid){
            network.vkontakte.api(
                'wall.post',
                {
                    'owner_id': uid,
                    'attachment': 'audio'+current_track.vk_oid+'_'+current_track.vk_aid
                },
                function(data) {
                    ui.notification.show('info', 'Сообщение отправлено');
                }
            );
        });
    });

    $('#menu_track__addaudio').click(function() {
        var current_track = player.playlist.get_current_track();
        userdata.audio.add(current_track.artist, current_track.title, current_track.vk_aid, current_track.vk_oid);
    });

    $('#menu_track__ban').click(function() {
        var current_track = player.playlist.get_current_track();
        ui.popup.show('Забанить', ich.tpl_popup__ban_add(current_track));
    });

    $('#form_ban_add__ban_track').live('click', function() {
        userdata.bans.add($(this).parents('.form').data('artist'), $(this).parents('.form').data('title'), false);
        ui.popup.hide();
    });

    $('#form_ban_add__ban_artist').live('click', function() {
        userdata.bans.add($(this).parents('.form').data('artist'), $(this).parents('.form').data('title'), true);
        ui.popup.hide();
    });


    // Меню станции

    $('#menu_station__poststatus').click(function() {
        var hash = player.station.get_current_hash();
        var desc = player.station.get_current_desc();
        network.vkontakte.api(
            'wall.post',
            {
                'services': 'twitter,facebook',
                'message': 'Советую послушать станцию «' + desc + '» в приложении «Твоёрадио» #tvoeradio',
                'attachment': config.vk_api_url + '#' + hash
            },
            function(data) {
                ui.notification.show('info', 'Сообщение отправлено');
            }
        );
    });

    $('#menu_station__postwall').click(function() {
        var hash = player.station.get_current_hash();
        var desc = player.station.get_current_desc();
        network.vkontakte.choose_friend(function(uid){
            network.vkontakte.api(
                'wall.post',
                {
                    'owner_id': uid,
                    'message': 'Советую послушать станцию «' + desc + '» в приложении «Твоёрадио»:',
                    'attachment': config.vk_api_url + '#' + hash
                },
                function(data) {
                    ui.notification.show('info', 'Сообщение отправлено');
                }
            );
        });
    });

    $('#menu_station__addfavorite').click(function(){
        userdata.favorited_stations.add(player.station.type, player.station.name);
    });

    $('#menu_station__removefavorite').click(function(){
        userdata.favorited_stations.remove(player.station.type, player.station.name);
    });


});