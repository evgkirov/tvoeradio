register_namespace('util.cookie');


/**
 * Get cookie.
 *
 * @param {String} name Name of cookie variable to get.
 * @return {String} Value of the variable we get.
 */
util.cookie.get = function(name) {

    //get all variables stored in the cookie
    var aCookie = document.cookie.split(';');

    //search variable we need
    for (var i = 0; i < aCookie.length; i++) {

        //remove spaces
        while(aCookie[i][0] == ' ') {
            aCookie[i] = aCookie[i].substr(1);
        }

        //get array [name, value]
        var aCrumb = aCookie[i].split('=');

        //if name is the same we are looking for, then return it
        if (name == aCrumb[0]) {
            return unescape(aCrumb[1]);
        }
    }

    //no variable with given name found
    return null;
};


/**
 * Set cookie with given name and value.
 *
 * @param {String} name Name of cookie variable.
 * @param {String} value Value of variable.
 * @param {String} expires Number of seconds cookie will be alive.
 * @param {String} path Server path to reduce visibility scope.
 * @param {String} domain Domain name for cookie.
 * @param {String} secure Secure.
 */
util.cookie.set = function(name, value, expires, path, domain, secure) {

    //define expires time
    var today = new Date();
    var expires_date = new Date(today.getTime() + (expires * 1000));

    //set cookie
    document.cookie =
            name + '=' + escape(value) +
            (expires ? ';expires=' + expires_date.toUTCString() : '') +
            (path    ? ';path=' + path : '' ) +
            (domain  ? ';domain=' + domain : '' ) +
            (secure  ? ';secure' : '' );
};


/**
 * Delete cookie. Use exactly the same parameters you used while cookie
 * creation.
 *
 * @param {String} name Name of cookie variable.
 * @param {String} path Server path.
 * @param {String} domain Domain name for cookie.
 */
util.cookie.remove = function(name, path, domain) {

    //make cookie expire 1 second ago
    setcookie(name, '', -1, path, domain);
};