register_namespace('network.vkontakte');

network.vkontakte = VK;

network.vkontakte.real_api = VK.api;

network.vkontakte.api = function(method, params, callback) {
    if (!callback) {
        callback = $.noop;
    }
    network.vkontakte.real_api(method, params, function(data) {
        if (data['error']) {

            switch (data.error.error_code) {

                case 6: // Too many requests per second.
                    window.setTimeout(network.vkontakte.api, 3000, method, params, callback);
                    break;

                case 10007: // Operation denied by user.
                    break;

                default:
                    ui.notification.show('error permanent', 'Произошла ошибка во время запроса к VK API. Для корректной работы может потребоваться перезапуск приложения. ' + data.error.error_msg + ' (код '+ data.error.error_code + ')');

            }

        } else {
            callback(data);
        }
    });
};


network.vkontakte.search_audio = function(artist, title, callback, callback_notfound) {

    var q = artist.replace(/"/g,' ') + ' ' + title.replace(/"/g,' ');
    var code = [];
    code.push('return');
    code.push('API.audio.search({"q": "' + q + '", "sort": 0, "lyrics": 1})');
    code.push('+ API.audio.search({"q": "' + q + '", "sort": 0})');
    code.push(';');

    this.api('execute', {'code': code.join(' ')}, function(data) {

        if (data.response.length <= 2) {
            if (callback_notfound) {
                setTimeout(callback_notfound, 1000, artist, title, callback, callback_notfound);
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


network.vkontakte.choose_friend = function(callback) {
    ui.popup.show('Выберите друга', '<div class="infoblock-loader"></div>');
    network.vkontakte.api('friends.get', {'fields': 'uid,first_name,last_name,photo'}, function(data){
        var html = ich.tpl_popup__choose_friend({
            'friends': data.response
        });
        ui.popup.set_content(html);
        var input = $('#popup__choose_friend .popup__qsearch input');
        var items = $('#popup__choose_friend .people-list__item');
        items.each(function(index){
            $(this).attr('data-searchstr', $(this).attr('data-searchstr').toLowerCase());
        });
        items.click(function(){
            ui.popup.hide();
            var uid = parseInt($(this).data('uid'));
            callback(uid);
        });
        input.keyup(function(){
            items.hide().filter('[data-searchstr*="' + input.val().toLowerCase() + '"]').show();
        });
    });
};