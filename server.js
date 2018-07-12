var tools = require("./tools");


var mikrotikIP = "0.0.0.0";
var masterUsername = 'admin'; //User to connect mikrotik router
var masterPassword = 'yourPassword'; // Password to connect mikrotik router
var username = 'admin'; //Username will be updated
var newPassword = 'yourPassword'; //Password to update

//Yes, masterUsername and username can be the same.


tools.updateMasterPassword(mikrotikIP, masterUsername, masterPassword, username, newPassword);

