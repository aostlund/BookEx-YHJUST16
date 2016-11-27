$(function() {
    bindEventListeners();
});

const bindEventListeners = function() {
    document.getElementById('about').addEventListener('click', openAbout);
}

const openAbout = function(event) {
    event.preventDefault();
    $('#navbar').collapse('hide');
    let content = createAbout();
    if (document.getElementsByClassName('about').length !== 0) {
        document.body.removeChild(document.getElementsByClassName('about')[0]);
    } else  {
        let about = document.createElement('div');
        about.setAttribute('class', 'about');
        about.innerHTML += content.innerHTML;
        document.body.appendChild(about);
    }
}

const createAbout = function() {
    let content = document.createElement('div');
    let logo = document.createElement('p');
    logo.setAttribute('class', 'about-logo');
    logo.innerHTML += 'Book<span>Ex</span>';
    let whatIsIt = document.createElement('p');
    whatIsIt.setAttribute('class', 'about-what');
    whatIsIt.innerText += 'What is it?';
    let whatIsItText = document.createElement('p');
    whatIsItText.setAttribute('class', 'about-text');
    whatIsItText.innerText = "BookEx is a book-extract viewing web app. Built on PanMacMillian.com's open API for book extracts.";
    let whyIsIt = document.createElement('p');
    whyIsIt.setAttribute('class', 'about-what');
    whyIsIt.innerText = 'Why is it?';
    let whyIsItText = document.createElement('p');
    whyIsItText.setAttribute('class', 'about-text');
    whyIsItText.innerText = 'BookEx is a schoolproject to finnish the "HTML, CSS, JavaScript" part of the "JavaScript Frontend" education by Lernia. More info of what guidlines this was built by and more is available in the GitHub repo linked below';
    let footer = document.createElement('div');
    footer.setAttribute('class', 'about-footer');
    let email = document.createElement('a');
    email.href = 'mailto:andreas.ostlund@spelpunkten.com';
    email.innerHTML = '<p>© Andreas Östlund</p>';
    let linkedin = document.createElement('a');
    linkedin.href = 'https://www.linkedin.com/in/andreas-östlund-42945467'
    linkedin.innerHTML = '<p>LinkedIn</p>';
    let github = document.createElement('a');
    github.href = 'https://github.com/aostlund/bookex-YHJUST16';
    github.innerHTML = '<p>GitHub repo</p>';
    footer.innerHTML += email.outerHTML;
    footer.innerHTML += linkedin.outerHTML;
    footer.innerHTML += github.outerHTML;
    content.innerHTML += logo.outerHTML;
    content.innerHTML += whatIsIt.outerHTML;
    content.innerHTML += whatIsItText.outerHTML;
    content.innerHTML += whyIsIt.outerHTML;
    content.innerHTML += whyIsItText.outerHTML;
    content.innerHTML += footer.outerHTML;
    return content;
}