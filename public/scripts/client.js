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

  // Attach submitTweet to button
  const twtForm = $('#new-tweet form')
  twtForm.submit((e) => {
    e.preventDefault();
    twtForm.children('textarea').val(escape(twtForm.children('textarea').val()));
    if (twtForm.children('textarea').val().length <= charCount) {
      submitTweet(twtForm.serialize());
      resetTweetForm(twtForm)
    } else {
      twtForm.siblings('.error-msg').html('⚠️ Tweets can only have up to 140 characters maximum.').show();
    }
  })
});