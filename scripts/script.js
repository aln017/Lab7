// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here

const curURL = new URL(window.location);
curURL.hash = '';
const settings = document.getElementsByTagName('img')[0];
const title = document.getElementsByTagName('h1')[0];

var newState = {
  state: 'Home',
  title: document.getElementsByTagName('h1')[0].innerHTML,
  url: curURL
};

const setState = router.setState(newState);

/*
 * Popstate event triggered when back arrow is clicked
 */
window.addEventListener('popstate', function(event) {
  newState = {
    state: this.history.state,
    title: '',
    url: curURL,
    }
  router.setState(newState);
});

/*
 * Settings icon event listener
 */
settings.addEventListener('click', function(event) {
  if (window.location.hash == '#settings') {
    return;
  }
  newState = {
    state: 'Settings',
    title: 'Settings',
    url: curURL + '#settings'
  };
  router.setState(newState);
});

/*
 * Click title event listener
 */
title.addEventListener('click', function() {
  newState = {
    state: 'Home',
    title: 'Journal Entries',
    url: curURL
  }
  router.setState(newState);
});

/* 
 * Assigns event listeners to entries, deletes old and inserts new entry
 */
function helper(newPost, i, entry) {
  newPost.addEventListener('click', function(event) {
    console.log('hah you got bamboozled');
    newState = {
      state: 'Entry',
      title: 'Entry ' + i,
      url: curURL + '#entry' + i 
    }
    router.setState(newState);
    
    var sing = document.querySelector('entry-page');
    sing.remove();
    sing = document.createElement('entry-page');
    document.body.appendChild(sing);
    sing.entry = entry;
  });
}


/*
 * Register service worker
 */ 
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// Make sure you register your service worker here too
var i = 0;
document.addEventListener('DOMContentLoaded', () => {
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        i++;
        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;
        document.querySelector('main').appendChild(newPost);
        helper(newPost, i, entry);
      });
    });
});

