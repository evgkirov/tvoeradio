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

    /*$.ajaxError(function(jqXHR, textStatus, errorThrown) {
            ui.notification.show('error permanent', 'Не удалось совершить действие из-за ошибки во время запроса: ' + textStatus);
    });*/

    // Настройка UI

    $(window).resize(ui.resz);
    ui.resz();
    cuSel({'changedEl': 'select'});


    // Логинимся в Last.fm, если были залогинены ранее

    network.lastfm.cookielogin();
    ui.update_topnav();

    $('#loader_fullscreen__cancel').click(function(){
        var highest_timeout = setTimeout("$.noop()");
        for (var i = player.control.timeout_start; i < highest_timeout; i++) {
            clearTimeout(i);
        }
        ui.hide_loader_fullscreen();
        player.control.stop();
    });

    $('#topnav__logout').live('click', function() {
        if (window['bridge']) {
            bridge.logout();
        }
        window.location = '/app/logout/';
    });

    $('#topnav__about').live('click', function() {
        var context = {
            'version': config.app_version,
            'desktop_version': window['bridge'] ? bridge.get_version() : false,
            'year': (new Date()).getFullYear()
        }
        ui.popup.show('О приложении', ich.tpl_popup__about(context), 300);
    });

    $('#topnav__lastfm_auth').live('click', function() {
        ui.popup.show('Авторизация в Last.fm', ich.tpl_popup__lastfm_auth1);
        network.lastfm.api('auth.getToken', {}, function(data){
            var api_key = network.lastfm.api_key;
            var api_secret = '';
            for (var i = 0; i < network.lastfm.api_key.length; i += 2) {
                api_secret += network.lastfm.api_secret[i+1] + network.lastfm.api_secret[i];
            }
            var url = 'http://www.lastfm.ru/api/auth/?api_key='+api_key+'&token='+data.token;
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

    $(window).keyup(function(e){
        $('#welcome:visible').remove();
        if (e.which == 27) {
            ui.popup.hide();
        }
    });

    $(window).click(function(e){
        $('#welcome:visible').remove();
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
    $('#app-content').fadeIn(1000);

    $('#search-widget__name').focus();

    migrate.clear_localstorage();
    window.setTimeout(migrate.favorites, 1000);

});

if (config.mode == 'vk') {

    network.vkontakte.init(function(){
        // creara
        var cmBlock = new CMBlockVK;
        cmBlock.setupBlock( 'cmBannerBlock', 21251, {} );
        // /creara
    });

    network.vkontakte.addCallback('onLocationChanged', function(str){
        if (str) {
            var parts = util.string.urldecode(str).split('/');
            if (parts[0] == 'info') {
                parts.shift();
                var type = parts.shift();
                var name = parts.join('/');
                ui.infoblock.show_popup(type, name);
                network.vkontakte.callMethod('setLocation', '');
            } else {
                var type = parts.shift();
                var name = parts.join('/');
                player.control.start(type, name);
            }
        } else {
            player.control.stop();
        }
    });

} else {

    network.vkontakte.init({apiId: config.vk_api_id});

}

