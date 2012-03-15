Ext.define('PlugBuild.store.Packages', {
    extend: 'Ext.data.Store',
    model: 'PlugBuild.model.Package',
    pageSize: 50,
    // allow the grid to interact with the paging scroller by buffering
    buffered: true,
    // never purge any data, we prefetch all up front
    purgePageCount: 0,
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});