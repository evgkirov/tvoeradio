register_namespace('network.lastfm');


network.lastfm.api_url = null;
network.lastfm.api_key = null;
network.lastfm.api_secret = null;
network.lastfm.user = null;
network.lastfm.authorized = false;
network.lastfm.auth_token = null;
network.lastfm.session_key = null;
network.lastfm.nocache_methods = ['auth.getToken'];
network.lastfm.shortcache_methods = ['user.getLovedTracks'];
network.lastfm.write_methods = ['album.addTags', 'artist.addTags', 'track.addTags', 'track.love', 'track.updateNowPlaying', 'track.scrobble'];


network.lastfm.api = function(method, params, callback) {

    var api_key = network.lastfm.api_key;
    var api_secret = '';
    for (var i = 0; i < network.lastfm.api_key.length; i += 2) {
        api_secret += network.lastfm.api_secret[i+1] + network.lastfm.api_secret[i];
    }

    var _this = this;
    var callback = callback || $.noop;

    var cache_key = 'lastfm-' + method;
    for (var k in params) {
        cache_key += '&' + k + '=' + params[k];
    }

    var passed_params = params;

    params.method = method;
    params.api_key = api_key;
    params.rnd = util.random.randint(0, 100500); // чтобы не скешировалось лишнее
    if (this.session_key) {
        params['sk'] = this.session_key;
    }
    params = util.array.sort_by_key(params);
    api_sig = '';
    for (var i in params) {
        api_sig += i + params[i];
    }

    params.api_sig = util.string.md5(api_sig + api_secret);
    params.format = 'json';

    if ($.inArray(method, this.write_methods) == -1) {

        var cache_result = lscache.get(cache_key);
        var is_nocache_method = ($.inArray(method, this.nocache_methods) != -1);

        if (cache_result && !is_nocache_method) {

            callback(cache_result);

        } else {

            callback.cache_key = cache_key;

            $.jsonp({
                'url': this.api_url+'?callback=?',
                'data': params,
                'pageCache': false,
                // cache = true -- потому что мы сами ставим флаг для кэширования (параметр rnd).
                // jquery-jsonp не позволяет с false работать нормально с подписанными запросами LFM
                'cache': true,
                'dataType': 'jsonp',
                //'timeout': 15000,
                'success': function(data) {
                    if (data['error']) {
                        ui.notification.show('error', 'Произошла ошибка во время запроса к Last.fm API. Для корректной работы может потребоваться перезапуск приложения. ' + data.message + ' (код '+ data.error + ')', true);
                    } else {
                        if (!is_nocache_method) {
                            var minutes = 60*24*7;  // a week
                            if ($.inArray(method, network.lastfm.shortcache_methods) != -1) {
                                minutes = 10;
                            }
                            lscache.set(callback.cache_key, data, minutes);
                        }
                        callback(data);
                    }
                },
                'error': function(data, msg) {
                    window.setTimeout(function(){
                        network.lastfm.api(method, passed_params, callback);
                    }, 1000);
                    ui.notification.show('error', msg + ', попробуем ещё разок');
                }
            });

        }

    } else {
        $.post('/app/_/lastfm_proxy/', params, function(data){
            callback(data);
        });
    }
};

network.lastfm.login = function(user, session_key) {
    this.user = user;
    this.session_key = session_key;
    this.authorized = true;
    util.cookie.set('tvoeradio_lastfm_user', user, 60*60*24*1000);
    util.cookie.set('tvoeradio_lastfm_session_key', session_key, 60*60*24*1000);
};


network.lastfm.cookielogin = function() {
    var user = util.cookie.get('tvoeradio_lastfm_user');
    var session_key = util.cookie.get('tvoeradio_lastfm_session_key');
    if (user && session_key) {
        this.login(user, session_key);
    }
};


network.lastfm.logout = function() {
    this.user = null;
    this.session_key = null;
    this.authorized = false;
    util.cookie.remove('tvoeradio_lastfm_user');
    util.cookie.remove('tvoeradio_lastfm_session_key');
};


network.lastfm.arrayize = function(o) {
    return $.isArray(o) ? o : [o];
};


network.lastfm.select_image = function(list, size, square) {
    list = network.lastfm.arrayize(list);
    var image = list[list.length-1]["#text"];
    for (var i = 0; i < list.length; i++) {
        if (list[i].size == size) {
            image = list[i]['#text'];
        }
    }
    if (square) {
        image = image.replace().replace('/64/', '/64s/');
    }
    return image;
};