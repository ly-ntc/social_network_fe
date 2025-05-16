import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore({
    id: 'user',

    state: () => ({
        user: {
            isAuthenticated: false,
            id: null,
            name: null,
            email: null,
            access: null,
            refresh: null,
            avatar: null,
            role_id: null,
        },
        refreshInProgress: false,
    }),

    actions: {
        initStore() {
            console.log('initStore', localStorage.getItem('user.access'))

            if (localStorage.getItem('user.access')) {
                console.log('User has access!')

                this.user.access = localStorage.getItem('user.access')
                this.user.refresh = localStorage.getItem('user.refresh')
                this.user.id = localStorage.getItem('user.id')
                this.user.name = localStorage.getItem('user.name')
                this.user.email = localStorage.getItem('user.email')
                this.user.avatar = localStorage.getItem('user.avatar')
                this.user.role_id = localStorage.getItem('user.role_id')
                this.user.isAuthenticated = true

                this.checkTokenExpiry();

                console.log('Initialized user:', this.user)
            }
        },

        setToken(data) {
            console.log('setToken', data)

            this.user.access = data.access
            this.user.refresh = data.refresh
            this.user.isAuthenticated = true

            localStorage.setItem('user.access', data.access)
            localStorage.setItem('user.refresh', data.refresh)

            console.log('user.access: ', localStorage.getItem('user.access'))
        },

        removeToken() {
            console.log('removeToken');

            this.user.refresh = null;
            this.user.access = null;
            this.user.isAuthenticated = false;
            this.user.id = null;
            this.user.name = null;
            this.user.email = null;
            this.user.avatar = null;
            this.user.role_id = null;

            localStorage.setItem('user.access', '');
            localStorage.setItem('user.refresh', '');
            localStorage.setItem('user.id', '');
            localStorage.setItem('user.name', '');
            localStorage.setItem('user.email', '');
            localStorage.setItem('user.avatar', '');
            localStorage.setItem('user.role_id', '');

            axios.defaults.headers.common["Authorization"] = null;
        },

        setUserInfo(user) {
            console.log('setUserInfo', user)

            this.user.id = user.id
            this.user.name = user.name
            this.user.email = user.email
            this.user.avatar = user.avatar
            this.user.role_id = user.role_id

            localStorage.setItem('user.id', this.user.id)
            localStorage.setItem('user.name', this.user.name)
            localStorage.setItem('user.email', this.user.email)
            localStorage.setItem('user.avatar', this.user.avatar)
            localStorage.setItem('user.role_id', this.user.role_id)

            console.log('User', this.user)
        },

        async refreshToken() {
            if (this.refreshInProgress) return;
            this.refreshInProgress = true;

            console.log('🔄 Refreshing token...');
            try {
                const response = await axios.post('/api/refresh', {}, {
                    headers: {
                        'Authorization': `Bearer ${this.user.refresh}`
                    }
                });

                console.log('✅ Token refreshed', response.data);
                this.user.access = response.data.access;
                localStorage.setItem('user.access', response.data.access);
                axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
            } catch (error) {
                console.error('❌ Refresh token failed', error.response?.status);

                // Nếu refresh thất bại, logout ngay lập tức
                if (error.response?.status === 401) {
                    this.removeToken();
                }
            } finally {
                this.refreshInProgress = false;
            }
        },
        checkTokenExpiry() {
            try {
                const access = this.user.access;
                if (!access) return;

                const payload = JSON.parse(atob(access.split('.')[1])); 
                const expiryTime = payload.exp * 1000;
                const now = Date.now();

                if (expiryTime - now < 60000) {
                    this.refreshToken();
                }
            } catch (error) {
                console.error('Lỗi kiểm tra hạn token', error);
            }
        }
    }
})