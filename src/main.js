import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'

import './assets/main.css'

import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher;

function setupEcho() {
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: "local",
        wsHost: "127.0.0.1",
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
        cluster: "mt1",
        authEndpoint: "http://127.0.0.1:8000/broadcasting/auth", 
        auth: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('user.access')}` 
            }
        }
    });
}

// Thiết lập Echo lần đầu
setupEcho();

axios.defaults.baseURL = import.meta.env.VITE_API_URL

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Lắng nghe sự kiện chuyển trang
router.beforeEach((to, from, next) => {
    if (to.name === 'chat') { // Kiểm tra nếu chuyển sang trang chat
        setupEcho(); // Thiết lập lại Echo
    }
    next();
});

app.mount('#app')