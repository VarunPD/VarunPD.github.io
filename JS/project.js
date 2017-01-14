
var authobj = {
    email: "pdevdec@gmail.com",
    rollNo: "16EE30022"
};

var sessId;

$.post("http://www.eduspectrum.com/api/authenticate.php", authobj, function (data) {
    data = JSON.parse(data);
    sessId = data.sessionId;
    console.log("sessionId is " + sessId);
});

function addnote()
{
    window.location.href = "./add.html";
}

//Get all notes
var notesHtml = document.getElementById("allnotes");
var allPosts;
setTimeout(getNotes, 960);  //waits for 960ms so that sessionId can be received into sessId
function getNotes()
{
    var obj = {
        sessionId: sessId,
        rollNo: '16EE30022'
    };
    $.post("http://www.eduspectrum.com/api/getAll.php", obj, function (data) {
        var posts = JSON.parse(data);
        allPosts = posts;
        for (var i = 0; i < posts.length; i++) {
            console.log(posts[i].title);
            console.log(posts[i].description);
            console.log(posts[i].createdAt);
        }
    });
    setTimeout(showAllNotes,1300);  //waits for 1300ms so that $.post request is completed and allPosts has all the notes
}

function showAllNotes()
{
    var i,date;
    for(i=0;i<allPosts.length;i++)
    {
        date = new Date(allPosts[i].createdAt*1000);
        notesHtml.innerHTML += `<tr id="sl${i}" onclick="showNote(${i});">
            <td>${i+1}</td>
        <td>${allPosts[i].title}</td>
        <td>${date}</td>
        </tr>`;
    }
}

function hideNote()
{
    $("#deletealert").hide(300);
    $("#noteeditform").hide(300);
    $("#onenotedivbtns").show(300);
    $("#onenotediv").hide(500);
            
}
 
function showNote(i)
{
    document.getElementById("notetitlediv").innerHTML = `<h3 id="notetitleh3">${allPosts[i].title}</h3>`;
    document.getElementById("notedescrdiv").innerHTML = `<p id="notedescrpara" style="font-size: 15px;">${allPosts[i].description}</p>`;         
    document.getElementById("notetimediv").innerHTML = allPosts[i].createdAt;
    $("#onenotediv").show(500);
}

function deleteNote()
{
    $("#deletealert").show(300);

    $("#del-yes").click(function(){
        var post={
            sessionId: sessId,
            rollNo: '16EE30022',
            createdAt: document.getElementById("notetimediv").innerHTML
        };
        $.post( "http://www.eduspectrum.com/api/delete.php", post, function(data) {
            console.log(data);
        });
        window.location.href="./index.html";
    });

    $("#del-no").click(function(){
        $("#deletealert").hide(300);
    })
}

function editNote()
{
    document.getElementById("noteeditform").innerHTML = `
        <form>
        <div class="form-group">
        <label for="notetitleform"><b>Title</b></label>
        <input type="text" class="form-control" id="notetitleform" value="${document.getElementById('notetitleh3').innerHTML}">
            </div>
            <div class="form-group">
            <label for="notedescrform"><b>Description</b></label>
            <textarea class="form-control" id="notedescrform" >${document.getElementById('notedescrpara').innerHTML}</textarea>
            </div>
            <br>
            <div class="container">
            <button type="button" class="btn btn-info" onclick="sendEditedNote();">Save changes</button>
            &nbsp;
<button type="button" class="btn btn-warning" onclick="hideNote();">Cancel</button>
</div>
<br>
</form>
<br>
<p id="editalert" style="display:none;">Changes have been saved. Reloading main page...</p>
<br>`;
            
$("#onenotedivbtns").hide(300);
$("#noteeditform").show(300);
}

function sendEditedNote()
{
    var editedNote={
        sessionId: sessId,
        rollNo: '16EE30022',
        title: document.getElementById("notetitleform").value,
        description: document.getElementById("notedescrform").value
    };
    $.post("http://www.eduspectrum.com/api/create.php", editedNote, function (data) {
        var postData = JSON.parse(data);
        console.log(postData);
    });

    var oldNote={
        sessionId: sessId,
        rollNo: '16EE30022',
        createdAt: document.getElementById("notetimediv").innerHTML
    };
    $.post( "http://www.eduspectrum.com/api/delete.php", oldNote, function(data) {
        console.log(data);
    });

    $("#editalert").show(100);
    setTimeout(function(){
        window.location.href="./index.html";
    },2000);
}

function sortNotesNew()
{
    var i,date;
                
    if(document.getElementById("sortbtn").innerHTML=='Sort newest to oldest')
    {
        notesHtml.innerHTML = `<caption style="color: black;">
    <h3 style="display: inline;">My Notes</h3>
    <button type="button" class="btn btn-info pull-right" id="sortbtn" onclick="sortNotesNew()">Sort oldest to newest</button>
</caption>    
<tr id="firstrow">
        <th>Sl no</th>
        <th>Title</th>
        <th>Last modified</th>
    </tr>`;
        for(i=allPosts.length-1;i>=0;i--)
        {
            date = new Date(allPosts[i].createdAt*1000);
            notesHtml.innerHTML += `<tr id="sl${i}" onclick="showNote(${i});">
        <td>${i+1}</td>
    <td>${allPosts[i].title}</td>
    <td>${date}</td>
    </tr>`;
        }
    }

    else
    {
        notesHtml.innerHTML = `<caption style="color: black;">
    <h3 style="display: inline;">My Notes</h3>
    <button type="button" class="btn btn-info pull-right" id="sortbtn" onclick="sortNotesNew()">Sort newest to oldest</button>
</caption>    
<tr id="firstrow">
        <th>Sl no</th>
        <th>Title</th>
        <th>Last modified</th>
    </tr>`;
        for(i=0;i<allPosts.length;i++)
        {
            date = new Date(allPosts[i].createdAt*1000);
            notesHtml.innerHTML += `<tr id="sl${i}" onclick="showNote(${i});">
                <td>${i+1}</td>
            <td>${allPosts[i].title}</td>
            <td>${date}</td>
            </tr>`;
        }
    }

}