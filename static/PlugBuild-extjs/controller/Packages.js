Ext.define('PlugBuild.controller.Packages', {
    extend: 'Ext.app.Controller',

    init: function() {
        console.log('Initialize package controller');
        
        PackageStore = this.getPackagesStore();
    
    },
    views:  ['package.List'],
    stores: ['Packages'],
    models: ['Package'],
});

 