Ext.onReady(function(){
	Ext.QuickTips.init();

	var loginForm = Ext.create('Ext.form.Panel', {
		id:'loginForm',
		frame:true,
		border: false,
		bodyStyle : "background-image:url('images/new_login.jpg')",
		width:567,
        height:370,
		frameHeader:true,
		layout:'anchor',
        fieldDefaults: {
			labelAlign: 'right',
            msgTarget: 'side',
			labelSeparator:'',
            labelWidth: 90
        },
        
        defaults: {
            //anchor: '95%'
        },
        items: [
			{
				xtype:'textfield',
				name: 'username',
				id:'username',
				allowBlank: false,
				blankText:'Username is Required',
				x: 35,
				y: 69,
				fieldStyle:'background:transparent;border:0px;font-size:12px;font-weight:bold;color:white;',
				height:25,
				width:314,
				//style: 'font-size:25px',
				autoHeight: true,
				emptyText:'Please enter the username'
			},
			{
				xtype:'textfield',
				name: 'password',
				allowBlank: false,
				inputType:'password',
				blankText:'Password is Required',
				fieldStyle:'background:transparent;border:0px;font-size:12px;font-weight:bold;color:white;',
				x: 35,
				y: 118,
				style: 'font-size:50px',
				height:25,
				width:314,
				autoHeight: true,
				emptyText:'Please enter the password'
			},{
				xtype: 'checkbox',
			       x: 205,
				y: 133,
				boxLabel  : 'Remember Me',
				name      : 'remember_me',
				inputValue: '1',
				id        : 'checkbox1',
				/* fieldStyle:'font-weight:bold;color:white;', */
				style: 'font-size:13px;color:#CBE4EC; '
				
			},  
			{
				xtype : 'image',
				src : "./code.php",
				margin:'110 40',
				width:115,
				height:35,
				draggable : true
			},{
				xtype:'textfield',
				name:'code',
				id:'code',
				msgTarget:'side',
				allowBlank:false,
				blankText:'Captcha code is Required',
				fieldStyle:'background:transparent;border:0px;font-size:12px;font-weight:bold;color:white;',
				padding:-50,
				x: 35,
			    y: -73,
			    height:25,
			    width:314,
				labelSeparator:'',
				emptyText:'Please enter the letters you see above here'
			},
			{
				xtype:'button',
				text:'Login',
				x: 413,
				y: -166,
				width:100,
				preventDefault: false,
				height:24,
				fieldSubTpl: ['<input id="{id}" type="{type}" ', '<tpl if="name">name="{name}" </tpl>', '<tpl if="size">size="{size}" </tpl>', '<tpl if="tabIdx">tabIndex="{tabIdx}" </tpl>', 'class="{fieldCls} {typeCls}" autocomplete="on" />', {compiled: true, disableFormats: true}],
				style: "background:transparent; border:0px;font-weight:bold;",
				handler:function(thisForm, options){
					this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {
						fn: doSubmit(),
						scope: this
					});
				}
			},{
				xtype:'button',
				text:'Forgot Password?',
				x: 300,
				y: -90,
				height:35,
				width:120,
				//style:'background:transparent;border:0px',
				handler:function(){
					Ext.Msg.alert('Forgot Password','Please contact Support');
				}
			}		],
		listeners: {
            afterRender: function(thisForm, options){
                this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {
                    enter: doSubmit,
                    scope: this
                });
            }
		}
    });

	Ext.create('Ext.Window', {
        title: "", //Vehicle Tracking System",
		id:'loginWindow',
        width:567,
        height:372,
		x:600,
		y:200,
		plain: true,
		closable:false,
		border: false,
        layout: 'fit',
        items: [loginForm],
		resizable:false,
		listeners:{
			afterrender:function(){
				setTimeout('Ext.get(\'loading\').fadeOut({remove: true});',300)
			}
		}
    }).show();
	Ext.getCmp('username').focus(true,1000);
	Ext.select(".x-slider-thumb").setStyle("left","-7px");
});

function doSubmit(){
	var fp = Ext.getCmp('loginForm').getForm();
	if(fp.isValid()){
		fp.submit({
			method:'POST',
			waitTitle:'Connecting',
			waitMsg:'Authenticating...',
			url:'./includes/login_ajx.php',
			success:function(){
				Ext.getCmp('loginWindow').hide();
				var redirect = 'cpanel.php';
				window.location = redirect;
			},
			failure:function(form, action){
				if(action.failureType == 'server'){
					obj = Ext.decode(action.response.responseText);
					Ext.Msg.alert('Login Failed!', obj.errors.reason);
				}else{
					if(action.response.responseText)
						resText = " : " + action.response.responseText;
					else
						resText = '';

					Ext.Msg.alert('Warning!', 'Authentication server is unreachable' +  resText);
				}
				Ext.getCmp('loginForm').getForm().reset();
				Ext.getCmp("sliderLogin").thumbs[0].el.shift({left: "-7px", stopFx: true, duration:.35});
			}
		});
	}
}