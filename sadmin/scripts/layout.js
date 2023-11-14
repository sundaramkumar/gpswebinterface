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

function LoadTabs(tabname){

	if(! chkSAdminTabs(tabname) ){
	
		var loadTabPanel = Ext.getCmp('contentPanel');
        
		loadTabPanel.add(
		{
		
			title:tabname,
			xtype:'container',
			layout:'fit',
			id:'SAdminPanel'+tabname,
			closable:true,
			listeners:{
				afterrender:function(){
					//alert('show'+tabname+'()');
					eval('show'+tabname+'()');
					
					
				}
			}
			
		}).show()
		;
	}
}



var SAdminTabPanels = {
		title:'Dashboard',
		xtype:'tabpanel',
		id:'cpanelDashboard',
		renderTo:Ext.getCmp('centerPanel'),
		listeners:{
			afterrender:function(){
				showDashboardItems();
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
        layout: 'border',
        title: 'Vehicle Tracking System',
        items: [{
            xtype: 'box',
            id: 'header',
            region: 'north',
			contentEl:'north',
            height: 70
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
				items:[SAdminTabPanels]
            },
			accordion]
        },{
			region: 'south',
			id:'statusMsg',
			height: 25,
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
			eval(loadPageListSplt[i]+"()");
		}
	}
}

Ext.override(Ext.LoadMask, {
      onHide: function() { this.callParent(); }
}); 
