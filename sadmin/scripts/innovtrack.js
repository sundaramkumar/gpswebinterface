
function confLogout(){
	Ext.MessageBox.confirm('Confirm', 'Are you sure to Logout ?',
	function(con){
		if(con)
		{
			if(con=='yes'){
				var redirect = 'logout.php';
				window.location = redirect;
			}else{
				return false;
			}
		}
	});
}



function destroy_loadpage(destroypage){
	Ext.Ajax.request({
		url: 'includes/misc.php',
		params: {
			todo:'loadpage',
			destroypage : destroypage
		},
		timeout: 600000
	});
}

if ( !Number.prototype.toFixed ) Number.prototype.toFixed = function(fractionDigits)
{
   var m = Math.pow(10,fractionDigits);
   return Math.round(this*m,0)/m;
}
//Ex: (12.3456789).toFixed(5);	12.34568

function parseDouble(value){
  if(typeof value == "string") {
    value = value.match(/^-?\d*/)[0];
  }

  return !isNaN(parseInt(value)) ? value * 1 : NaN;
}

if ( !Number.prototype.toPrecision ) Number.prototype.toPrecision = function(precision)
{

   var l = Math.floor(Math.log(this)/Math.LN10);
   var m = Math.pow(10,l + 1 - precision);
   return Math.round(this/m,0)*m;
}
//Ex: (12.3456789).toPrecision(4);  	12.35

function latlon(lat,lon){
	console.log(lat+"@"+lon);
    /*var strlat = lat.replace(".","");
    var strlon = lon.replace(".","");
	//console.log(typeof strlat);
	//console.log(typeof strlon);

    strlat1 = strlat[0]+strlat[1];
    strlat2 = strlat[2]+strlat[3];
	console.log(strlat1+"@"+strlat2);
    strla = parseInt(strlat1,10)+(parseFloat(strlat2)/60);


    strlo1 = strlon[0]+strlon[1]+strlon[2];
    strlo2 = strlon[3]+strlon[4];
	console.log(strlo1+"@"+strlo2);
    //alert(parseInt(strlo1,10));
    //alert(parseFloat(strlo2)/60);
    strlo = parseInt(strlo1,10)+(parseFloat(strlo2)/60);

    console.log(strla.toFixed(7) +','+ strlo.toFixed(7) );
    //console.log(strla.toPrecision(5) +','+ strlo.toPrecision(5) );

    return (strla +'@'+ strlo);*/
	 var strlat = ""+lat;
    var strlon = ""+lon;
    var latsign = 1;
    var lonsign = 1;

    strlat1 = strlat[0]+strlat[1];
    strlat2 = strlat[2]+strlat[3];
    strlat3 = strlat[5]+strlat[6];


	if(strlat1 < 0)  { latsign = -1; }
    strlat1 = Math.abs( Math.round(strlat1 * 1000000.));

	strlat2 = Math.abs(Math.round(strlat2 * 1000000.)/1000000);  //integer
    strlat2 = Math.abs(Math.round(strlat2 * 1000000.));  //integer

    strlat3 = Math.abs(Math.round(strlat3 * 1000000.)/1000000);
    strlat3 = Math.abs(Math.round(strlat3 * 1000000.));

    strlo1 = strlon[0]+strlon[1]+strlon[2];
    strlo2 = strlon[3]+strlon[4];
    strlo3 = strlon[6]+strlon[7];


	if(strlo1 < 0)  { lonsign = -1; }
    strlo1 = Math.abs( Math.round(strlo1 * 1000000.));

	strlo2 = Math.abs(Math.round(strlo2 * 1000000.)/1000000);  //integer
    strlo2 = Math.abs(Math.round(strlo2 * 1000000));  //integer

	strlo3 = Math.abs(Math.round(strlo3 * 1000000.)/1000000);
    strlo3 = Math.abs(Math.round(strlo3 * 1000000.));


	strla = Math.round(strlat1 + (strlat2/60.) + (strlat3/3600.) ) * latsign/1000000;
    strlo = Math.round(strlo1 + (strlo2/60) + (strlo3/3600) ) * lonsign/1000000;

	console.log(strla +'@'+ strlo);
	return (strla +'@'+ strlo);
}
Array.prototype.inArray = function (value,caseSensitive)
// Returns true if the passed value is found in the
// array. Returns false if it is not.
{
    var i;
    for (i=0; i < this.length; i++) {
        // use === to check for Matches. ie., identical (===),
        if(caseSensitive){	//performs match even the string is case sensitive
            if (this[i].toLowerCase() == value.toLowerCase()) {
                return true;
            }
        }else{
            if (this[i] == value) {
                return true;
            }
        }
    }
    return false;
};