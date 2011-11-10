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

    // Настройка UI

    $(window).resize(ui.resz);
    ui.resz();


    // Логинимся в Last.fm, если были залогинены ранее

    network.lastfm.cookielogin();
    ui.update_topnav();

    $('#topnav__lastfm_auth').live('click', function() {
        ui.popup.show('Авторизация в Last.fm', ich.tpl_popup__lastfm_auth1);
    });

    $('#topnav__lastfm').live('click', function() {
        ui.popup.show('Last.fm', ich.tpl_popup__lastfm);
    });

    $('#popup_lastfm__auth1 button').live('click', function() {
        var open_link = window.open('','_blank');
        network.lastfm.api('auth.getToken', {}, function(data){
            open_link.location='http://www.last.fm/api/auth/?api_key='+network.lastfm.api_key+'&token='+data.token;
            network.lastfm.auth_token = data.token;
            ui.popup.set_content(ich.tpl_popup__lastfm_auth2());
        });
    });

    $('#popup_lastfm__auth2 button').live('click', function() {
        network.lastfm.api('auth.getSession', {'token': network.lastfm.auth_token}, function(data) {
            if (data.error) {
                ui.popup.set_content(ich.tpl_popup__lastfm_auth1({'error': 'Вы не подтвердили доступ, придётся начать сначала.'}));
            } else {
                network.lastfm.login(data.session.name, data.session.key);
                ui.update_topnav();
                ui.show_popup_lastfm();
            }
        });
    });

    $('#popup_lastfm__authed button').live('click', function() {
        network.lastfm.logout();
        ui.update_topnav();
        ui.show_popup_lastfm();
    });

    $('#dashboard__cell_stations_favorited .dashboard__cell__title .pseudolink').click(function(){
        ui.popup.show('Избранное', ui.get_stations_list_html(userdata.favorited_stations.list));
    });


    $('#dashboard .nav-infoblock img').load(function(){
        $(this).fadeTo('slow', 1);
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

