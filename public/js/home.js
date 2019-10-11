
console.log("home.js is loaded!");


const closeCommentsbtn = document.getElementById("closeCommentsButton");
const saveCommentsbtn = document.getElementById("saveCommentsButton");
const commentsmodal = document.getElementById("comments-modal");
const commentModalLabel = document.getElementById("commentModalLabel");
const commentsText = document.getElementById("commentsText");
const commentsBody = document.getElementById("commentsBody");




const saveComments = function(event) {
    event.preventDefault();
    
    console.log("saveComments executed!");
    const dataId = event.target.getAttribute("data-value");

    saveCommentsbtn.setAttribute("data-value", dataId);
    commentModalLabel.innerHTML = `Comments for Id: ${dataId}`;


    console.log(`fetching post... /comments/ ${dataId}`);
    fetch(`/comments/${dataId}`, {
        method: "POST",
        body: commentsText.value.trim()
    })
    .then((res) => res.json())
    .then((res) => {

        //console.log(`post completed with value: ${JSON.stringify(res, 2, null)}`);
    });

    if (commentsmodal) commentsmodal.style.display = "None";
};

document.querySelectorAll(".commentBtn").forEach((button) => {

    button.addEventListener("click", (event) => {

        const dataId = event.target.getAttribute("data-value");
        console.log("add executed for dataid " + dataId);
        
    
        commentsText.value = "";
        commentsBody.innerHTML = "";
        commentModalLabel.innerHTML = "";
    
        saveCommentsbtn.setAttribute("data-value", dataId);
        commentModalLabel.innerHTML = `Comments for Id: ${dataId}`;
    
        console.log(`fetching get... /comments/ ${dataId}`);
        fetch(`/comments/${dataId}`)
        .then((res) => res.json())
        .then((res) => {
            
            res.comments.forEach(element => {
                //console.log(element);
                const btn = `<a href=/deleteComment/${element._id}><button type="button" method="delete" class="btn btn-danger">Delete</button></a>`;            
    
                commentsBody.innerHTML += ` <li id="listItem"> ${element._id}         ${btn}</li>`;
            });    
    
        });
    
        if (commentsmodal) commentsmodal.style.display = "Block";
    });
});

const addComments = function(event) {
   
};

const closeCommentsModal = function(event) {
    event.preventDefault();    
    if (commentsmodal) commentsmodal.style.display = "None";
};


if (saveCommentsbtn) saveCommentsbtn.addEventListener("click", saveComments);
if (closeCommentsbtn) closeCommentsbtn.addEventListener("click", closeCommentsModal);

