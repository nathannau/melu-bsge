'use strict';

var Vue = require('vue');
var { api } = require('./Api');

module.exports = Vue.component('home', { 
    template: require('./home.html'),
    data: function() { return {
    }; },
    methods: {
        save: async function() {
            this.$showLoading();
            var data = await api.getConfig();
            console.log(JSON.stringify(data));
            var content = new Blob([JSON.stringify(data)], {type: 'application/octet-stream' /*'text/plain'*/});
            console.log(content);
            var url = window.URL.createObjectURL(content);

            var $ = require("jquery");
            var lnk = $('<a />').attr({
                href:url,
                download: "melu.cnf",
            }).css({ display:'none'});
            lnk.appendTo('body');
            lnk[0].click();
            lnk.remove();
            window.URL.revokeObjectURL(url);

            //console.log(url);
            //window.location = url;
            this.$hideLoading();
        },
        load: async function() {
            // var succes = await api.login(this.pwd);
            // this.error = succes ? false : "Mot de passe invalid"
            // if (succes)
            //     this.$openAlert( {
            //         message:'Connexion réussi', 
            //         timeout:2000, 
            //         onclose:function() { window.location = '#home'; },
            //     });
        },

    },
});