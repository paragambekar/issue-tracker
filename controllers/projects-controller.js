const Project = require('../models/project');
const Issue = require('../models/issue');

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
    console.log('Inside');
    try{

        let project = await Project.findById(request.params.projectId).populate({
            path: 'issues',
          });

          console.log('Project******',project);
        return response.render('_project',{
            projects : project,
        });

    }catch(error){
 
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

            project.issues.push(issue);
            project.save();
            return response.redirect('back');
        }

    }catch(error){
        console.log('Error in creating issue', error);
    }

    

}