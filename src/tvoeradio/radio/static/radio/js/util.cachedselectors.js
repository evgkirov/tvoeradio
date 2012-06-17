register_namespace('util.cachedselectors');

util.cachedselectors.list = {};

util.cachedselectors.select = function(selector) {
    if (!(selector in util.cachedselectors.list)) {
        util.cachedselectors.list[selector] = $(selector);
    }
    return util.cachedselectors.list[selector];
};

window.$c = util.cachedselectors.select;