// Internet Explorer
/*if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}*/

// Opera blinking cursor
/*$(document).ready(function(){
    if (($.browser.opera) && (config.mode == 'vk')) {
        $('<style type="text/css">* {cursor:default !important;}</style>').appendTo('head');
    }
});*/