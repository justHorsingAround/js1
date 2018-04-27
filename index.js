const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
let postsCommEl;
let loadButtonEl;
let loadAlbums;


function mouseAction(strongEl, callback) {
    strongEl.addEventListener("click", callback);
    strongEl.addEventListener("mouseover", function(){strongEl.style.backgroundColor="red"}, false);
    strongEl.addEventListener("mouseout", function(){strongEl.style.backgroundColor="white"}, false);
}


function getComments(strongEl, post){
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(evt) { parseComments(evt, strongEl, post) });
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/comments');
    xhr.send();
}

function parseComments(evt, strongEl, post){
    postsCommEl.style.display = 'block';

    const text = evt.target.responseText;
    console.log(evt.target);
    const comm = JSON.parse(text);
    const commEl = document.getElementById('comments');

    while (commEl.firstChild) {
        commEl.removeChild(commEl.firstChild);
    }
    
    commEl.appendChild(createCommentList(comm, post));
    strongEl.parentElement.appendChild(commEl);

}

function createCommentList(comment, post) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < comment.length; i++) {
        const com = comment[i];
        
        const pEl = document.createElement('p');
        if(com.postId == post.id) {        
            pEl.appendChild(document.createTextNode(`comment: ${com.body}`));
            
            const liEl = document.createElement('li');
            liEl.appendChild(pEl);
        

        ulEl.appendChild(liEl);
        }
    }
    return ulEl;
}


function createPostsList(posts) {
    const ulEl = document.createElement('ul');
    //u1El.class = "posts-list-inner";

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        // creating paragraph
        const strongEl = document.createElement('strong');        
        strongEl.textContent = post.title;       
        

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);
        pEl.appendChild(document.createTextNode(`: ${post.body}`));
        mouseAction(strongEl, function(){getComments(strongEl, post);});

        // creating list item
        const liEl = document.createElement('li');
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
    }

    return ulEl;
}

function createPictures(albums){
    const ulEl = document.createElement('ul');

    for (let i = 0; i < albums.length; i++) {
        const pic = albums[i];

        const strongEl = document.createElement('strong');        
        strongEl.textContent = pic.title;       
        
        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);
        //mouseAction(strongEl, pic);

        const liEl = document.createElement('li');
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
    }
    return ulEl;
}


function onPostsReceived() {
    postsDivEl.style.display = 'block';

    const text = this.responseText;
    const posts = JSON.parse(text);

    const divEl = document.getElementById('posts-content');
    const postEl = document.getElementById('posts-list');
    const comEl = document.getElementById('comments');

    divEl.appendChild(comEl);

    while (postEl.firstChild) {
        postEl.removeChild(postEl.firstChild);
    }
    postEl.appendChild(createPostsList(posts));
}

function onAlbumsRecieved(evt) {
    loadAlbums.style.display = 'block';

    const text = evt.target.responseText;
    const albums = JSON.parse(text);
    const albumEl = document.getElementById('pictures');
    console.log(albums);
    albumEl.appendChild(createPictures(albums));

}

function onLoadPosts() {
    const el = this;
    const userId = el.getAttribute('data-user-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPostsReceived);
    xhr.open('GET', BASE_URL + '/posts?userId=' + userId);
    xhr.send();
}

function onLoadAlbums() {
    const element = this;
    const userId = element.getAttribute('albums');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(evt) { onAlbumsRecieved(evt)});
    xhr.open('GET', "https://jsonplaceholder.typicode.com/albums" + "?userId=" + userId);
    xhr.send();    
}


function createUsersTableHeader() {
    const idTdEl = document.createElement('td');
    idTdEl.textContent = 'Id';

    const nameTdEl = document.createElement('td');
    nameTdEl.textContent = 'Name';

    const trEl = document.createElement('tr');
    trEl.appendChild(idTdEl);
    trEl.appendChild(nameTdEl);

    const theadEl = document.createElement('thead');
    theadEl.appendChild(trEl);
    return theadEl;
}

function createUsersTableBody(users) {
    const tbodyEl = document.createElement('tbody');    

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // creating id cell
        const idTdEl = document.createElement('td');
        idTdEl.textContent = user.id;

        // creating name cell
        const dataUserIdAttr = document.createAttribute('data-user-id');
        dataUserIdAttr.value = user.id;

        const buttonEl = document.createElement('button');
        buttonEl.textContent = user.name;
        buttonEl.setAttributeNode(dataUserIdAttr);
        buttonEl.addEventListener('click', onLoadPosts);

        
        //creating buttons for albums
        const albums = document.createAttribute('albums');
        albums.value = user.id;

        const buttonAlb = document.createElement('button');
        buttonAlb.textContent = user.name + "`s Albums";
        buttonAlb.setAttributeNode(albums);
        buttonAlb.addEventListener('click', onLoadAlbums);
        
        //adding buttons to names
        const nameTdEl = document.createElement('td');
        nameTdEl.appendChild(buttonEl);

        //adding buttons to albums
        const albumTdEl = document.createElement('td');
        albumTdEl.appendChild(buttonAlb);

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);
        trEl.appendChild(albumTdEl);

        tbodyEl.appendChild(trEl);
    }

    return tbodyEl;
}

function createUsersTable(users) {
    const tableEl = document.createElement('table');
    tableEl.appendChild(createUsersTableHeader());
    tableEl.appendChild(createUsersTableBody(users));
    return tableEl;
}

function onUsersReceived() {
    loadButtonEl.remove();

    const text = this.responseText;
    const users = JSON.parse(text);

    const divEl = document.getElementById('users-content');
    divEl.appendChild(createUsersTable(users));
}

function onLoadUsers() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUsersReceived);
    xhr.open('GET', BASE_URL + '/users');
    xhr.send();
}


document.addEventListener('DOMContentLoaded', (event) => {
    usersDivEl = document.getElementById('users');
    postsDivEl = document.getElementById('posts');
    postsCommEl = document.getElementById('comments');
    loadAlbums = document.getElementById('pictures');
    loadButtonEl = document.getElementById('load-users');
    loadButtonEl.addEventListener('click', onLoadUsers);
    
});