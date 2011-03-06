register_namespace('network.lastfm');


network.lastfm.api_url = null;
network.lastfm.api_key = null;
network.lastfm.api_secret = null;
network.lastfm.cache = {};
network.lastfm.user = null;
network.lastfm.authorized = false;
network.lastfm.auth_token = null;
network.lastfm.session_key = null;
network.lastfm.nocache_methods = ['auth.getToken'];
network.lastfm.write_methods = ['track.updateNowPlaying', 'track.scrobble', 'track.love'];


network.lastfm.api = function(method, params, callback) {
    var cache_key = method;
    var _this = this;
    var callback = callback || $.noop;
    
    for (var k in params) {
        cache_key += '&' + k + '=' + params[k];
    }

    params.method = method;
    params.api_key = this.api_key;
    if (this.session_key) {
        params['sk'] = this.session_key;
    }
    params = util.array.sort_by_key(params);
    api_sig = '';
    for (var i in params) {
        api_sig += i + params[i];
    }

    params.api_sig = util.string.md5(api_sig + this.api_secret);
    params.format = 'json';

    if (this.write_methods.indexOf(method)==-1) {

        if ((this.cache[cache_key]) && (this.nocache_methods.indexOf(method)==-1)) {
            callback(this.cache[cache_key]);
        } else {
            callback.cache_key = cache_key;
            $.getJSON(this.api_url+'?callback=?', params, function(data) {
                _this.cache[callback.cache_key] = data;
                callback(data);
            });
        }
        
    } else {
        $.post('/app/lastfm_proxy/', params, function(data){
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
