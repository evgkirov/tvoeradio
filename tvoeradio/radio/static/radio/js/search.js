var to = null;

$(document).ready(function() {

    var $widget = $('#search-widget');

    $('#search-suggest li').live('click', function(){
        $('#search-suggest').hide();
        $('#typehere').hide();
        $('#search-result').show();
        ui.infoblock.show($('#search-result'), $(this).attr('rel'), $(this).text());
        $('#search-widget__text').val($(this).text());
    });

    $widget.children('.input_text').blur(function(e) {
        setTimeout($('#search-suggest').hide, 1000);
    });
    
    $widget.children('.input_text').keyup( function(e) {
        var $this = $(this);

        if ($this.val() == '') {
            $('#search-suggest').hide();
            return;
        }

        if (e.which == 13) { // enter
            $('#search-suggest').hide();
            var $li_active = $('#search-suggest li.active');
            $('#typehere').hide();
            $('#search-result').show();
            ui.infoblock.show($('#search-result'), $li_active.attr('rel'), $li_active.text());
            
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
                'top': $this.position().top+$this.outerHeight()+1+'px',
                'left': $this.position().left-100+'px'
            })
            .width($this.outerWidth()+100);

            $('#search-suggest ul').width($this.outerWidth());
            $('#search-suggest__text').val($this.val());
            
            function load_tratata(txt) {
                network.lastfm.api('artist.search', { 'artist': txt, 'limit': 5 }, function(data) {
                    if (data.results['@attr']['for'] != $this.val()) {
                        return;
                    }
                    var artists = network.lastfm.arrayize(data.results.artistmatches.artist);
                    var html = '';
                    for (var i in artists) {
                        html += '<li rel="artist">'+artists[i].name+'</li>';
                    }
                    if (html != '') {
                        $('#search-suggest__artists ul').html(html);
                        $('#search-suggest').show();
                    }
                });
            }
            clearTimeout(to);
            to = setTimeout(load_tratata, 100, $this.val());
           
        }
    });

});
