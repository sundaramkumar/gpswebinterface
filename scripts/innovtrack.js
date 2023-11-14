function agent(v) { return(Math.max(navigator.userAgent.toLowerCase().indexOf(v),0)); }
var is_ie = false;
var is_ff = false;
var is_ie6 = false;
var is_ie7 = false;
var is_ie8 = false;
var is_ie9 = false;
var is_ff15 = false;
var is_ff20 = false;
var is_ff30 = false;
var is_ff40 = false;
var is_ff90 = false;

if(agent('firefox'))
    is_ff = true;

if(agent('compatible; msie 8.0')){
    is_ie8 = true;
}
else if(agent('compatible; msie 7.0')){
    is_ie7 = true;
}else if(agent('compatible; msie 9.0')){
    is_ie9 = true;
}
else if(agent('compatible; msie 6.0')){
    is_ie6 = true;
}
else if(agent('msie'))
    is_ie = true;
else if(agent('firefox/3.'))
    is_ff30 = true;
else if(agent('firefox/2.0.0'))
    is_ff20 = true;
else if(agent('firefox/1.5'))
    is_ff15 = true;
else if(agent('firefox/4.'))
    is_ff40 = true;
else if(agent('firefox/9.'))
    is_ff90 = true;


//pops up a window with the specified width and height. can be centered in the screen
function openAWindow( pageToLoad, winName, width, height, center,winargs)
{
    xposition=0; yposition=0;
    if ((parseInt(navigator.appVersion) >= 4 ) && (center)){
        xposition = (screen.width - width) / 2;
        yposition = (screen.height - height) / 2;
    }
    if(!agent('msie')){
        height = parseInt(height,10)+75;
    }
    //    width=650,height=500,location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=no,screenx=(screen.width - width) / 2,screeny=(screen.height - height) / 2,left=(screen.width - width) / 2,top=(screen.height - height) / 2
    //0 => no
    //1 => yes
    //alert(winargs);
    if(!winargs){
        var args = "";
        //if(is_ie){
        //  args += "dialogWidth=" + width + "px;" + "dialogHeight=" + height +"px"
        //}else{
            args += "width=" + width + "," + "height=" + height + ","
            + "location=0,"
            + "menubar=0,"
            + "resizable=0,"
            + "scrollbars=yes,"
            + "statusbar=false,dependent,alwaysraised,"
            + "status=false,"
            + "titlebar=no,"
            + "toolbar=0,"
            + "hotkeys=0,"
            + "screenx=" + xposition + ","  //NN Only
            + "screeny=" + yposition + ","  //NN Only
            + "left=" + xposition + ","     //IE Only
            + "top=" + yposition;           //IE Only
            //fullscreen=yes, add for full screen
        //}
    }else{
        if(!winargs)winargs="";
        var args = "";
        args += "width=" + width + "," + "height=" + height + ","
            + winargs +","
            + "menubar=0,"
            + "resizable=0,"
            + "scrollbars=yes,"
            + "statusbar=false,dependent,alwaysraised,"
            + "status=false,"
            + "titlebar=no,"
            + "hotkeys=0,"
            + "screenx=" + xposition + ","  //NN Only
            + "screeny=" + yposition + ","  //NN Only
            + "left=" + xposition + ","     //IE Only
            + "top=" + yposition;           //IE Only
        args += winargs;

    }
    //alert(args);
    /*if(agent('msie')){
        args += ",dialogWidth:" + width + "px," + "dialogHeight:" + height+'px';
        window.showModalDialog(pageToLoad,winName,args);

    }
    else*/
        var dmcaWin = window.open(pageToLoad,winName,args );
        if(dmcaWin!=null){
            dmcaWin.focus();
            return dmcaWin;
        }else{
            alert('The popup window is blocked. Please Allow popups for Test Case Management.');
        }
    //window.showModalDialog(pageToLoad,"","dialogWidth:650px;dialogHeight:500px");
}