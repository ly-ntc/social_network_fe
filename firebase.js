import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCKR16aBaIME0fKjS4Mr6LsurA5Y5ZS9Oc",
    authDomain: "app1-7ca57.firebaseapp.com",
    projectId: "app1-7ca57",
    storageBucket: "app1-7ca57.appspot.com",
    messagingSenderId: "457793889775",
    appId: "1:457793889775:web:f3bf8c2fb4b03263dd021a"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// Hàm lấy FCM token của thiết bị
export const getDeviceToken = async () => {
    try {
        // Kiểm tra và yêu cầu quyền thông báo
        const permission = Notification.permission;
        if (permission === 'default') {
            console.log('Quyền thông báo chưa được yêu cầu. Đang yêu cầu quyền...');
            await Notification.requestPermission();
        }

        if (Notification.permission !== 'granted') {
            console.warn('Quyền thông báo chưa được cấp. Người dùng đã từ chối hoặc chưa chấp nhận.');
            return null;
        }

        // Lấy FCM token
        const token = await getToken(messaging, {
            vapidKey: "BHk6E7bv7bTt7nCfgzPy5Wv0zNbt17z5PSuBovNYMza9BZtinbyf14oGIhYEtnmrjSJ2eMiLQSBCIhsGofhBUmQ", // Đảm bảo VAPID Key đúng
        });

        if (token) {
            console.log('FCM Token:', token);
            return token;
        } else {
            console.warn('Không thể lấy FCM token.');
            return null;
        }
    } catch (error) {
        console.error('Lỗi khi lấy FCM token:', error);
        return null;
    }
};
// Lắng nghe thông báo khi ứng dụng đang hoạt động
onMessage(messaging, (payload) => {
    console.log('Thông báo nhận được:', payload);
});

export { messaging, onMessage, getToken };