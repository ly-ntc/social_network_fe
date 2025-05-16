// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCKR16aBaIME0fKjS4Mr6LsurA5Y5ZS9Oc",
    authDomain: "app1-7ca57.firebaseapp.com",
    projectId: "app1-7ca57",
    storageBucket: "app1-7ca57.appspot.com",
    messagingSenderId: "457793889775",
    appId: "1:457793889775:web:f3bf8c2fb4b03263dd021a"
});

const messaging = firebase.messaging();
