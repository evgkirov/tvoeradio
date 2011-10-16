register_namespace('ui');


ui.go_to_page = function(name) {
    $('.page').hide();
    $('#page_'+name).show();
    $('.popup').hide();
};


ui.resz = function() {
    var ww = $(window).width();
    var wh = $(window).height()
    $('#slider_seek').width(ww-400);
    $('#search-widget__text').width(ww-155);
    $('#trackinfo div').width(ww-140);
    if (config.mode == 'desktop') {
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


ui.update_dashboard = function() {
    var html = [];
    var max = Math.min(15, userdata.recent_stations.list.length);
    for (var i = 0; i < max; i++) {
        var station = userdata.recent_stations.list[i];
        html.push('<li><span class="pseudolink nav-station" data-type="' + station.type + '" data-name="' + station.name + '">' + player.station[station.type].get_html(station.name) + '</span></li>');
    }
    $('#dashboard__recent_stations').html(html.join(''));
    var html = [];
    var max = Math.min(15, userdata.favorited_stations.list.length);
    for (var i = 0; i < max; i++) {
        var station = userdata.favorited_stations.list[i];
        html.push('<li><span class="pseudolink nav-station" data-type="' + station.type + '" data-name="' + station.name + '">' + player.station[station.type].get_html(station.name) + '</span></li>');
    }
    $('#dashboard__favorited_stations').html(html.join(''));
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
    if (network.lastfm.authorized) {
        $('#menu_track__love').show();
    } else {
        $('#menu_track__love').hide();
    }
};


ui.update_player_controls = function() {
    if (player.control.is_playing()) {
        $('#button_pause').show();
        $('#button_play').hide();
    } else {
        $('#button_pause').hide();
        $('#button_play').show();
    }
};


ui.update_station_info = function() {
    $('#station_name').html(player.station.get_current_html());
    if (userdata.favorited_stations.is_favorited(player.station.type, player.station.name)) {
        $('#menu_station__favorite').hide();
        $('#menu_station__remove_favorite').show();
    } else {
        $('#menu_station__favorite').show();
        $('#menu_station__remove_favorite').hide();
    }

};


ui.update_topnav = function() {
    var links_left = [];
    if (network.lastfm.authorized) {
        links_left.push('<span class="pseudolink" id="topnav__lastfm">Last.fm (' + util.string.htmlspecialchars(network.lastfm.user) + ')</span>')
    } else {
        links_left.push('<span class="pseudolink" id="topnav__lastfm">Last.fm</span>')
    }
    links_left.push('<span>'+$('title').html()+'</span>');
    $('#topnav').html(links_left.join(' | '));
};


ui.update_popup_lastfm = function() {
    if (network.lastfm.authorized) {
        $('#popup_lastfm__auth1, #popup_lastfm__auth2').hide();
        $('#popup_lastfm__authed').show();
    } else {
        $('#popup_lastfm__authed, #popup_lastfm__auth2').hide();
        $('#popup_lastfm__auth1').show();
    }
};


ui.update_playlist = function() {
    var pl = [];
    for (var i in player.playlist.playlist) {
        var track = player.playlist.playlist[i];
        if (i == player.playlist.current_track_num) {
            pl.push(util.string.safe_format('<div class="boxed boxed_selected" rel="%s">%s &mdash; %s</div>', i, track.artist, track.title));
        } else {
            pl.push(util.string.safe_format('<div class="boxed" rel="%s">%s &mdash; %s</div>', i, track.artist, track.title));
        }
    }
    $('#tabcontent_tabs_player__playlist').html(pl.join(''));
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
       player.control.navigate($(this).attr('rel'));
   });
   $('.nav-station').live('click', function(e) {
        e.preventDefault();
        player.control.start($(this).data('type'), (($(this).data('name'))||$(this).text()));

    });
   ui.update_dashboard();
   setInterval(ui.fit, 10);
});