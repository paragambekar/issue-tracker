const User = require('../models/user');
const fs = require('fs');

module.exports.signUp = function(request,response){
    
    // if user already signed in redirect to profile page 
    if(request.isAuthenticated()){
        return response.redirect('/');
    }

    return response.render('user_sign_up',{
        title : 'Issue Tracker | Sign Up',
        // profile_user : user,
    });
}


module.exports.signIn = function(request,response){

    if(request.isAuthenticated()){
        return response.redirect('/');
    }

    return response.render('user_sign_in',{
        title : 'Issue Tracker | Sign In',
        // profile_user : user,
    });
}

// get the sign up data 
module.exports.create = function(request,response){

    if(request.body.password != request.body.confirm_password){
        return response.redirect('back');
    } 

    User.findOne({email : request.body.email}, function(error,user){
        if(error){
            console.log('Error in finding user while signing up');
            return;
        }

        // if user not found, create one 
        if(!user){
            User.create(request.body, function(error, user){

                if(error){
                    console.log('Error in creating while signing user');
                    return;
                }
                return response.redirect('/users/sign-in');

            });
        }else{
            return response.redirect('/users/sign-in');
        }
    })


}

// Sign in and create a session 
module.exports.createSession = function(request,response){
    return response.redirect('/');
}


module.exports.destroySession = function(request,response){
    // passport js gives this method to logout user 
    request.logout(function(error){
        if(error){
            console.log('Error in logging out',error);
        }
        response.redirect('/');
    })
}