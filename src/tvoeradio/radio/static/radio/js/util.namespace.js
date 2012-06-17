function register_namespace(ns) {
    var nsParts = ns.split(".");
    var root = window;

    for(var i=0; i<nsParts.length; i++) {
        if(typeof root[nsParts[i]] == "undefined")
            root[nsParts[i]] = new Object();
        root = root[nsParts[i]];
    }
}