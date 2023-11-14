Ext.onReady(function(){
	Ext.QuickTips.init();

	var loginForm = Ext.create('Ext.form.Panel', {
		id:'loginForm',
		frame:true,
		border: false,
		width:380,
        height:370,
		//width:400,
        bodyPadding:5,
		frameHeader:true,
		//monitorValid:true,
		/*keys: [{
			key: Ext.EventObject.ENTER,
			fn: doSubmit
		}],*/
		layout:'anchor',
        fieldDefaults: {
			labelAlign: 'right',
            msgTarget: 'side',
			labelSeparator:'',
            labelWidth: 90
        },
        defaultType: 'textfield',
        defaults: {
            //anchor: '95%'
        },
        items: [
			Ext.create('Ext.Component', {
                onRender : function(ct, position){
                    this.el = ct.createChild({tag: 'div', cls: "go-app-logo"});
                }
        }),{
			fieldLabel:'Username',
			name:'username',
			id:'username',
			//vtype:"alpha",
			allowBlank:false,
			anchor: '95%',
			emptyText:'Please enter the Username'
        },{
			fieldLabel:'Password',
			name:'password',
			id:'password',
			inputType:'password',
			allowBlank:false,
			anchor: '95%',
			emptyText:'Please enter the Password'
        },
		Ext.create('Ext.Component', {
			//height: 200,
			autoEl: { tag: 'img', src:"../code.php", alt:"Captcha",style:"padding-left:96px;"}
		}),{
			fieldLabel:'Security Code',
			name:'code',
			id:'code',
			msgTarget:'side',
			allowBlank:false,
			anchor: '95%',
			labelSeparator:'',
			emptyText:'Please enter the letters you see above here'
		},
		Ext.create('Ext.Component', {onRender : function(ct, position){this.el = ct.createChild({tag: 'div', style: "padding-top:5px"});}}),
		{
			xtype:'slider',
			id:'sliderLogin',
			//width: 320,
			minValue: 0,
			maxValue: 100,
			anchor: '95%',
			useTips :false,
			listeners:{
				 //changecomplete :function
				 dragend : function(){
					//console.log(this.getValue());
					if(this.getValue()>90 && loginForm.getForm().isValid()){
						doSubmit();
					}else{
						//this.setValue(0);
						//Ext.select(".x-slider-thumb").setStyle("left","-7px");
						//console.log("dragend"+this.thumbs[0].el.getLeft(true));
						this.thumbs[0].el.shift({left: "-7px", stopFx: true, duration:.35});
						//this.thumbs[0].el.setLeft("7px");
						//console.log("dragend - after"+this.thumbs[0].el.getLeft(true));
						//Ext.select(".x-slider-thumb").setStyle("left","-7px");
					}
				 },
				 render:function(){
					//alert(this.thumb.style);
					this.thumbs[0].el.setLeft("-7px");
				 },
				 drag:function(){
					//console.log(this.thumbs[0].el.getLeft(true));
					if(this.thumbs[0].el.getLeft(true) > 242)
						this.thumbs[0].el.setLeft("242px");
				 }

			}
		}],
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
        width:380,
        height:370,
        plain: true,
		closable:false,
		border: false,
        layout: 'fit',
        items: [loginForm],
		resizable:false,
		/*buttons: [{
            text: 'Login',
			handler:doSubmit
        }],*/
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'bottom',
			items: ['->',
				{
					xtype:'button',
					text:'Forgot Password?',
					handler:function(){
						Ext.Msg.alert('Forgot Password','Please contact Support');
					}
				}
			]
		}],
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
			url:'../includes/login_ajx.php',
			success:function(){
				Ext.getCmp('loginWindow').hide();
				var redirect = 'airpanel.php';
				window.location = redirect;
			},
			failure:function(form, action){
				if(action.failureType == 'server'){
					obj = Ext.decode(action.response.responseText);
					Ext.Msg.alert('Login Failed!', obj.errors.reason);
					location.href="air.php";
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