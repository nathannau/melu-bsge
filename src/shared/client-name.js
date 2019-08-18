'use strict';

const CLIENT_NAME = 'client-name';

module.exports = {
    getName: function(options) {
        options = Object.assign({
            prefix: '',
            suffix: '',
        }, options);
        var name = window.localStorage.getItem(CLIENT_NAME);
        if (name==null) {
            name = Math.random().toString(36).substring(2);
            name = options.prefix + name + options.suffix;
            window.localStorage.setItem(CLIENT_NAME, name);
        }
        return name;
    },
    reset: function() {
        window.localStorage.removeItem(CLIENT_NAME);
        window.location.reload();
    }
}
