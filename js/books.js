$(function() {
    getData();
});

const getData = function() {
    $.get('http://extracts.panmacmillan.com/getextracts', {readingtimegreaterthan: '10'}, handleData);
}

const handleData = function(data) {
    localStorage.setItem('books', JSON.stringify(data));
    data.Extracts.forEach((book, index) => {
        let contentElement = $('#book-' + index).children().first();
        console.log(book)
        contentElement.append($('<img>').attr('src', book.jacketUrl));
        contentElement.append($('<p></p>').text(book.keynote.substring(0, 80) + '...'));
        contentElement.append($('<div class="look-inside"><p>Look Inside</p></div>'));
        contentElement.on('click', () => {
            window.location = 'index.html?book=' + index;
        })
    })
}