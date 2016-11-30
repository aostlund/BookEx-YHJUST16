/*------------------------------------------
 books.js - Main code for book-listing-page
------------------------------------------*/

/*-------------------------------------------------------------
 Dom is ready so we get book data and register event listeners.
-------------------------------------------------------------*/
$(function() {
    getData();
    registerListeners();
});

/*------------------------------------------------------------------------------------
 If we have already stored data we send that to handleData, else we do a "default" GET.
------------------------------------------------------------------------------------*/
const getData = function() {
   localStorage.getItem('books') 
        ? handleData(JSON.parse(localStorage.getItem('books'))) 
        : $.get('http://extracts.panmacmillan.com/getextracts', {readingtimegreaterthan: '10'}, handleData);
}

/*--------------------------------------------------------------------------------------------------------------
 Read each entry and create a book "card" for them. Add click event that directs to reading page for that book. 
--------------------------------------------------------------------------------------------------------------*/
const handleData = function(data) {
    localStorage.setItem('books', JSON.stringify(data));
    data.Extracts.forEach((book, index) => {
        let containerElement = $('#book-' + index);
        containerElement.append($('<div class="col-xs-12 book-content z-depth-1"></div>'));
        let contentElement = containerElement.children().first();
        contentElement.append($('<img>').attr('src', book.jacketUrl));
        contentElement.append($('<p></p>').text(book.keynote.substring(0, 80) + '...'));
        contentElement.append($('<div class="look-inside"><p>Look Inside</p></div>'));
        contentElement.on('click', () => {
            window.location = 'read.html?book=' + index;
        })
    })
}

/*---------------------------------------
 Register listener for search menu item.
---------------------------------------*/
const registerListeners = function() {
    $('#search').on('click', showSearch);
} 

/*-------------------------------------------------------------------------------------------------------
 Build search-box, put div over background that darken and add click event to it that closes search-box.
-------------------------------------------------------------------------------------------------------*/
const showSearch = function() {
    $('#navbar').collapse('hide');
    if ($('.search').length === 0) {
        $('.about').first() ? $('.about').first().remove() : null;
        $('body').append($('<div class="darken"></div>'));
        $('.darken').on('click', showSearch);
        let close = $('<div class="close"><i class="material-icons" id="close">clear<i></div>');
        let authorSearch = $('<div><p>Author</p><input name="authorcontains" type="search" placeholder="Author name or part of it"/></div>');
        let titleSearch = $('<div><p>Title</p><input name="titlecontains" type="search" placeholder="Title or part of it"/></div>');
        let startDate = $('<div><p>Start Date</p><input name="publicationdategreaterthan" type="date" placeholder="Start date"/></div>');
        let endDate = $('<div><p>End Date</p><input name="publicationdatelessthan" type="date" placeholder="End date"/></div>');
        let leastReadingTime = $('<div><p>Minimum reading time</p><input name="readingtimegreaterthan" type="text" pattern="[0-9]*" placeholder="Minimum reading time in minutes"/></div>');
        let mostReadingTime = $('<div><p>Maximum reading time</p><input name="readingtimelessthan" type="text" pattern="[0-9]*" placeholder="Maximum reading time in minutes"/></div>');
        let submitButton = $('<input type="submit"/>');
        let form = $('<form></form>').append(authorSearch, titleSearch, startDate, endDate, leastReadingTime, mostReadingTime, submitButton);
        form.on('submit', searchBooks);
        let search = $('<div class="col-xs-12"><div class="col-xs-12 search z-depth-2"></div></div>');
        $('.search', search).append(close, form);
        $('.row').first().prepend(search);
        $('#close').on('click', showSearch);
    } else {
        $('.darken').remove();
        $('.search').parent().remove();
    }
}

/*--------------------------------------------------------------------------------------------------
 Search for books by entered criteria, if found update book-cards else show that nothing was found.
--------------------------------------------------------------------------------------------------*/
const searchBooks = function(event) {
    event.preventDefault();
    $('.not-found').remove();
    const searchData = $('form').serialize();
    $.get('http://extracts.panmacmillan.com/getextracts?' + searchData, (data) => {
        if (data.Extracts.length !== 0) {
            $('.darken').remove();
            $('div[id*=book-]').children().remove();
            handleData(data);
            $('.search').parent().remove();
        } else {
            $('.search').prepend($('<div class="not-found"><p>No search results found</p></div>'));
        }
    });
}
