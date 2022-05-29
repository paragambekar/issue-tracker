const Project = require('../models/project');
const Issue = require('../models/issue');
const req = require('express/lib/request');
const { findById } = require('../models/project');

// Create new Project 
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

// Show project with its issues 
module.exports.project = async function(request, response){
    try{
        let project = await Project.findById(request.params.projectId).populate({
            path: 'issues',
          });
        return response.render('_project',{
            projects : project,
        });

    }catch(error){
        console.log('Error in finding project', error);
        return;
    }

}

// Create issue for a project 
module.exports.createIssue = async  function(request,response){
    
    try{
        let project = await Project.findById(request.params.projectId).populate({
            path : 'issues',
        });
        if(project){
            let issue =await Issue.create({
                title: request.body.title,
                description: request.body.description,
                labels: request.body.labels,
                author: request.body.author,
                project : request.body.project,
            }); 
            project.issues.push(issue);
            project.save();

            // to handle ajax requests 
            if(request.xhr){
                return response.status(200).json({
                    data : {
                        project : project,
                        issue : issue, 
                    },
                    message : "Issue created by ajax",
                });
            }
            return response.render('_project',{
                projects : project,
            });
        }

    }catch(error){
        console.log('Error in creating issue', error);
        return;
    }
} 

// Search issues according to filters 
module.exports.search= async function(request, response){

    let project = await Project.findById(request.body.id).populate();

    let product = await Issue.find({project : request.body.id}).populate();
    
    let issueList = [];
    for(let i = 0; i < product.length; i++){

        // filter by author 
        if(request.body.author != ''){
            if(product[i].author === request.body.author){
                issueList.push(product[i]._id);   
            }
        }

        // filter by labels 
        if(request.body.labels){
            let labelArray = [];
            if(typeof(request.body.labels) == 'string'){
                let label = request.body.labels;
                labelArray.push(label);
            }else{
                for(let label of request.body.labels){
                    labelArray.push(label);
                }
            }
            let currLabelsArray = product[i].labels;

            let result = labelArray.every(label => currLabelsArray.includes(label));
            if(result){
                if(!issueList.includes(product[i]._id)){
                    issueList.push(product[i]._id); 
                }
            }
        }


        if(request.body.title || request.body.description){
            const reqTitle = request.body.title;
            const regEx = new RegExp(`${reqTitle}`,'gi');
            if(product[i].title.match(regEx) || product[i].description.match(regEx)){
                if(!issueList.includes(product[i]._id)){
                    issueList.push(product[i]._id); 
                }
            }
        }
        

    }

    if(issueList.length == 0){
        for(issue of product){
            issueList.push(issue._id);
        }
    }

    let issueArray = [];
    for(let i of issueList){
        let iss = await Issue.findById(i).populate();
        issueArray.push(iss);
    }

    // handle ajax requests 
    if(request.xhr){
        return response.status(200).json({
            data : {
                project : project,
                issueArray : issueArray, 
                issueList : issueList,
            },
            message : "Issue created by ajax",
        });
    }

    return response.render('_filters',{
        project : project,
        issueArray : issueArray,
    });
}