register_namespace('network.lastfm');

network.lastfm.api_url = 'http://ws.audioscrobbler.com/2.0/';
network.lastfm.api_key = config.lastfm_api_key;
network.lastfm.cache = {};
network.lastfm.api = function(method, params, callback) {
    var cache_key = method;
    var _this = this;
    for (var k in params) {
        cache_key += '&'+k+'='+params[k];
    }

    if (this.cache[cache_key]) {
        callback(this.cache[cache_key]);
    } else {
        callback.cache_key = cache_key;
        params.format = 'json';
        params.method = method;
        params.api_key = this.api_key;

        $.getJSON(this.api_url+'?callback=?', params, function(data) {
            _this.cache[callback.cache_key] = data;
            callback(data);
        });
    }
}

network.lastfm.arrayize = function(o) {
    return $.isArray(o) ? o : [o];
}
