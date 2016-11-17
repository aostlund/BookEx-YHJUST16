let page_num = 1;
let currentPages;

$(function() { 
    getData();
    registerEventListeners();
});

const getData = function() {
    $.get('http://extracts.panmacmillan.com/getextracts', {readingtimegreaterthan: '10'}, handleData);
}

const handleData = function(data) {
    console.log(data.Extracts[1].extractHtml)
    const fixedData =  data.Extracts[1].extractHtml;
    const source = $(":header", $('<div></div>').append(fixedData)).first().parent().children();
    console.log(source)
    const pages = splitIntoChunks(source, 29);
    currentPages = pages;
    $('#page').append(pages[page_num]);
    $('#page').append($('<p class="page-num"></p>').text(page_num));
}

const splitIntoChunks = function(source, maxLinesInChunk) {
    let newArray = [];
    let chunkArray = [];
    let numLines= 0;
    for (let i = 0; i < source.length; i++) {
        let linesInP = $(source[i]).text().split(" ").length / 16; 
        console.log(Math.ceil(numLines + linesInP))
        if (Math.ceil(numLines + linesInP) > maxLinesInChunk || $(':header', $('<div></div>').append(source[i])).length) {
            console.log(numLines)
            newArray.push(chunkArray);
            chunkArray = [];
            numLines = $('.chapter-number', $('<div></div>').append(source[i])).length ? 6 : Math.ceil(linesInP + 1); //headers are larger and takes up more space so we add more lines
            chunkArray.push(source[i]);
        } else {
            numLines += Math.ceil(linesInP + 1);
            chunkArray.push(source[i]);
        }
    }
    chunkArray.push(source[source.length-1]);
    newArray.push(chunkArray);
    return newArray;
}

const registerEventListeners = function() {
    $('#next').on('click', () => turnPage(1));
    $('#prev').on('click', () => turnPage(-1));
}

const turnPage = function(direction) {
    page_num += direction;
    if (page_num < 1) page_num = 1;
    if (page_num >= currentPages.length) page_num = currentPages.length - 1;
    $('#page').children().remove();
    $('#page').append(currentPages[page_num]);
    $('#page').append($('<p class="page-num"></p>').text(page_num));
}