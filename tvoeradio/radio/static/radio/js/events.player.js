$(document).ready(function() {

    // Начальная громкость

    var default_volume = util.cookie.get('tvoeradio_player_volume');
    if (default_volume == null) {
        default_volume = 0.8;
    } else {
        default_volume = parseInt(default_volume) / 100;
    }
    //$('.slider_volume').css('background-position', default_volume*100+'% 0');


    // Поднимаем плеер

    $("#mp3player").jPlayer({

        'swfPath': config.jplayer_swfpath.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, ''),

        'solution': 'flash,html',

        'volume': default_volume,

        'errorAlerts': false,

        'error': function(e) {
            if (e.jPlayer.error.type == $.jPlayer.error.NO_SOLUTION) {
                var link = 'http://www.adobe.com/go/getflashplayer';
                if ((window['bridge'])&&(navigator.userAgent.indexOf('Windows')!==-1)) {
                    link = 'http://get.adobe.com/ru/flashplayer/completion/?installer=Flash_Player_11_for_Other_Browsers_(32_bit)';
                }
                ui.notification.show('error permanent unclosable', 'Воспроизведение музыки невозможно.<br/><br/>Установите <a href="' + link + '">Adobe Flash Player</a>.', true);
            }
        },

        'play': function(e) {
            if (network.lastfm.authorized) {
                network.lastfm.api(
                    'track.updateNowPlaying',
                    {
                        'track': player.playlist.get_current_track().title,
                        'artist': player.playlist.get_current_track().artist,
                        'duration': player.playlist.get_current_track().duration
                    }
                );
            }
            ui.update_track_controls();
            $('.slider_pos').slider('option', 'max', player.playlist.get_current_track().duration);
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

        'progress': function(e) {
            $c('.slider_load').width(e.jPlayer.status.seekPercent+'%');
        },

        'seeking': function(e) {
            $('.slider_pos .ui-slider-handle').css('opacity', .4);
        },

        'seeked': function(e) {
            $('.slider_pos .ui-slider-handle').css('opacity', 1);
        },

        'timeupdate': function(e) {
            $c('.slider_pos').slider('value', e.jPlayer.status.currentTime);
            $c('.slider_seek span').text($.jPlayer.convertTime(e.jPlayer.status.currentTime)+' / '+$.jPlayer.convertTime(player.playlist.get_current_track().duration));
        }

    });


    // Кнопки плеера

    $('#back-to-player').click(function(){ui.go_to_page('player');});
    $('#station_change').click(function(){ui.go_to_page('tune');});
    $('.button_stop').click(player.control.stop);
    $('.button_next').click(player.control.next);
    $('.button_previous').click(player.control.previous);
    $('.button_play, .button_pause').click(player.control.pause);

    $('.slider_pos').slider({
        'step': 0.05,
        'slide': function(event, jui) {
            if (event.originalEvent) {
                player.audio.seek(jui.value);
            }
        }
    });

    $('.slider_volume').slider({
        'value': default_volume*100,
        'slide': function(event, jui) {
            $('#mp3player').jPlayer('volume', jui.value / 100);
            ui.notification.show('info', 'Громкость: ' + jui.value +'%');
            util.cookie.set('tvoeradio_player_volume', jui.value, 60*60*24*1000);
        }
    });

    $('#tabcontent_tabs_player__playlist .boxed').live('click', function(e){
        player.control.navigate($(this).data('number'));
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
        cuSel({'changedEl': 'select'});
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
                'message': current_track.artist + ' — ' + current_track.title + ' #np #nowplaying #tvoeradio', // artist и title не убирать, так как показываются в твиттере
                'attachment': 'audio' + current_track.vk_oid + '_' + current_track.vk_aid
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
                'services': '',
                'message': 'Рекомендую послушать станцию «' + desc + '» в приложении «Твоёрадио» ' + config.vk_api_url + '#' + hash + ' #np #nowplaying #tvoeradio'
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
                    'message': 'Рекомендую послушать станцию «' + desc + '» в приложении «Твоёрадио»:',
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

    $('#menu_station__includeremixes').click(function(){
        player.station.include_remixes = true;
        ui.update_station_controls();
    });

    $('#menu_station__excluderemixes').click(function(){
        player.station.include_remixes = false;
        ui.update_station_controls();
    });

    $('#menu_station__onlysimilar').click(function(){
        player.station.only_similar = true;
        ui.update_station_controls();
    });

    $('#menu_station__notonlysimilar').click(function(){
        player.station.only_similar = false;
        ui.update_station_controls();
    });

});