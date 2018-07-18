var tools = require("./tools");
var colors = require("colors");
var async = require('async');
var moment = require('moment');
var json2xls = require('json2xls');
var fs = require('fs');


const masterUsername = 'admin'; //User to connect mikrotik router
const masterPassword = 'yourPassword'; // Password to connect mikrotik router
const username       = 'admin'; //Username will be updated
const newPassword    = 'yourPassword'; //Password to update


var file = "./files_demo/routers.json"
var routerList = JSON.parse(fs.readFileSync( file, 'utf8'));

var timestamp = moment().format();
console.log(("Proccessing routers").magenta);
console.log(("                   ").cyan);

var counter =1;
var start = 3;
var limit = 6;


async.eachSeries(routerList, function(router, next){
  if(counter >= start && counter <= limit){
    var message = false;
    console.log(("#"+counter+" - Attempting to connect: "+router.publicIP+"...").magenta);
    counter++;
    tools.updateMasterPassword(router.publicIP, masterUsername, masterPassword, username, newPassword).then(function(res){
      router.updated = true;
      if(res && res.message){
        message = res.message;
      }else{
        message = res;
      }
    },function(errors){
      router.updated = false;
      if(errors){
        message = JSON.stringify(errors);
        if(errors.errors && errors.errors[0] && errors.errors[0].message){
          message = "Error in router "+router.publicIP+": "+errors.errors[0].message;
        }else if(errors.error){
          message = "Error in router "+router.publicIP+": "+errors.error;
        }else if(errors.code){
          message = "Error in router "+router.publicIP+": "+errors.code;
        }else{
          message = "Error in router "+router.publicIP+": "+errors;
        }
      }
    }).done(function(){
      router.message = message;
      if(router.updated)
        console.log(message.bgGreen);
      else
        console.log(message.bgRed);
      console.log(("                 ").cyan);
      next();
    });
  }else{
    counter++;
    next();
  }
},function(){
  var xls = json2xls(routerList);
  fs.writeFileSync("./reports/"+timestamp+'.xlsx', xls, 'binary');
  console.log("All Routers done".magenta);
});

  