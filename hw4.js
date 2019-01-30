var request = require('request');
var fs = require("fs");
var Promise = require('bluebird');
var parse = require('parse-link-header');

var userId = "drupadhy";
var token = "token " + "d6d776d11c050fa6a18a76c15dc765eaece7fae8";
var urlRoot = "https://github.ncsu.edu/api/v3"	// Github NCSU

var glo_repoName = "My_Repository";
var glo_repoDesc = "Implemented using javascript";
var bugTitle = "This is the bug title";
var description_edit = "This repo is edited";
var issueNumber = "1";
var assignee_name = "ajain32"

//get_repo(userId);

//create_repo(userId, glo_repoName,glo_repoDesc);

//create_issue(userId, glo_repoName, bugTitle);

//edit_repo(userId, glo_repoName, description_edit)

//list_reactions(userId, glo_repoName, issueNumber)

add_assignee(userId, glo_repoName, assignee_name)

//Code to get the repository name in order to list its branches
function get_repo(userName)
{

	var options = {
		url: urlRoot + '/users/' + userName + '/repos',
		method: 'GET',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": token
		}
	};

	request(options, function (error, response, body)
	{
		var obj = JSON.parse(body);
		for( var i = 0; i < obj.length; i++ )
		{
			var name = obj[i].name;
			console.log("Repo Name: " + name );
			list_branches(userId,name);
		}
	});

}

//Code to get the list of all the branches of a particular repository
function list_branches(owner,repo)
{
	var options = {
		url: urlRoot + "/repos/" + owner + "/" + repo + "/branches",
		method: 'GET',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": token
		}
	};

	request(options, function (error, response, body)
	{
		var obj = JSON.parse(body);
		for( var i = 0; i < obj.length; i++ )
		{
			var name = obj[i].name;
			console.log("Branch Name: " + name );
		}
	});
}

//Code to create a new repository
function create_repo(owner,repoName,repoDesc)
{
	var options = {
		url: urlRoot + '/user/repos',
		method: 'POST',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": token
		},
		json: {
			"name": repoName,
			"description": repoDesc,
			"has_issues": true,
			"private": false,
			"has_downloads": true,
			"auto_init": true
		}
	};

	request(options, function (error, response, body)
	{
		if(!error && response.statusCode == 201)
		{
			console.log("Repository Created succesfully!!");
		}else{
			
			console.log("Repository Creation failed!");
		}
	})

}

//Code to create an issue to the existing repository
function create_issue(owner, repoName, bugTitle)
{
	var options = {
			url: urlRoot + '/repos/' + owner + '/' + repoName + '/issues', 
			method: 'POST',
			headers: {
				"User-Agent": "EnableIssues",
				"content-type": "application/json",
				"Authorization": token
			},
			json: {
				"title": bugTitle,
				"body": "This is a bug"	,
				"assignee": owner, 
				"pull_request" : true,
			}
		};

		request(options, function (error, response, body)
		{
			if(!error && response.statusCode == 201)
			{
				console.log("Issue succesfully created");
			}else{
				console.log("Issue creation failed: "+response.statusCode);

			}
		})
}

//Code to add an assignee name to an issue
function add_assignee(owner, repoName, assignee_name)
{
	var options = {
			url: urlRoot + '/repos/' + owner + '/' + repoName + '/issues/' + issueNumber,
			method: 'POST',
			headers: {
				"User-Agent": "EnableIssues",
				"content-type": "application/json",
				"Authorization": token,
			},
			json: {
				//"name" : "assignee",
				"assignee" : assignee_name,
									
			}
		};
		
		request(options, function (error, response, body)
		{
			console.log(body);
		});
}		



//Code to edit a particular requirement in the repository
function edit_repo(owner, repo, description_edit)
{ 
        
        var options = {
                url: urlRoot + "/repos/" + owner + "/" + repo,
                method: 'PATCH',
                headers: {
                        "User-Agent": "EnableIssues",
                        "content-type": "application/json",
                        "Authorization": token
                },
            json: {
                "name":repo,
                "description":description_edit,
                "private": false, 
				"has_issues": false
				}
        };

        request(options, function (error, response, body)
        {
            console.log( body );
        });
}

//Code to list the reactions of an existing issue
function list_reactions(owner, repo, issueNumber)
{ 
        var options = {
                url: urlRoot + "/repos/" + owner + "/" + repo + "/issues/" + issueNumber + "/reactions",
                method: 'GET',
                headers: {
                        "User-Agent": "EnableIssues",
                        "content-type": "application/json",
                        "Authorization": token,
                        "Accept": "application/vnd.github.squirrel-girl-preview"
                }
        };

        request(options, function (error, response, body) 
		{
			var obj = JSON.parse(body);
			console.log( obj );
		});
}