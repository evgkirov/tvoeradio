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
        $('#dashboard, #search-result').height(wh - (29 + 51 + 20)); // topnav + search-widget + padding
        $('.popup__content').css('max-height', wh - 134); // some random value
    }
};


ui.fit = function() {
    var app_content = $('#app-content'),
        search_suggest = $('#search-suggest :visible'),
        popup = $('.popup:visible'),
        iframe = $('body>iframe');
    var h = app_content.height();
    if (search_suggest.length) {
        var ssh = search_suggest.height() + search_suggest.offset().top + 10;
        if (h < ssh) {
            h = ssh;
        }
    }
    if (popup.length) {
        var ph = popup.height() + popup.offset().top + 30;
        if (h < ph) {
            h = ph;
        }
    }
    // vk comment form attach popup
    if (iframe.length) {
        var ih = iframe.height();
        if (h < ih) {
            h = ih;
        }
    }
    if (ui.fit.previous_height != h) {
        network.vkontakte.callMethod('resizeWindow', 627, h);
        ui.fit.previous_height = h;
    }
};

ui.fit.previous_height = 0;

ui.show_loader_fullscreen = function() {
    $('#loader_fullscreen').show();
};


ui.hide_loader_fullscreen = function() {
    $('#loader_fullscreen').hide();
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
    $('#dashboard__cell_stations_favorited .dashboard__cell__content').html(ui.get_stations_list_html(userdata.favorited_stations.list, 10));
    $('#dashboard__cell_stations_recent .dashboard__cell__content').html(ui.get_stations_list_html(userdata.recent_stations.list, 10));
};


ui.update_track_info = function() {

    var current_track = player.playlist.get_current_track();

    $('#track_artist').hide().text(current_track.artist);
    setTimeout("$('#track_artist').fadeIn()", 100);
    $('#track_name').hide().text(current_track.title).fadeIn();
    $('#album_name').hide().text('');
    $('#album_cover').hide();

    network.lastfm.api(
        'track.getInfo',
        {
            'artist': current_track.artist,
            'track': current_track.title
        },
        function(data){
            if (data.track.album) {
                current_track.album_cover = data.track.album.image[data.track.album.image.length-1]["#text"];
                current_track.album_name = data.track.album.title;
                current_track.album_artist = data.track.album.artist;
                $('#album_name').text(current_track.album_name).fadeIn();
                $('#album_cover').attr('src', current_track.album_cover);
            }
        }
    );

    ui.infoblock.show($('#tabcontent_tabs_player__info'), 'artist', current_track.artist);

    if (current_track.vk_lyrics_id) {
        $('#tabcontent_tabs_player__lyrics').html('<div class="infoblock-loader"></div>');
        network.vkontakte.api('audio.getLyrics', {'lyrics_id': current_track.vk_lyrics_id}, function(data) {
            $('#tabcontent_tabs_player__lyrics').html(data.response.text.replace(/\n/g, '<br/>'));
        });
    } else {
        $('#tabcontent_tabs_player__lyrics').text('(У меня просто нет слов!)');
    }

    $('#tabcontent_tabs_player__comments').text('');
    network.vkontakte.Widgets.Comments('tabcontent_tabs_player__comments', {autoPublish: 0, limit: 10}, util.string.md5('artist ' + current_track.artist + 'title ' + current_track.title));

    /*$('#tabcontent_tabs_player__buy').text('');
    network.lastfm.api(
        'track.getBuylinks',
        {
            'artist': current_track.artist,
            'track': current_track.title,
            'country': 'russia'
        },
        function(data) {
            var downloads = [];
            var physicals = [];
            try {
                if (typeof data.affiliations.downloads != 'string')
                    downloads = network.lastfm.arrayize(data.affiliations.downloads.affiliation);
            } catch(err) {}
            try {
                physicals = network.lastfm.arrayize(data.affiliations.physicals.affiliation);
            } catch(err) {}
            var affiliations = [];
            $.merge(affiliations, downloads);
            $.merge(affiliations, physicals);
            var html = ich.tpl_tabcontent_tabs_player__buy({'affiliations': affiliations});
            $('#tabcontent_tabs_player__buy').html(html);
        }
    );*/

    var window_title = current_track.artist + ' — ' + current_track.title;
    document.title = window_title;
    if (config.mode == 'vk') {
        network.vkontakte.callMethod('setTitle', window_title);
    }
    if (window['bridge']) {
        bridge.track_change(current_track.artist, current_track.title);
    }

    ui.update_track_controls();
};


ui.update_track_controls = function() {
    var current_track = player.playlist.get_current_track();
    if (network.lastfm.authorized) {
        $('.menu_track__lastfm').show();
        if (current_track.lastfm_loved) {
            $('#menu_track__love').hide();
        }
    } else {
        $('.menu_track__lastfm').hide();
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
    if (player.control.is_loading) {
        $('#button_next').addClass('control_button_loader');
    } else {
        $('#button_next').removeClass('control_button_loader');
    }
};


ui.update_station_info = function() {
    $('#station_name').html(player.station.get_current_html());
    if (player.station.current.noshare) {
        $('#menu_station__poststatus').hide();
    } else {
        $('#menu_station__poststatus').show();
    }
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
    var context = {
        'lastfm_authorized': network.lastfm.authorized,
        'lastfm_user': network.lastfm.user,
        'config': config,
        'standalone': (config.mode == 'standalone'),
        'desktop': window['bridge'] ? true : false
    };
    $('#topnav').html(ich.tpl_topnav(context));
};


ui.show_popup_lastfm = function() {
    if (network.lastfm.authorized) {
        ui.infoblock.show_popup('user', network.lastfm.user);
    } else {
        ui.popup.show('Авторизация в Last.fm', ich.tpl_popup__lastfm_auth1());
    }
};


ui.update_playlist = function() {
    var pl = [];
    for (var i in player.playlist.list) {
        var track = player.playlist.list[i];
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
    $('.nav-station').live('click', function(e) {
        e.preventDefault();
        player.control.start($(this).data('type'), (($(this).data('name'))||$(this).text()));
    });
    ui.update_dashboard();
    if (config.mode == 'vk') {
        window.setInterval(ui.fit, 40);
    }
});