register_namespace('ui');


ui.go_to_page = function(name) {
    $('.page').hide();
    $('#page_'+name).show();
    $('.popup').hide();
};

ui.resz = function() {
    var ww = $(window).width();
    var wh = $(window).height()
    $('#slider_seek').width(ww-430);
    $('#search-widget__text').width(ww-155);
    if (config.mode == 'desktop') {
        $('#trackinfo_panel').height(wh-$('#controls').height());
    }
};


ui.fit = function() {
    if (config.mode == 'vk') {
        network.vkontakte.callMethod('resizeWindow', 627, $('body').height());
    }
}


ui.show_loader_fullscreen = function() {
    $('#loader_fullscreen').show();
};


ui.hide_loader_fullscreen = function() {
    $('#loader_fullscreen').hide();
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
    ui.infoblock.show($('#trackinfo_panel'), 'artist', current_track.artist);
};


ui.update_player_controls = function() {
    
};


ui.update_station_info = function() {
    $('#station_name').html(player.station.get_current_html());
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
}


$(document).ready(function(){
   $('.tabs li').click(function(){
       $('.tabs li.active').removeClass('active');
       $(this).addClass('active');
   });
   $('#album_cover').load(function(){$(this).fadeIn()});
   setInterval(ui.fit, 10);
});