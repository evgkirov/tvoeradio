register_namespace('ui');


ui.go_to_page = function(name) {
    $('.page').hide();
    $('#page_'+name).show();
    ui.popup.hide();
};


ui.resz = function() {
    var ww = $(window).width();
    var wh = $(window).height()
    $('#slider_seek').width(ww-400);
    $('#search-widget__text').width(ww-155);
    $('#trackinfo div').width(ww-140);
    if (config.mode != 'vk') {
        $('#trackinfo_panel').height(wh-$('#controls').height()-20);
    }
};


ui.fit = function() {
    if (config.mode == 'vk') {
        var h = $('body').height();
        if ($('#search-suggest').is(':visible')) {
            var ssh = $('#search-suggest').height() + $('#search-suggest').offset().top + 10;
            if (h < ssh) {
                h = ssh;
            }
        }
        if ($('.popup:visible').length) {
            var ph = $('.popup:visible').height() + $('.popup:visible').offset().top + 30;
            if (h < ph) {
                h = ph;
            }
        }
        network.vkontakte.callMethod('resizeWindow', 727, h);
    }
}


ui.show_loader_fullscreen = function() {
    $('#loader_fullscreen').fadeIn();
};


ui.hide_loader_fullscreen = function() {
    $('#loader_fullscreen').fadeOut();
};


ui.get_stations_list_html = function(list, max) {
    if (!max) {
        max = Infinity;
    }
    max = Math.min(max, list.length);
    var context = {'stations': []};
    for (var i = 0; i < max; i++) {
        context.stations.push({
            'type': list[i].type,
            'name': list[i].name,
            'html': player.station[list[i].type].get_html(list[i].name)
        });
    }
    return ich.tpl_stationslist(context);
};


ui.update_dashboard = function() {
    $('#dashboard__cell_stations_favorited .dashboard__cell__content').html(ui.get_stations_list_html(userdata.favorited_stations.list, 5));
    $('#dashboard__cell_stations_recent .dashboard__cell__content').html(ui.get_stations_list_html(userdata.recent_stations.list, 5));
};


ui.update_track_info = function() {
    var current_track = player.playlist.get_current_track();
    $('#track_artist').hide().text(current_track.artist);
    setTimeout("$('#track_artist').fadeIn()", 100);
    $('#track_name').hide().text(current_track.title).fadeIn();
    $('#album_name').hide().text('');
    $('#album_cover').hide();
    network.lastfm.api('track.getInfo', {'artist': current_track.artist, 'track': current_track.title}, function(data){
        if (data.track.album) {
            current_track.album_cover = data.track.album.image[data.track.album.image.length-1]["#text"];
            current_track.album_name = data.track.album.title;
            current_track.album_artist = data.track.album.artist;
            $('#album_name').text(current_track.album_name).fadeIn();
            $('#album_cover').attr('src', current_track.album_cover);
        }
    });
    ui.infoblock.show($('#tabcontent_tabs_player__info'), 'artist', current_track.artist);
    if (current_track.vk_lyrics_id) {
        $('#tabcontent_tabs_player__lyrics').html('<div class="infoblock-loader"></div>');
        network.vkontakte.api('audio.getLyrics', {'lyrics_id': current_track.vk_lyrics_id}, function(data) {
            $('#tabcontent_tabs_player__lyrics').html(data.response.text.replace(/\n/g, '<br/>'));
        });
    } else {
        $('#tabcontent_tabs_player__lyrics').text('(У меня просто нет слов!)');
    }
    ui.update_track_controls();
};


ui.update_track_controls = function() {
    var current_track = player.playlist.get_current_track();
    if (network.lastfm.authorized) {
        $('#menu_track__love').show();
    } else {
        $('#menu_track__love').hide();
    }
    if (player.control.is_playing()) {
        $('#button_pause').show();
        $('#button_play').hide();
    } else {
        $('#button_pause').hide();
        $('#button_play').show();
    }
    if (userdata.audio.is_added(current_track.artist, current_track.title)) {
        $('#menu_track__addaudio').hide();
    } else {
        $('#menu_track__addaudio').show();
    }
};


ui.update_station_info = function() {
    $('#station_name').html(player.station.get_current_html());
    ui.update_station_controls();
};


ui.update_station_controls = function() {
    if (userdata.favorited_stations.is_favorited(player.station.type, player.station.name)) {
        $('#menu_station__addfavorite').hide();
        $('#menu_station__removefavorite').show();
    } else {
        $('#menu_station__addfavorite').show();
        $('#menu_station__removefavorite').hide();
    }
}


ui.update_topnav = function() {
    var links_left = [];
    if (network.lastfm.authorized) {
        links_left.push('<span class="pseudolink" id="topnav__lastfm">Last.fm (' + util.string.htmlspecialchars(network.lastfm.user) + ')</span>')
    } else {
        links_left.push('<span class="pseudolink" id="topnav__lastfm_auth">Last.fm</span>')
    }
    links_left.push('<span>'+$('title').html()+'</span>');
    $('#topnav').html(links_left.join(' | '));
};


ui.show_popup_lastfm = function() {
    if (network.lastfm.authorized) {
        ui.popup.show('Last.fm', ich.tpl_popup__lastfm());
    } else {
        ui.popup.show('Авторизация в Last.fm', ich.tpl_popup__lastfm_auth1());
    }
};


ui.update_playlist = function() {
    var pl = [];
    for (var i in player.playlist.playlist) {
        var track = player.playlist.playlist[i];
        pl.push({
            'number': i,
            'is_current': (i == player.playlist.current_track_num),
            'artist': track.artist,
            'title': track.title
        });
    }
    $('#tabcontent_tabs_player__playlist').html(ich.tpl_playlist({'playlist': pl}));
};


$(document).ready(function(){
   $('.tabs li').click(function(){
       $('.tabs li.active').removeClass('active');
       $(this).addClass('active');
       $('.tabcontent').hide();
       $('#tabcontent_'+$(this).attr('id')).show();
   });
   $('#album_cover').load(function(){$(this).fadeIn()});
   $('#tabcontent_tabs_player__playlist .boxed').live('click', function(e){
       player.control.navigate($(this).data('number'));
   });
   $('.nav-station').live('click', function(e) {
        e.preventDefault();
        player.control.start($(this).data('type'), (($(this).data('name'))||$(this).text()));
    });
   ui.update_dashboard();
   setInterval(ui.fit, 10);
});