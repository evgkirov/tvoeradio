register_namespace('ui.popup');


ui.popup.show = function(title, content, width) {
    $('.popup').width(width || 550).css('margin-left', -Math.ceil((width || 550)/2));
    ui.popup.set_title(title);
    ui.popup.set_content(content)
    $('.popup, #popup-overlay').show();
};


ui.popup.set_title = function(title) {
    $('.popup .popup__title div').text(title);
};

ui.popup.set_content = function(content) {
    $('.popup .popup__content').html(content||'');
};


ui.popup.hide = function() {
    $('.popup, #popup-overlay').hide();
};


$(document).ready(function(){
    $('#popup-overlay, .popup__close, .form__cancel').live('click', function(){
        ui.popup.hide();
    });

});