var MikroNode = require('mikronode-ng');
var async = require('async');
var q = require('q');
module.exports = {
  updateMasterPassword: function(mikrotikIP, masterUsername, masterPassword, username, newPassword){
    var deferred = q.defer();
    var message = false;

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
            if(id)
              deferred.resolve(id);
            else
              deferred.reject({error:"Not user named '"+username+"' found"})
          });
        }else{
          deferred.reject({error:"Not user named '"+username+"' found"})
        }
      return deferred.promise;
    }).then(function(userId){
      if(userId){
        return connection.getCommandPromise("/user/set",{"=.id":userId,"=password": newPassword});
      }else{
        message = "Not user named '"+username+"' found";
      }
    }).then(function(res){
      if(res){
        message = "Password updated for user '"+username+"' in router "+mikrotikIP+" ...";
      }
      connection.close();
      deferred.resolve({message:message});
    },function(err){
      if(!err)
        err = ({error:'Not error code provided...'})
      connection.close();
      deferred.reject(err);
    });
    return deferred.promise;
  }

};