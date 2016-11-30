/*-----------------------------------------
 read.js - Main code for the reading-page.
-----------------------------------------*/

let book;
let pageNum = 1;
let currentPages;
let fontSize = (window.matchMedia('(max-device-width: 450px)').matches) || (window.matchMedia('(max-device-height: 768px)')).matches ? 12 : 14;

/*--------------------------------------------------------------------------
 DOM is ready and we read location URL to get book nr, get data, 
 register eventlisteners, update the font-size and set minimum page height.
--------------------------------------------------------------------------*/
$(function() { 
    book = location.search.split('book=')[1] || 0;
    getData();
    registerEventListeners();
    updateFontSize(null, fontSize);    
    setMinPageHeight();
});

/*--------------------------------------------------------------------------------------
 If we have already stored data we send that to handleData, else we do a "default" GET.
--------------------------------------------------------------------------------------*/
const getData = function() {
   localStorage.getItem('books') 
        ? handleData(JSON.parse(localStorage.getItem('books'))) 
        : $.get('http://extracts.panmacmillan.com/getextracts', {readingtimegreaterthan: '10'}, handleData);
}

/*-------------------------------------------------------------------------------------------------------------------------
 Sets lines per page based on screen-size, extracts data to be split into page chunks and adds the first page to the site.
-------------------------------------------------------------------------------------------------------------------------*/
const handleData = function(data) {
    let linesPerPage = (window.matchMedia('(max-device-width: 640px)').matches) ? 11 : 29;
    const fixedData =  data.Extracts[book].extractHtml;
    const source = $(":header, p", $('<div></div>').append(fixedData)).first().parent().children();
    const pages = splitIntoChunks(source, linesPerPage);
    currentPages = pages;
    $('#page').append(pages[pageNum]);
    $('#page').append($('<p class="page-num"></p>').text(pageNum));
    $('#page').attr('id', 'page-' + pageNum);
}

/*----------------------------------------------------------------------------------------------------------------------------------
 Splits the book into pages based on number of lines per page. Also deals with differance between how books handle chapter headers.
----------------------------------------------------------------------------------------------------------------------------------*/
const splitIntoChunks = function(source, maxLinesInChunk) {
    let newArray = [];
    let chunkArray = [];
    let numLines= 0;
    for (let i = 0; i < source.length; i++) {
        let linesInP = $(source[i]).text().split(" ").length / 16; 
        if (Math.ceil(numLines + linesInP) > maxLinesInChunk || $(':header, [class*=ch]', $('<div></div>').append(source[i])).length) {
            if (!$(':header', $('<div></div>').append(source[i-1])).length) { // Chapter starts might have two headers (chapter-number and chapter-title). We want them on same page
                newArray.push(chunkArray);                                    // so only add if previous line wasn't a header
                chunkArray = [];
                numLines = $(':header', $('<div></div>').append(source[i])).length ? 3 : Math.ceil(linesInP); //headers are larger and takes up more space so we add more lines
                chunkArray.push(source[i]);
            } else {
                numLines = $(':header', $('<div></div>').append(source[i])).length ? 6 : Math.ceil(linesInP); //headers add 2x lines as this only runs when pages starts with two headers
                chunkArray.push(source[i]);
            }
        } else {
            numLines += Math.ceil(linesInP);
            chunkArray.push(source[i]);
        }
    }
    chunkArray.push(source[source.length-1]);
    newArray.push(chunkArray);
    return newArray;
}

/*------------------------------------------------------------------
 Register event handlers for previous, next and font-size controls.
------------------------------------------------------------------*/
const registerEventListeners = function() {
    $('#next').on('click', nextPage);
    $('#prev').on('click', prevPage);
    $('#font-size').on('change', updateFontSize);
}

/*--------------------------------------------------------------------------------------------
 Animates in next page. Adds new page below current animates them upward and delets old page.
--------------------------------------------------------------------------------------------*/
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
        $('section').append(nextPage);
        $('#page-' + prevPage).animate({top: '-1000'}, 1000, () => { $('#page-' + prevPage).remove() });
        $('#page-' + pageNum).animate({top: '-' + height}, 1000, () => { 
            $('#page-' + pageNum).css('top', '0px');
        });
        $('html, body').animate({scrollTop: 0});
    }
}

/*---------------------------------------------------------------------------------------------------
 Same as nextPage but in the other direction. Should probably only have one function that does both.
---------------------------------------------------------------------------------------------------*/
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
        $('section').prepend(nextPage);
        $('#page-' + prevPage).css('top', '-' + height + 'px');
        $('#page-' + prevPage).animate({top: '200'}, 1000, () => { $('#page-' + prevPage).remove() });
        $('#page-' + pageNum).animate({top: '0'}, 1000, () => { 
            $('#page-' + pageNum).css('top', '0px');
        });
        $('html, body').animate({scrollTop: 0});
    }
}

/*--------------------------------------------------------------------------------------------------------------
 Updates font-size by reading value of slider when it changes, or setting it to the size variable if it exists.
--------------------------------------------------------------------------------------------------------------*/
const updateFontSize = function(event, size) {
    fontSize = size || Number($('#font-size').val());
    $('[id*=page-]>p').css('font-size', fontSize);
    $('output[name=font-out]').val(fontSize);
}

/*------------------------------------------------
 Sets minimum page height based on screen height.
------------------------------------------------*/
const setMinPageHeight = function() {
    $('[id*=page]').css('min-height', (window.screen.height * 0.65) + 'px')
}