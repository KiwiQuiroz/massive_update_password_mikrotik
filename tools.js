var MikroNode = require('mikronode-ng');
var async = require('async');
var q = require('q');
module.exports = {
  updateMasterPassword: function(mikrotikIP, masterUsername, masterPassword, username, newPassword){
    console.log('updateMasterPassword');
    var connection = MikroNode.getConnection( mikrotikIP, masterUsername, masterPassword, {
        closeOnDone : false
    });

    connection.getConnectPromise()
    .then(function(conn) {
      return connection.getCommandPromise("/user/getall");
    }).then(function resolved(users) {
        var deferred = q.defer();
        var id = false;
        if(users && users.length>0){
          async.eachSeries(users, function(user, next){
            if(user.name == username){
              id = user[".id"];
            }
            next();
          },function(){
            deferred.resolve(id);
          });
        }else{
          console.log('Not users found');
        }
      return deferred.promise;
    }).then(function(userId){
      if(userId){
        return connection.getCommandPromise("/user/set",{"=.id":userId,"=password": newPassword});
      }else{
        console.log("Not user named '"+username+"' found");
      }
    }).then(function(res){
      if(res){
        console.log("Password updated for user '"+username+"' ...");
      }
      connection.close();

    },function(err){
      if(err)
        console.log('Oops: ' + JSON.stringify(err));
      else
        console.log('Not error provided...')
      connection.close();
    });
  }
};