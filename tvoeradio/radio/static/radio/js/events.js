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
        network.lastfm.api('auth.getToken', {}, function(data){
            var api_key = '';
            var api_secret = '';
            for (var i = 0; i < network.lastfm.api_key.length; i += 2) {
                api_key += network.lastfm.api_key[i+1] + network.lastfm.api_key[i];
                api_secret += network.lastfm.api_secret[i+1] + network.lastfm.api_secret[i];
            }
            var url = 'http://www.last.fm/api/auth/?api_key='+api_key+'&token='+data.token;
            $('#popup_lastfm__auth1 a').attr('href', url);
            $('#popup_lastfm__auth1 div:first').hide();
            $('#popup_lastfm__auth1 div.button_blue').show();
            network.lastfm.auth_token = data.token;
        });
    });

    $('#popup_lastfm__auth1 button').live('click', function() {

        ui.popup.set_content(ich.tpl_popup__lastfm_auth2());

    });

    $('#popup_lastfm__auth2 button').live('click', function() {
        network.lastfm.api('auth.getSession', {'token': network.lastfm.auth_token}, function(data) {
            if (data.error) {
                ui.popup.set_content(ich.tpl_popup__lastfm_auth1({'error': 'Вы не подтвердили доступ, придётся начать сначала.'}));
            $('#popup_lastfm__auth1 div:first').show();
            $('#popup_lastfm__auth1 div.button_blue').hide();
            } else {
                network.lastfm.login(data.session.name, data.session.key);
                ui.update_topnav();
                ui.show_popup_lastfm();
            }
        });
    });

    $('.infoblock_user button').live('click', function() {
        network.lastfm.logout();
        ui.update_topnav();
        ui.popup.hide();
    });

    $('#dashboard__cell_stations_favorited .dashboard__cell__title .pseudolink').click(function(){
        ui.popup.show('Избранное', ui.get_stations_list_html(userdata.favorited_stations.list));
    });

    $('#app-preloader').hide();
    $('#app-content').fadeIn();

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

