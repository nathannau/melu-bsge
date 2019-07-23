'use strict';

var Vue = require('vue');


class OverlayPlugin {
    static install(Vue /*, options*/) {
        var overlays = [];

        Vue.registreOverlay = function (overlay) {
            overlays.push(overlay);
        }
        Vue.unregistreOverlay = function (overlay) {
            var index = overlays.indexOf(overlay);
            overlays.slice(index, 1);
        }
        
        Vue.prototype.$showLoading = function () {
            overlays.forEach(overlay=>{
                overlay.showLoading();
            });
        }
        Vue.prototype.$hideLoading = function () {
            overlays.forEach(overlay=>{
                overlay.hideLoading();
            });
        }
        Vue.prototype.$openAlert = function (options) {
            overlays.forEach(overlay=>{
                overlay.openAlert(options);
            });
        }
        Vue.prototype.$closeAlert = function () {
            overlays.forEach(overlay=>{
                overlay.closeAlert();
            });
        }
    }
}
Vue.use(OverlayPlugin);


module.exports = Vue.component('overlay', { 
    template: require('./overlay.html'),

    data: function() { return {
        loading: false,
        alert: null,
    }},
    mounted: function() {
        Vue.registreOverlay(this);
    },

    methods: {
        showLoading: function() { 
            this.loading = true;
            var i = 0;
            var toAnim = function(p) { if (p>=10) p=19-p; return "0".padStart(p+1, '-').padEnd(10, '-')}
            //this.$refs.anim.innerText = toAnim(i);
            this.timerAnim = setInterval(()=>{ 
                i=(i+1)%20; 
                this.$refs.anim.innerText = toAnim(i);
            }, 100);
        },
        hideLoading: function() {
            clearInterval(this.timerAnim);
            this.timerAnim = null;
            this.loading = false;
        },
        openAlert: function(options) {
            if (typeof(options)=="string") options = { message:options };
            this.alert = {
                message: options.message,
                title: options.title,
                onclose: options.onclose,
            };
            if (options.timeout)
                this.timerAlert = setTimeout(this.closeAlert, options.timeout);

        },
        closeAlert: function() {
            clearTimeout(this.timerAlert);
            this.timerAlert = null;

            if (this.alert == null) return;
            var cb = this.alert.onclose;
            this.alert = null;
            if (cb) cb();
        },
    }
});


