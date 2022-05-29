
{
    let createProject = function(){

        // Create new issue using ajax 
        let newIssueForm = $('#new-issue-form');
        let projectId = $('#new-issue-form input[type="hidden"]').val();
        let url = $('#new-issue-form').attr('action');       
        newIssueForm.submit(function(e){ 
            e.preventDefault();

            $.ajax({
                type : 'post',
                data : newIssueForm.serialize(), 
                url : url,
                success : function(data){
                    console.log('Data serialzed',data);
                    let newIssue = newIssueDom(data.data.issue);
                    $('#issues-list').append(newIssue);
                    newIssueForm.trigger('reset');
                    $('div').removeClass("select_item_selected");
                }, error : function(error){
                    console.log('Error in creating issue through ajax', error.responseText);
                }
            });
        });

    }

    // Inserting new issue in the DOM 
    let newIssueDom = function(issue){

        let labelDiv = $('<div>',{
            class : "labels"
        });
        for(let i = 0;i < issue.labels.length; i++){
            let currLabel = issue.labels[i];
            let singleLabel = $("<div>",{
                class : "label-item"
            }).html(currLabel);

            $(labelDiv).prepend(singleLabel);
        }

        return $(`<div class="issue-item" id="${issue._id}">
        <p><span>Title :</span> ${issue.title}</p>
        <p><span>Description :</span>${issue.description} </p>
        <p><span>Author :</span>${issue.author} </p>               

    </div>`).append(labelDiv);
    }

    
    
    // filter issues using ajaz 
    let filterForm = $('#filter-form');
    filterForm.submit(function(e){

        e.preventDefault();
        console.log('prevent default');

        $.ajax({
            type : 'post',
            data : filterForm.serialize(),
            url : '/projects/filter',
            success : function(data){
            
                for(let issue = 0; issue < data.data.project.issues.length; issue++){
                    let issueId = data.data.project.issues[issue];
                    console.log('issue', issue);
                    console.log('issueId',issueId);
                    if(data.data.issueList.includes(issueId)){
                        let hideDiv = $("#"+ issueId);
                        hideDiv.show();
                    }else{
                        let hideDiv = $("#"+ issueId);
                        hideDiv.hide();
                    }
                }
            } 
        });
    }) ;
    createProject();
}
