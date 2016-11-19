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
            window.location = 'index.html?book=' + index;
        })
    })
}

const registerListeners = function() {
    $('#search').on('click', showSearch);
} 

const showSearch = function() {
    if (!searchIsActive) {
        let authorSearch = $('<input name="authorcontains" type="text"/>');
        let titleSearch = $('<input name="titlecontains" type="text"/>');
        let startDate = $('<input name="publicationdategreaterthan" type="date"/>');
        let endDate = $('<input name="publicationdatelessthan" type="date"/>');
        let leastReadingTime = $('<input name="readingtimegreaterthan" type="text"/>');
        let mostReadingTime = $('<input name="readingtimelessthan" type="text"/>');
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
