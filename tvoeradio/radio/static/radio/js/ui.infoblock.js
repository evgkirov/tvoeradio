register_namespace('ui.infoblock');


ui.infoblock.convert_wiki = function (elem) {
    elem.find('a').each(function(){
        var html = '<span>' + $(this).text() + '</span>';
        if ($(this).hasClass('bbcode_artist')) {
            var artist = $(this).attr('href');
            artist = artist.replace('http://www.last.fm/music/', '');
            artist = util.string.urldecode(artist);
            html = '<span class="pseudolink nav-infoblock" data-type="artist" data-name="' + artist + '">' + $(this).text() + '</span>'
        }
        if ($(this).hasClass('bbcode_tag')) {
            var tag = $(this).attr('href');
            tag = tag.replace('http://www.last.fm/tag/', '');
            tag = util.string.urldecode(tag);
            html = '<span class="pseudolink nav-infoblock" data-type="tag" data-name="' + tag + '">' + $(this).text() + '</span>'
        }
        $(html).insertAfter($(this));
        $(this).remove();
    });
};


ui.infoblock.add_comments = function(elem, type, name) {
    var title = name + ' (в приложении «Твоёрадио»)';
    var hash = 'info/' + type + '/' + util.string.urlencode(name)
    var url = 'http://' + config.app_domain + '/app/vkredir/?hash=' + hash;
    var hash = util.string.md5(type + ' ' + name)
    var id = 'infoblock_' + type + util.random.randint(0, 100500);
    elem.find('.infoblock__comments').attr('id', id + '__comments');
    network.vkontakte.Widgets.Comments(
        id + '__comments',
        {
            'autoPublish': 1,
            'limit': 5,
            'mini': 1,
            'pageTitle': title,
            'pageUrl': url
        },
        hash
    );
}


ui.infoblock.show_artist = function(elem, name) {
    network.lastfm.api(
        'artist.getInfo',
        {
            'artist': name,
            'lang': 'ru'
        },
        function(data) {

            data.artist.url = data.artist.url.replace('http://www.last.fm', 'http://www.lastfm.ru');
            var context = {
                'name': data.artist.name,
                'artist': data.artist.name,
                'wiki_summary': data.artist.bio.summary,
                'wiki': data.artist.bio.content,
                'similar': network.lastfm.arrayize(data.artist.similar.artist),
                'tags': network.lastfm.arrayize(data.artist.tags.tag),
                'image': network.lastfm.select_image(data.artist.image, 'large'),
                'lastfm_url': data.artist.url,
                'lastfm_url_text': util.string.urldecode(data.artist.url),
                'stations': [
                    {
                        'type': 'similar',
                        'name': data.artist.name,
                        'html': player.station.similar.get_html(data.artist.name)
                    },
                    {
                        'type': 'artist',
                        'name': data.artist.name,
                        'html': player.station.artist.get_html(data.artist.name)
                    }
                ]
            };
            elem.html(ich.tpl_infoblock_artist(context));
            ui.get_ads(elem);
            ui.infoblock.convert_wiki($('.infoblock__wiki'));
            ui.infoblock.add_comments(elem, 'artist', data.artist.name);

            var artist = data.artist.name;
            network.lastfm.api(
                'album.search',
                {
                    'album': artist,
                    'limit': 1000
                },
                function(data) {
                    var albums = network.lastfm.arrayize(data.results.albummatches.album);
                    context['albums'] = [];
                    for (var i = 0; i < albums.length; i++) {
                        if (!albums[i]) {
                            continue;
                        }
                        if (albums[i].artist != artist) {
                            continue;
                        }
                        context['albums'].push({
                            'name': albums[i].name,
                            'cover': (network.lastfm.select_image(albums[i].image, 'large') || config.images.disc)
                        });
                    }
                    context['albums?'] = !!context['albums'].length;
                    var html = ich.tpl_infoblock_artist(context).find('.infoblock__photos').html();
                    elem.find('.infoblock__photos').html(html);
                    if (!context['albums?']) {
                        elem.find('.infoblock_photos').parent().hide();
                    }
                    if (elem.find('.infoblock__photos__inner__inner').height() <= 102) {
                        elem.find('.show-all-albums').hide();
                    }
                    elem.find('.show-all-albums').click(function(e){
                        e.preventDefault();
                        $(this).remove();
                        elem.find('.infoblock__photos').addClass('infoblock__photos_all');
                    });
                }
            );
        },
        function(data) {
            if (data.error == 6) {
                $(elem).text('Нет такого исполнителя.');
                return true;
            }
        }
    );
};


