register_namespace('ui.menu');


/**
 * Открывает меню по его идентификатору.
 *
 * @param {String} id Идентификатор меню
 */
ui.menu.open = function(id) {
    this.close_all();
    if (id) {
        var $menu = $('#'+id);
        var $menu_button = $('#'+id+'_button');
    } else {
        var $menu = $('.menu');
        var $menu_button = $('.menu_button');
    }
    $menu_button.addClass('menu_button_active');
    $menu.fadeIn(200, function() {
        $('body').bind('click', ui.menu.close_all)
    });
};


/**
 * Закрывает меню по его идентификатору.
 *
 * @param {String} id Идентификатор меню. Если не представлено - закрытие всех меню.
 */
ui.menu.close = function(id) {
    if (id) {
        var $menu = $('#'+id);
        var $menu_button = $('#'+id+'_button');
    } else {
        var $menu = $('.menu');
        var $menu_button = $('.menu_button');
    }
    $menu_button.removeClass('menu_button_active');
    $menu.fadeOut(200, function() {
        $('body').unbind('click', ui.menu.close_all)
    });
};


/**
 * Закрывает все меню.
 */
ui.menu.close_all = function() {
    ui.menu.close();
};



ui.menu.toggle = function(id) {
    var $menu = $('#'+id);
    var $menu_button = $('#'+id+'_button');
    if ($menu_button.hasClass('menu_button_active')) {
        this.close(id);
    } else {
        this.open(id);
    }
};


$(document).ready(function(){
    $('.menu_button').hoverIntent({
        over: function() {
           ui.menu.open($(this).attr('id').slice(0,-7));
        },
        timeout: 500
    });

    $('.menu').hoverIntent({
        timeout: 200,
        out: function() {
           ui.menu.close_all();
        }
    });

});

