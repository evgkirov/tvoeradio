register_namespace('network.lastfm');


network.lastfm.api_url = 'http://ws.audioscrobbler.com/2.0/';
network.lastfm.api_key = null;
network.lastfm.api_secret = null;
network.lastfm.cache = {};
network.lastfm.user = null;
network.lastfm.authorized = false;
network.lastfm.auth_token = null;
network.lastfm.session_key = null;
network.lastfm.nocache_methods = ['auth.getToken'];
network.lastfm.write_methods = ['track.updateNowPlaying'];


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

    params.api_sig = network.vkontakte.MD5(api_sig + this.api_secret);
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

            var html   = document.getElementsByTagName('html')[0];
            var iframe = document.createElement('iframe');
            var doc;
            iframe.width = 1;
            iframe.height = 1;
            iframe.style.border = 'none';
            html.appendChild(iframe);
            if (typeof(iframe.contentWindow) != 'undefined') {
                doc = iframe.contentWindow.document;
            } else if(typeof(iframe.contentDocument.document) != 'undefined') {
                doc = iframe.contentDocument.document.document;
            } else {
                doc = iframe.contentDocument.document;
            }
            doc.open();
            doc.clear();
            doc.write('<form method="post" action="' + this.api_url + '" id="form">');
            for(var param in params){
                doc.write('<input type="text" name="' + param + '" value="' + params[param] + '">');
            }
            doc.write('</form>');
            doc.write('<script type="application/x-javascript">');
            doc.write('document.getElementById("form").submit();');
            doc.write('</script>');
            doc.close();
    }
};


network.lastfm.arrayize = function(o) {
    return $.isArray(o) ? o : [o];
};
