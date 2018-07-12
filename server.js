var tools = require("./tools");


var mikrotikIP = "0.0.0.0"; //Your Mikrotik Router IP
var masterUsername = 'admin'; //User to connect mikrotik router
var masterPassword = 'yourPassword'; // Password to connect mikrotik router
var username = 'admin'; //Username will be updated
var newPassword = 'newPassword'; //Password to update

//Yes, masterUsername and username can be the same.
tools.updateMasterPassword(mikrotikIP, masterUsername, masterPassword, username, newPassword).then(function(res){
  if(res && res.message){
    console.log(res.message)
  }else{
    consoel.log(res);
  }
},function(err){
  console.log('Oops: ' + JSON.stringify(err));
});

