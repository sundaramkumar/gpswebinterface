var gpsCook = "";
var deviceTrackArr = new Array();

if(Ext.getCmp("cpanelDashboard")){
	Ext.getCmp("centerPanel").setActiveTab("cpanelDashboard");
}

function chkSAdminTabs(tabid){
	if(Ext.getCmp("SAdminPanel"+tabid)){
		//alert("SAdminPanel"+tabid);
		Ext.getCmp("contentPanel").setActiveTab("SAdminPanel"+tabid);
		return true;
	}else{
		return false;
	}
}
function LoadTabs(tabid, tabname){
	//console.log('SAdminPanel'+tabid);
	if(! chkSAdminTabs(tabid) ){
		var loadTabPanel = Ext.getCmp('contentPanel');
		loadTabPanel.add(
		{
			title:tabname,
			xtype:'container',
			layout:'fit',
			id:'SAdminPanel'+tabid,
			closable:true,
			listeners:{
				afterrender:function(){
					eval('show'+tabid+'()');
				}
			}
		}).show();
	}
}



var SAdminTabPanels = {
	title:'Dashboard',
	xtype:'panel',
	border:false,
	id:'cpanelDashboard',
	renderTo:Ext.getCmp('centerPanel'),
	listeners:{
		afterrender:function(){
			showDashboardItems();
		}
	}
};

var liveTrackingPanels = {
	title:'Live Tracking',
	xtype:'panel',
	border:false,
	id:'trackingDashboard',
	renderTo:Ext.getCmp('centerPanel'),
	layout:{
		type:'fit'
	},
	listeners:{
		afterrender:function(){
			showLiveTacking();
		}
	}
};

Ext.onReady(function(){
	gpsCook = new Ext.state.CookieProvider({});
    Ext.tip.QuickTipManager.init();

	/*var menu_store = Ext.create('Ext.data.TreeStore', {
        root: {
            expanded: true
        },
        proxy: {
            type: 'ajax',
            url: 'scripts/tree-data.json'
        }
    });*/


	Ext.create('Ext.Viewport', {
        layout: {
			type: 'border'
		},
        title: 'Vehicle Tracking System',
        items: [{
            //xtype: 'box',
			baseCls:'x-plain',
            id: 'header',
            region: 'north',
			contentEl:'north',
			split: true,
			collapsible: true,
			collapseMode: 'mini',
			minHeight:80,
			maxHeight:80,
            height: 80
        },{
			region:'center',
            split: true,
            height: 200,
			id:'centerPanel',
            layout: {
                type: 'border'
            },
            items: [{
                //title: 'Details',
                region: 'center',
				xtype:'tabpanel',
				id:'contentPanel',
				deferredRender:false,
				layoutOnTabChange :true,
				border:false,
				activeTab:0,
				items:[SAdminTabPanels,liveTrackingPanels]
            },
			accordion]
        },{
			region: 'south',
			id:'statusMsg',
			height: 25,
			minHeight:25,
			maxHeight:25,
			border:false,
			title: 'Splitter above me'
		}],
		listeners:{
			afterrender:function(){
				setTimeout('Ext.get(\'loading\').fadeOut({remove: true});',300);
				setUsername();
			}
		},
        renderTo: Ext.getBody()
    });
});

function loadSessionPage(){
	var loadPageList	= gpsCook.get('loadpage');
	var loadPageListSplt= loadPageList.split(",");
	for(var i=0;i<loadPageListSplt.length;i++){
		if(loadPageListSplt[i]!=""){
			//eval(loadPageListSplt[i]+"()");
		}
	}
}
