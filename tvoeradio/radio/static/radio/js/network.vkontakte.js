register_namespace('network.vkontakte');

network.vkontakte = VK;

network.vkontakte.search_audio = function(artist, title, callback, callback_notfound) {

    var q = artist.replace(/"/g,' ') + ' ' + title.replace(/"/g,' ');
    var code = [];
    code.push('return');
    code.push('    API.audio.search({"q": "' + q + '", "sort": 0, "lyrics": 1})');
    code.push('    + API.audio.search({"q": "' + q + '", "sort": 0})');
    code.push(';');

    this.api('execute', {'code': code.join(' ')}, function(data) {

        if (data.response.length <= 2) {
            if (callback_notfound) {
                setTimeout(callback_notfound, 350, artist, title, callback, callback_notfound);
            }
        } else {
            // всё ок - выбор наиболее подходящего файла
            var mp3 = data.response[1];
            var best_match = Infinity; // лучше когда 0
            var durations = {};
            var best_duration = 0;
            var best_duration_num = 0;
            $.each(data.response, function(k,v){
                if (typeof v == 'object') {
                    if (durations[v.duration]) {
                        durations[v.duration]++;
                    } else {
                        durations[v.duration] = 1;
                    }
                    if (durations[v.duration]>best_duration_num) {
                        best_duration_num = durations[v.duration];
                        best_duration = parseInt(v.duration);
                    }
                }
            });

            $.each(data.response, function(k,v){
                if (typeof v == 'object') {

                    if (best_match) {
                        // 100 * incorrect artist + 20 * incorrect title + |duration diff|
                        var cur_match = 100*util.string.levenshtein(artist, v.artist)+20*util.string.levenshtein(title, v.title)+Math.abs(v.duration-best_duration);
                        if (cur_match<best_match) {
                            best_match = cur_match;
                            mp3 = v;
                        }
                    }
                }
            });

            if (callback) {
                callback(mp3);
            }

        }
    });
};