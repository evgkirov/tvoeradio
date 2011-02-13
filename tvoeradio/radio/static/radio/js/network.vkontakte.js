register_namespace('network.vkontakte');

network.vkontakte = VK;

network.vkontakte.search_audio = function(artist, title, callback, callback_notfound) {
    this.api('audio.search', {'q': artist+' '+title, 'sort': 0 }, function(data) {
        if (data.response[0] != '0') {
            // Поиск наиболее подходящего файла
            var mp3 = data.response[1];
            var best_match = Infinity;
            var durations = {};
            var best_duration = 0;
            var best_duration_num = 0;
            $.each(data.response, function(k,v){
                if (k) {
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
                if (k) {

                    if (best_match) {
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
            
        } else {
            if (callback_notfound) {
                setTimeout(callback_notfound, 350, artist, title, callback, callback_notfound);
                //callback_notfound(artist, title, callback, callback_notfound);
            }
        }
    });
};