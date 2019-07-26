'use strict';

var Vue = require('vue');

module.exports = Vue.component('controle-list', { 
    template: require('./controle-list.html'),
    props: {
        config: String,
        defaultValue: String
    },
    data: function() { 
        var item = null;
        try { item = JSON.parse(this.config); } catch { item = {}; }
        if (typeof(item)!='object') item = {};

        var valuePairs = [];
        if (item.values) 
            for (var i in item.values)
                valuePairs.push({ key:i, label:item.values[i] });
            
        var valueSingle = this.defaultValue || "";
        var valueMulti = valueSingle.split(';');
        if (valueMulti.length>0) valueSingle = valueMulti[0];

        return {
            item: Object.assign({
                multiple: false,
                values: {},
            }, item),
            valuePairs: valuePairs,
            valueSingle: valueSingle,
            valueMulti: valueMulti,
            true: true,
            false: false,
        };
    },
    methods: {
        addValue: function() { this.valuePairs.push({ key:'', label:'' }) }
    },
    watch: {
        valuePairs: { deep: true, handler: function(value) {
            console.log('watch valuePairs');
            var values = {};
            value.forEach(pair => { values[pair.key] = pair.label; });
            Vue.set(this.item, 'values', values);
        }},
        'item.multiple': function(multiple) {
        //     console.log('watch item.multiple');
            if (multiple)
                this.$emit('update:defaultValue', this.valueMulti.join(';'));
                // this.valueMulti = this.valueMulti
            
        //         this.value=[this.value];
        //     else if (Array.isArray(this.value) && this.value.length>0)
        //         this.value=this.value[0];
            else 
                this.$emit('update:defaultValue', this.valueSingle.toString());
        //         this.value=""
        },
        item: { deep: true, handler: function(value) { 
            // console.log('watch item');
            this.$emit('update:config', JSON.stringify(value));
        }},
        valueSingle: function(value) { 
            this.$emit('update:defaultValue', value.toString());
        },
        valueMulti: function(value) { 
            value = value.filter(el=>{ return this.item.values[el]!=undefined});
            this.$emit('update:defaultValue', value.join(';'));
        },
    },

});


