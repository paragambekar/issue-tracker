const Project = require('../models/project');

module.exports.home = async function(request,response){
    const projects = await Project.find({});
    return response.render('home',{
        title : 'Issue Tracker',
        projects : projects,
    });
}