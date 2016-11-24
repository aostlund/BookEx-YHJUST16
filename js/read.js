let book;
let pageNum = 1;
let currentPages;
let fontSize = (window.matchMedia('(max-device-width: 450px)').matches) || (window.matchMedia('(max-device-height: 450px)')).matches ? 12 : 14;

$(function() { 
    book = location.search.split('book=')[1] ? location.search.split('book=')[1] : 0; 
    getData();
    registerEventListeners();
    updateFontSize(null, fontSize);    
});

const getData = function() {
   localStorage.getItem('books') 
        ? handleData(JSON.parse(localStorage.getItem('books'))) 
        : $.get('http://extracts.panmacmillan.com/getextracts', {readingtimegreaterthan: '10'}, handleData);
}

const handleData = function(data) {
    let linesPerPage = (window.matchMedia('(max-device-width: 640px)').matches) ? 10 : 29;
    const fixedData =  data.Extracts[book].extractHtml;
    const source = $(":header", $('<div></div>').append(fixedData)).first().parent().children();
    const pages = splitIntoChunks(source, linesPerPage);
    currentPages = pages;
    $('#page').append(pages[pageNum]);
    $('#page').append($('<p class="page-num"></p>').text(pageNum));
    $('#page').attr('id', 'page-' + pageNum);
}

const splitIntoChunks = function(source, maxLinesInChunk) {
    let newArray = [];
    let chunkArray = [];
    let numLines= 0;
    for (let i = 0; i < source.length; i++) {
        let linesInP = $(source[i]).text().split(" ").length / 16; 
        if (Math.ceil(numLines + linesInP) > maxLinesInChunk || $(':header', $('<div></div>').append(source[i])).length) {
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
    $('#next').on('click', () => nextPage());
    $('#prev').on('click', () => prevPage());
    $('#font-size').on('change', updateFontSize);
}

const nextPage = function() {
    let prevPage = pageNum;
    let height = $('#page-' + prevPage).outerHeight();
    pageNum += 1;
    if (pageNum >= currentPages.length) {
        pageNum = currentPages.length - 1;
    } else {
        let nextPage = $('#page-' + prevPage).clone();
        nextPage.css('top', '200px');
        nextPage.children().remove();
        nextPage.attr('id', 'page-' + pageNum);
        nextPage.append(currentPages[pageNum]);
        nextPage.append($('<p class="page-num"></p>').text(pageNum));
        nextPage.find('p').css('font-size', fontSize);
        $('body').css('overflow-y', 'hidden'); // removes scroll to stop graphical resizing glitch
        $('section').append(nextPage);
        $('#page-' + prevPage).animate({top: '-1000'}, 1000, () => { $('#page-' + prevPage).remove() });
        $('#page-' + pageNum).animate({top: '-' + height}, 1000, () => { 
            $('#page-' + pageNum).css('top', '0px');
            $('body').css('overflow-y', 'auto'); // re-enables scroll
        });
        $('html, body').animate({scrollTop: 0});
    }
}

const prevPage = function() {
    let prevPage = pageNum;
    let height = $('#page-' + prevPage).outerHeight();
    pageNum -= 1;
    if (pageNum < 1) {
        pageNum = 1;
    } else {
        let nextPage = $('#page-' + prevPage).clone();
        nextPage.css('top', '-1000px');
        nextPage.children().remove();
        nextPage.attr('id', 'page-' + pageNum);
        nextPage.append(currentPages[pageNum]);
        nextPage.append($('<p class="page-num"></p>').text(pageNum));
        nextPage.find('p').css('font-size', fontSize);
        $('body').css('overflow-y', 'hidden'); // removes scroll to stop graphical resizing glitch
        $('section').prepend(nextPage);
        $('#page-' + prevPage).css('top', '-' + height + 'px');
        $('#page-' + prevPage).animate({top: '200'}, 1000, () => { $('#page-' + prevPage).remove() });
        $('#page-' + pageNum).animate({top: '0'}, 1000, () => { 
            $('#page-' + pageNum).css('top', '0px');
            $('body').css('overflow-y', 'auto'); // re-enables scroll
        });
        $('html, body').animate({scrollTop: 0});
    }
}

const updateFontSize = function(event, size) {
    console.log(size);
    fontSize = size ? size : Number($('#font-size').val());
    $('[id*=page-]>p').css('font-size', fontSize);
    $('output[name=font-out]').val(fontSize);
}