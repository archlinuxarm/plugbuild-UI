Ext.define('PlugBuild.view.package.List', {
    extend: 'Ext.grid.Panel',
    alias : 'widget.packagelist',
    loadMask:true,
    store: 'Packages',
    title : 'All Packages',
    verticalScroller: {
        xtype: 'paginggridscroller',
        activePrefetch: false
    },
    loadMask: true,
    disableSelection: true,
    invalidateScrollerOnRefresh: false,
    viewConfig: {
            trackOver: false
    },
    initComponent: function () {
        
       
        this.columns = [
            {header: 'Name',  dataIndex: 'package',  flex: 1},
            {header: 'Repo', dataIndex: 'repo', flex: 1},
            {header: 'v7 Fail', dataIndex: 'v7_fail', flex: 1},
            {header: 'v5 Fail', dataIndex: 'v5_fail', flex: 1},
            {header: 'v7 Done', dataIndex: 'v7_done', flex: 1},
            {header: 'v5 Done', dataIndex: 'v5_done', flex: 1}
        ];

        this.callParent(arguments);
    }
});