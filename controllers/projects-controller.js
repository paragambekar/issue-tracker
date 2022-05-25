const Project = require('../models/project');
const Issue = require('../models/issue');
const req = require('express/lib/request');

module.exports.create = async function(request,response){

    try{

        console.log(request.body);
        let project = await Project.create({
            name : request.body.name,
            description : request.body.description,
            author : request.body.author,
        });

        return response.redirect('/');

    }catch(error){
        return response.redirect('/');
    }

}

module.exports.redirects = function(request,response){

    return response.render('newproject');

}

module.exports.project = async function(request, response){
    console.log('Inside Project');
    try{

        let project = await Project.findById(request.params.projectId).populate({
            path: 'issues',
          });

        //   console.log('Project******',project);
        return response.render('_project',{
            projects : project,
        });

    }catch(error){
        console.log('Error in finding project', error);
        return;
    }

}

module.exports.createIssue = async  function(request,response){
    
    try{
 
        let project = await Project.findById(request.params.projectId);
        if(project){

            let issue =await Issue.create({
                title: request.body.title,
                description: request.body.description,
                labels: request.body.labels,
                author: request.body.author,
            });
            // console.log("Issue**************", issue);
            project.issues.push(issue);
            project.save();
         
            // console.log('Project*********', project);
            return response.redirect('back');
    
        }

    }catch(error){
        console.log('Error in creating issue', error);
        return;
    }

    

} 

module.exports.search= async function(request, response){

    console.log('Request Body', request.body);
    console.log('Inside search');
    // console.log( 'Request Params', request.params)

    var ftrauthor = request.body.author;
    var ftrlabel = request.body.labels;

    // var parameter = 

    return response.redirect('back');

}