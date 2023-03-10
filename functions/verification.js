
    function CheckLogin(user, typedUserName, res){

        user.findOne({_id: typedUserName}, function(err){
          if(!err){
            console.log("OK, You've logged in");
            res.redirect('panel');
          }
          else{
            console.log("Wrong username");
            res.redirect('login-page');
          }
        });
    };

module.exports = {CheckLogin};