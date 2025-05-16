import axios from 'axios';
import router from '@/router';
import { useUserStore } from '@/stores/user';

// Cấu hình Axios
axios.defaults.baseURL = 'http://127.0.0.1:8000/api'; // URL gốc cho API

// Thêm interceptor cho Axios
axios.interceptors.response.use(
  (response) => {
    // Trả về phản hồi nếu không có lỗi
    return response;
  },
  (error) => {
    // Kiểm tra mã lỗi 403
    if (error.response && error.response.status === 403) {
      console.warn('❌ Tài khoản bị khóa, chuyển hướng đến trang đăng nhập');
      const userStore = useUserStore();
      userStore.removeToken(); // Xóa token khỏi trạng thái
      router.push({ name: 'login', query: { message: error.response.data.message } }); // Chuyển hướng đến trang đăng nhập
    }

    // Trả về lỗi để các thành phần khác xử lý
    return Promise.reject(error);
  }
);

export default axios;