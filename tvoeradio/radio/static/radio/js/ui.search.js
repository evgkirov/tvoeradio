register_namespace('ui.search');


ui.search.timeout = null;


ui.search.load_suggest_for = function(type, txt) {
    var params = {};
    params['limit'] = 5;
    params[type] = txt;
    network.lastfm.api(type + '.search', params, function(data) {
        if (data.results['@attr']['for'] != $('#search-widget__text').val()) {
            return;
        }
        var items = network.lastfm.arrayize(data.results[type + 'matches'][type]);
        var html = '';
        for (var i in items) {
            html += '<li rel="' + type + '">'+items[i].name+'</li>';
        }
        if (html != '') {
            $('#search-suggest__' + type + ' ul').html(html);
            $('#search-suggest').show();
        }
    });
};


ui.search.load_suggest = function(txt) {
    ui.search.load_suggest_for('artist', txt);
    ui.search.load_suggest_for('tag', txt);
};


ui.search.load_result = function(type, name) {
    $('#search-suggest').hide();
    $('#dashboard').hide();
    $('#search-result').show();
    $('#search-widget__clear').show();
    $('#search-widget__text').val(name);
    ui.infoblock.show($('#search-result'), type, name);
};


$(document).ready(function() {

    $('#search-suggest li').live('click', function(){
        ui.search.load_result($(this).attr('rel'), $(this).text());
    });

    $('#search-widget').children('.input_text').blur(function(e) {
        setTimeout($('#search-suggest').hide, 1000);
    });

    $('#search-widget__clear').click(function(){
        $('#search-widget__clear').hide();
        $('#dashboard').show();
        $('#search-result').hide();
        $('#search-widget__text').val('');
        $('#search-suggest').hide();
    });

    $('#search-widget').children('.input_text').keyup( function(e) {
        var $this = $(this);

        if ($this.val() == '') {
            $('#search-suggest').hide();
            return;
        }

        if (e.which == 13) { // enter

            var $li_active = $('#search-suggest li.active');
            if ($li_active.length) {
                ui.search.load_result($li_active.attr('rel'), $li_active.text());
            }

        } else if ((e.which == 40) || (e.which==38)) { // up / down

            var $li = $('#search-suggest li');
            var active = -1;
            for (var i = 0; i < $li.length; i++) {
                if ($($li[i]).hasClass('active')) {
                    active = i;
                }
            }
            $($li[active]).removeClass('active');
            active += (e.which == 40) ? 1 : -1;
            if (active == $li.length) {
                active = -1;
            }
            if (active == -2) {
                active = $li.length-1;
            }
            $($li[active]).addClass('active');

            $this.val((active >= 0) ? $($li[active]).text() : $('#search-suggest__text').val());

        } else {

            $('#search-suggest').css({
                'left': $this.position().left-100+'px'
            })
            .width($this.outerWidth()+98);

            $('#search-suggest ul').width($this.outerWidth());
            //$('#search-suggest__text').val($this.val());

            clearTimeout(ui.search.timeout);
            if (e.keyCode == 32) {
                ui.search.load_suggest($this.val());
            } else {
                ui.search.timeout = setTimeout(ui.search.load_suggest, 300, $this.val());
            }

        }
    });

});
