let searchIsActive = false;

$(function() {
    getData();
    registerListeners();
});

const getData = function() {
    $.get('http://extracts.panmacmillan.com/getextracts', {readingtimegreaterthan: '10'}, handleData);
}

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

const registerListeners = function() {
    $('#search').on('click', showSearch);
} 

const showSearch = function() {
    if (!searchIsActive) {
        let authorSearch = $('<div><p>Author</p><input name="authorcontains" type="text" placeholder="Author name or part of it"/></div>');
        let titleSearch = $('<div><p>Title</p><input name="titlecontains" type="text" placeholder="Title or part of it"/></div>');
        let startDate = $('<div><p>Start Date</p><input name="publicationdategreaterthan" type="date" placeholder="Start date"/></div>');
        let endDate = $('<div><p>End Date</p><input name="publicationdatelessthan" type="date" placeholder="End date"/></div>');
        let leastReadingTime = $('<div><p>Minimum reading time</p><input name="readingtimegreaterthan" type="text" pattern="[0-9]{3}" placeholder="Minimum reading time in minutes"/></div>');
        let mostReadingTime = $('<div><p>Maximum reading time</p><input name="readingtimelessthan" type="text" pattern="[0-9]{3}" placeholder="Maximum reading time in minutes"/></div>');
        let submitButton = $('<input type="submit"/>');
        let form = $('<form></form>').append(authorSearch, titleSearch, startDate, endDate, leastReadingTime, mostReadingTime, submitButton);
        form.on('submit', searchBooks);
        let search = $('<div class="col-xs-12"><div class="col-xs-12 search z-depth-2"></div></div>');
        $('.search', search).append(form);
        $('.row').first().prepend(search);
        searchIsActive = true;
    } else {
        $('.search').parent().remove();
        searchIsActive = false;
    }
}

const searchBooks = function(event) {
    event.preventDefault();
    const searchData = $('form').serialize();
    $.get('http://extracts.panmacmillan.com/getextracts?' + searchData, (data) => {
        if (data.Extracts.length !== 0) {
            $('div[id*=book-]').children().remove();
            handleData(data);
            $('.search').parent().remove();
            searchIsActive = false;
        } else {
            //show "not found" and clear fields
        }
    });
}
