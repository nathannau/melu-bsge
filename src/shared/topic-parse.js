'use strict';

const CLIENT_NAME = 'client-name';

module.exports = function(pattern, topic) {
    if (!Array.isArray(pattern)) pattern = pattern.split('/');
    if (!Array.isArray(topic)) topic = topic.split('/');
    
    var ret = [];

    while (pattern.length)
    {
        var pat = pattern.shift();
        if (pat=='#') {
            if (pattern.length) return null;
            ret.push(topic.join('/'));
            topic = [];
            break;
        } else if (pat=='+') {
            if (!topic.length) return null;
            ret.push(topic.shift());
        } else if (!topic.length || pat!=topic.shift()) {
            return null;
        }
    }

    return topic.length ? null : ret;
}