ui.infoblock.show_album = function(elem, name) {
    var parsed = /^(.+)\s\((.+)\)$/.exec(name);
    if (!parsed) {
        $(elem).text('Нет такого альбома.');
        return;
    }
    var album = parsed[1];
    var artist = parsed[2];
    network.lastfm.api(
        'album.getInfo',
        {
            'artist': artist,
            'album': album,
            'lang': 'ru'
        },
        function(data) {
            data.album.url = data.album.url.replace('http://www.last.fm', 'http://www.lastfm.ru');
            var context = {
                'name': data.album.name,
                'artist': data.album.artist,
                'tracks': network.lastfm.arrayize(data.album.tracks.track),
                'tags': network.lastfm.arrayize(data.album.toptags.tag),
                'image': network.lastfm.select_image(data.album.image, 'large'),
                'lastfm_url': data.album.url,
                'lastfm_url_text': util.string.urldecode(data.album.url),
                'stations': [
                    {
                        'type': 'album',
                        'name': name,
                        'html': player.station.album.get_html(name)
                    }
                ]
            };
            elem.html(ich.tpl_infoblock_album(context));
            ui.get_ads(elem);
            // ui.infoblock.convert_wiki($('.infoblock__wiki'));
            ui.infoblock.add_comments(elem, 'album', data.album.name + ' (' + data.album.artist + ')');
        },
        function(data) {
            if (data.error == 6) {
                $(elem).text('Нет такого альбома.');
                return true;
            }
        }
    );
};


ui.infoblock.show_tag = function(elem, name) {
    network.lastfm.api(
        'tag.getInfo',
        {
            'tag': name,
            'lang': 'ru'
        },
        function(data) {
            data.tag.url = data.tag.url.replace('http://www.last.fm', 'http://www.lastfm.ru');
            var context = {
                'name': data.tag.name,
                'wiki_summary': data.tag.wiki.summary,
                'wiki': data.tag.wiki.content,
                'lastfm_url': data.tag.url,
                'lastfm_url_text': util.string.urldecode(data.tag.url),
                'stations': [
                    {
                        'type': 'tag',
                        'name': data.tag.name,
                        'html': player.station.tag.get_html(data.tag.name)
                    }
                ]
            };
            elem.html(ich.tpl_infoblock_tag(context));
            ui.get_ads(elem);
            ui.infoblock.convert_wiki($('.infoblock__wiki'));
            ui.infoblock.add_comments(elem, 'tag', data.tag.name);

            network.lastfm.api(
                'tag.getTopArtists',
                {
                    'tag': name,
                    'limit': 25
                },
                function(data) {
                    context['top_artists'] = [];
                    var artists = context['artists'] = network.lastfm.arrayize(data.topartists.artist);
                    for (var i = 0; i < 4; i++) {
                        context['top_artists'].push({
                            'name': artists[i].name,
                            'image': network.lastfm.select_image(artists[i].image, 'medium', true)
                        });
                    }
                    var html = ich.tpl_infoblock_tag(context).find('.infoblock__artists').html();
                    elem.find('.infoblock__artists').html(html);
                    var html = ich.tpl_infoblock_tag(context).find('.infoblock__photos').html();
                    elem.find('.infoblock__photos').html(html);
                }
            );

            network.lastfm.api(
                'tag.getSimilar',
                {
                    'tag': name
                },
                function(data) {
                    context['tags'] = network.lastfm.arrayize(data.similartags.tag).splice(0, 10);
                    var html = ich.tpl_infoblock_tag(context).find('.infoblock__tags').html();
                    elem.find('.infoblock__tags').html(html);
                }
            );
        },
        function(data) {
            if (data.error == 6) {
                $(elem).text('Нет такого тега.');
                return true;
            }
        }
    );
};


