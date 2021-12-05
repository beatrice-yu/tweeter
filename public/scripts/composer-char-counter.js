$(function(){
  $('#tweet-text').keyup(function(){
    const counter = $(this).siblings('.submit').children('output.counter');
    counter.html(charCount - $(this).val().length);
    (charCount - $(this).val().length < 0) ? counter.addClass('alert') : counter.removeClass('alert');
  });
});