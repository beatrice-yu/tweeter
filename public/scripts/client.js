/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const charCount = 140;

const createTweetElement = (obj) => {
  const $tweet = `
    <article class="tweet">
      <header>
        <div class="profile">
          <span class="profile-pic"><img src="${obj.user.avatars}" /></span>
          <span class="profile-name">${obj.user.name}</span>
        </div>
        <div class="user-handle">${obj.user.handle}</div>
      </header>
      <div class="content">${obj.content.text}</div>
      <footer>
        <time datetime="${obj.created_at}"></time>
        <div class="icons">
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
        </div>
      </footer>
    </article>
  `;

  return $tweet;
}

const renderTweets = (tweets) => {
  $('#tweets-container').empty();
  tweets.reverse().forEach(element => {
    $('#tweets-container').append(createTweetElement(element));
  });

  // Update time format
  $('time').each(function() {
    $(this).html(timeago.format($(this).attr('datetime')));
  });
}

const submitTweet = (data) => {
  $.ajax({
    method: 'POST',
    url: '/tweets',
    data: data
  })
  .done(() => {
    console.log("Submitted successfully!");
    loadTweets();
  })
  .fail((e) => {
    console.log("Error: " + e);
  });
}

const loadTweets = () => {
  $.ajax({
    method: 'GET',
    url: '/tweets',
    success: renderTweets
  })
  .fail((e) => {
    console.log("Error: " + e);
  });
}

const resetTweetForm = (form) => {
  form.siblings('.error-msg').html('').hide();
  form.children('textarea').val('').siblings('.submit').children('output.counter').html(charCount);
}

const escapeStr = (str) => {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

$(function(){
  loadTweets();

  const nav = $('body > nav');

  $(window).scroll(() => {
    if ($(window).scrollTop() > 0) {
      nav.addClass('sticky-nav')
      $('a.back-to-top').show();
    } else {
      nav.removeClass('sticky-nav');
      $('a.back-to-top').hide();
    }
  });

  const twtForm = $('#new-tweet form');
  const twtFormTextArea = twtForm.children('textarea');
  const twtFormError = twtForm.siblings('.error-msg');

  $('.new-twt-btn').click(() => {
    ($(window).width() >= 768) ? $(window).scrollTop(nav.height()) : $(window).scrollTop($('main.container').offset().top - 70);
  });

  twtForm.keypress((e) => {
    if (e.which === 13) {
      e.preventDefault();
      twtForm.submit();
    }
  });

  twtForm.children('.submit').children('button[type="submit"]').click((e) => {
    e.preventDefault();
    twtForm.submit();
  });

  twtForm.submit((e) => {
    e.preventDefault();
    twtFormTextArea.val(escapeStr(twtFormTextArea.val()));
    if(twtFormTextArea.val().length <= 0) {
      twtFormError.html('⚠️ You haven\'t typed anything yet.').show();
    } else if(twtFormTextArea.val().length > charCount) {
      twtFormError.html('⚠️ Tweets can only have up to 140 characters maximum.').show();
    } else {
      submitTweet(twtForm.serialize());
      resetTweetForm(twtForm);
    }
  });
});