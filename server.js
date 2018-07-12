var tools = require("./tools");
var colors = require("colors");


var mikrotikIP = "0.0.0.0"; //Your Mikrotik Router IP
var masterUsername = 'admin'; //User to connect mikrotik router
var masterPassword = 'yourPassword'; // Password to connect mikrotik router
var username = 'admin'; //Username will be updated
var newPassword = 'newPassword'; //Password to update

//Yes, masterUsername and username can be the same.
var message = false;
tools.updateMasterPassword(mikrotikIP, masterUsername, masterPassword, username, newPassword).then(function(res){
  if(res && res.message){
    message = (res.message).green;
  }else{
    message = (res).blue;
  }
},function(errors){
  if(errors){
    message = JSON.stringify(errors);
    if(errors.errors && errors.errors[0] && errors.errors[0].message){
      message = ("Error in router "+mikrotikIP+": "+errors.errors[0].message).red;
    }else if(errors.error){
      message = "Error in router "+mikrotikIP+": "+(errors.error).red;
    }
  }
}).done(function(){
  console.log(message);
});