ui.infoblock.show_user = function(elem, name) {
    network.lastfm.api(
        'user.getInfo',
        {
            'user': name
        },
        function(data) {
            data.user.url = data.user.url.replace('http://www.last.fm', 'http://www.lastfm.ru');
            var context = {
                'name': data.user.name,
                'image': network.lastfm.select_image(data.user.image, 'large'),
                'lastfm_url': data.user.url,
                'lastfm_url_text': util.string.urldecode(data.user.url),
                'it_is_you': (data.user.name == network.lastfm.user),
                'stations': [
                    {
                        'type': 'library',
                        'name': data.user.name,
                        'html': player.station.library.get_html(data.user.name)
                    },
                    {
                        'type': 'loved',
                        'name': data.user.name,
                        'html': player.station.loved.get_html(data.user.name)
                    }
                ]
            };
            if (data.user.name == network.lastfm.user) {
                context['stations'].push({
                    'type': 'recommendations',
                    'name': data.user.name,
                    'html': player.station.recommendations.get_html(data.user.name)
                });
            }
            elem.html(ich.tpl_infoblock_user(context));

            network.lastfm.api(
                'user.getTopArtists',
                {
                    'user': name,
                    'period': 'overall'
                },
                function(data) {
                    var artists = network.lastfm.arrayize(data.topartists.artist);
                    context['artists'] = [];
                    for (var i = 0; i < artists.length; i++) {
                        var image = network.lastfm.select_image(artists[i].image, 'medium', true);
                        if (image) {
                            context['artists'].push({
                                'name': artists[i].name,
                                'image': image
                            });
                        }
                    }
                    elem.html(ich.tpl_infoblock_user(context));
                    network.lastfm.api(
                        'user.getNeighbours',
                        {
                            'user': name,
                            'limit': 10
                        },
                        function(data) {
                            var neighbours = network.lastfm.arrayize(data.neighbours.user);
                            context['neighbours'] = [];
                            for (var i = 0; i < neighbours.length; i++) {
                                context['neighbours'].push({
                                    'name': neighbours[i].name
                                });
                            }
                            elem.html(ich.tpl_infoblock_user(context));
                        }
                    );
                    network.lastfm.api(
                        'user.getFriends',
                        {
                            'user': name,
                            'limit': 1000
                        },
                        function(data) {
                            var friends = network.lastfm.arrayize(data.friends.user);
                            context['friends'] = [];
                            for (var i = 0; i < friends.length; i++) {
                                context['friends'].push({
                                    'name': friends[i].name
                                });
                            }
                            elem.html(ich.tpl_infoblock_user(context));
                        }
                    );
                    if ((network.lastfm.authorized)&&(name != network.lastfm.user)) {
                        network.lastfm.api(
                            'tasteometer.compare',
                            {
                                'type1': 'user',
                                'value1': network.lastfm.user,
                                'type2': 'user',
                                'value2': name
                            },
                            function(data) {
                                context['tasteometer'] = Math.round(data.comparison.result.score * 100);
                                elem.html(ich.tpl_infoblock_user(context));
                            }
                        );
                    }
                },
                function(data) {
                    if (data.error == 6) {
                        $(elem).text('Нет такого пользователя на Last.fm.');
                        return true;
                    }
                }
            );
        }
    );
};


ui.infoblock.show = function(elem, type, name) {
    elem.html('<div class="infoblock-loader"></div>');
    ui.infoblock['show_' + type](elem, name);
};


ui.infoblock.show_popup = function(type, name) {
    ui.popup.show(name);
    ui.infoblock.show($('.popup .popup__content'), type, name);
};


$('.nav-infoblock').live('click', function(e) {
    e.preventDefault();
    ui.infoblock.show_popup($(this).data('type'), (($(this).data('name'))||$(this).text()));
});


