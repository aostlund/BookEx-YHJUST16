$(function() {
    bindEventListeners();
});

const bindEventListeners = function() {
    document.getElementById('about').addEventListener('click', openAbout);
}

const openAbout = function(event) {
    event.preventDefault();
    if (document.getElementsByClassName('about').length !== 0) {
        document.body.removeChild(document.getElementsByClassName('about')[0]);
    } else  {
        let about = document.createElement('div');
        about.setAttribute('class', 'about');
        document.body.appendChild(about);
    }
}