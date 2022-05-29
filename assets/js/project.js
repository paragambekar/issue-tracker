
    {
        console.log('Inside ajax file');

        let createProject = function(){

            let newIssueForm = $('#new-issue-form');
            let projectId = $('#new-issue-form input[type="hidden"]').val();
            console.log('projectId*****', projectId);
            let url = $('#new-issue-form').attr('action');
            console.log('Url found*******', url);           
            // console.log('Trying to prevent submit********');
            newIssueForm.submit(function(e){ 
                // console.log('Trying to prevent submit');
                e.preventDefault();
                // console.log('newIssueForm',newIssueForm);
                // console.log('Project id',`${project._id}`);
                // let data = newIssueForm.serialize();
                // console.log('Data*********',data);

                $.ajax({
                    
                    type : 'post',
                    data : newIssueForm.serialize(), 
                    url : url,
                    success : function(data){
                        console.log('Data serialzed',data);
                        
                        let newIssue = newIssueDom(data.data.issue);

                        

                        $('#issues-list').prepend(newIssue);

                        // console.log('New Issue',newIssue);
                        // $('#issues-list').prepend(newIssue);
                    }, error : function(error){
                        console.log('Error in creating issue through ajax', error.responseText);

                    }

                });
            });

        }

        let newIssueDom = function(issue){

            console.log('issueDom',issue);

            for(let i = 0;i < issue.labels.length; i++){
                console.log(i);
            }

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

        createProject();
        
        let filterForm = $('#filter-form');
        filterForm.submit(function(e){

            e.preventDefault();
            console.log('prevent default');

            $.ajax({
                type : 'post',
                data : filterForm.serialize(),
                url : '/projects/filter',
                success : function(data){
                    console.log(data);
                    // in data we have passed project and issueArray
                    // for(let i = 0; i < data.data.project.issues.length; i++){
                    //     let issDiv = $('#issues-list .issue-item');
                        
                    // }
                    
                    // for(let issue of data.data.issueArray){
                    //     if(!data.data.project.issues.includes(issue)){
                    //         let hideDiv = $('#issue-list .issue-item[id=issue]');
                    //         hideDiv.hide();
                            
                    //     }
                    // }

                    console.log('data.data.project.issues',data.data.project.issues)
                    console.log('data.data.issueList',data.data.issueList);

                    // if(!data.data.issueList){
                    //     for(let issue in data.data.project.issues){
                    //         $('#issues-list').find('.issue-item').css("background-color", "yellow");
                    //     }
                    // }

                    for(let issue = 0; issue < data.data.project.issues.length; issue++){

                        
                        let issueId = data.data.project.issues[issue];
                        console.log('issue', issue);
                        console.log('issueId',issueId);
                        // ('#issues-list .issue-item')
                        if(data.data.issueList.includes(issueId)){
                            let hideDiv = $("#"+ issueId);
                            hideDiv.css("background-color", "yellow");
                        }else{
                            let hideDiv = $("#"+ issueId);
                            hideDiv.css("background-color", "pink");
                        }
                    }

                } 
            });
        }) ;
    }
