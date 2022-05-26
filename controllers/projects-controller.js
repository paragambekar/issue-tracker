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
 
        let project = await Project.findById(request.params.projectId);
        if(project){

            let issue =await Issue.create({
                title: request.body.title,
                description: request.body.description,
                labels: request.body.labels,
                author: request.body.author,
                project : request.body.project,
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
    let project = await Project.findById(request.body.id).populate();
    console.log("Project**************", project);

    let product = await Issue.find({project : request.body.id}).populate();
    let count = 0;
    // for(const i in product){
    //     console.log(`Product ${++count}`, i);
    // }

    let issueList = [];
    let labelList = [];
    for(let i = 0; i < product.length; i++){
        console.log(`Product ${i} `,product[i]);
        // filter by author 
        if(request.body.author != ''){
            if(product[i].author === request.body.author){
                issueList.push(product[i]._id);   
            }
        }

        if(request.body.labels){
            let labelArray = [];
            labelArray.push(request.body.labels);
            console.log('Labels Arrays',labelArray);

            // for(let i = 0; i <product.length; i++){
                let currLabelsArray = product[i].labels;
                console.log(`Product ${i} Label Array`,currLabelsArray);

                if(labelArray.length == 1){
                    console.log('labelArray[0[', labelArray[0]);
                }
                for(let oneLabel of labelArray){
                    // console.log('labelArray[0]',labelArray[0]);
                    // console.log('single label', oneLabel);
                    if(currLabelsArray.includes(oneLabel)){
                        console.log('Includes');
                        if(!issueList.includes(product[i]._id)){
                            issueList.push(product[i]._id); 
                        }
                        
                    }

                }

            // }


        }

        // console.log('labels List****', labelList);

    

    }

    let issueArray = [];
    for(let i of issueList){
        console.log('Issue to populate',i);
        let iss = await Issue.findById(i).populate();
        console.log('issssssssssss', iss);
        issueArray.push(iss);
    }

    console.log('Issue List',issueList);
    console.log('issueArray*******-**-*-',issueArray);
    return response.render('_filters',{
        project : project,
        issueArray : issueArray,

    });

}