const Project = require('../models/project');
const Issue = require('../models/issue');
const req = require('express/lib/request');
const { findById } = require('../models/project');

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

            console.log("Issue**************", issue);
            project.issues.push(issue);
            project.save();

            if(request.xhr){
                return response.status(200).json({
                    data : {
                        project : project,
                        issue : issue, 
                    },
                    message : "Issue created by ajax",
                });
            }
            
         
            // console.log('Project*********', project);
            return response.render('_project',{
                projects : project,
            });
    
        }

    }catch(error){
        console.log('Error in creating issue', error);
        return;
    }

    

} 

module.exports.search= async function(request, response){

    console.log('Request Body', request.body);
    let project = await Project.findById(request.body.id).populate();
    // console.log("Project**************", project);

    let product = await Issue.find({project : request.body.id}).populate();
    // let labelArray = [];

    console.log('request.body.labels++++',request.body.labels);
    
    let issueList = [];
    for(let i = 0; i < product.length; i++){
        // console.log(`Product ${i} `,product[i]);
        // filter by author 
        if(request.body.author != ''){
            if(product[i].author === request.body.author){
                issueList.push(product[i]._id);   
            }
        }

        if(request.body.labels){
            let labelArray = [];
            console.log(typeof(request.body.labels));
            if(typeof(request.body.labels) == 'string'){
                console.log('Labes are string type here**********');
                let label = request.body.labels;
                labelArray.push(label);
            }else{
                for(let label of request.body.labels){
                    labelArray.push(label);
                }
            }

            console.log('Labels Arrays*******',labelArray);

            // for(let i = 0; i <product.length; i++){
                let currLabelsArray = product[i].labels;
                console.log(`Product ${i} Label Array`,currLabelsArray);


                let result = labelArray.every(label => currLabelsArray.includes(label));
                if(result){
                    if(!issueList.includes(product[i]._id)){
                        issueList.push(product[i]._id); 
                    }
                }
        }

        if(request.body.title){
            const reqTitle = request.body.title;
            const regEx = new RegExp(`${reqTitle}`,'gi');
            // console.log('RegEx************',regEx);
            if(product[i].title.match(regEx) || product[i].description.match(regEx)){
                // console.log('Title Matched**********');
                if(!issueList.includes(product[i]._id)){
                    issueList.push(product[i]._id); 
                }
            }
        }
        

    }

    if(issueList.length == 0){

        console.log('product',product);

        for(issue of product){
            issueList.push(issue._id);
        }

    }

    let issueArray = [];
    for(let i of issueList){
        // console.log('Issue to populate',i);
        let iss = await Issue.findById(i).populate();
        // console.log('issssssssssss', iss);
        issueArray.push(iss);
    }

    


    console.log('Issue issueArray************',issueArray);
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
 

   
    // console.log('issueArray*******-**-*-',issueArray);
    return response.render('_filters',{
        project : project,
        issueArray : issueArray,

    });

}