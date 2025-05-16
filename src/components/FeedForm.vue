<template>
    <form v-on:submit.prevent="submitForm" method="post">
        <div class="p-4 sm:p-6">
            <div class="flex items-start space-x-4">
                <div class="min-w-0 flex-1">
                    <textarea v-model="body"
                        class="block w-full px-4 py-3 text-gray-700 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all resize-none"
                        placeholder="What are you thinking about?" rows="3"></textarea>
                </div>
            </div>

            <!-- Image preview grid -->
            <div v-if="urls.length" class="mt-4">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    <div v-for="(url, index) in urls" :key="index" class="relative group">
                        <!-- Hiển thị ảnh -->
                        <template v-if="files[index].type.startsWith('image/')">
                            <img :src="url" class="w-full h-24 object-cover rounded-lg border border-gray-200" />
                        </template>

                        <!-- Hiển thị video -->
                        <template v-else-if="files[index].type.startsWith('video/')">
                            <video :src="url" class="w-full h-24 object-cover rounded-lg border border-gray-200"
                                controls></video>
                        </template>

                        <!-- Nút xóa -->
                        <button type="button" @click="removeImage(index)"
                            class="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="flex items-center justify-between px-4 py-3 sm:px-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div class="flex space-x-2">
                <label class="relative cursor-pointer">
                    <input type="file" ref="file" @change="onFileChange" multiple class="sr-only"
                        accept="image/*,video/*">
                    <div
                        class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4a.5.5 0 01-.5-.5v-6.5l2.29-2.29a.5.5 0 01.71 0L9 7.83l1.29-1.29a.5.5 0 01.71 0L14.5 10v4.5a.5.5 0 01-.5.5zM16 5v1.5l-3.5-3.5H4a.5.5 0 00-.5.5V5h12z"
                                clip-rule="evenodd" />
                        </svg>
                        <span>Photos</span>
                    </div>
                </label>
            </div>

            <button type="submit"
                class="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :disabled="isSubmitting || (isUploading || (!body.trim() && !uploadedImages.length))">
                <span v-if="isSubmitting || isUploading" class="mr-2">
                    <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                </span>
                {{ isSubmitting ? 'Posting...' : (isUploading ? 'Uploading...' : 'Post') }}
            </button>
        </div>
    </form>
</template>

<script>
import axios from '../stores/axios';
import { useToastStore } from '@/stores/toast'

export default {
    props: {
        user: Object,
        posts: Array
    },

    // Thêm emit để thông báo khi bài viết được tạo
    emits: ['post-created'],

    setup() {
        const toastStore = useToastStore()
        return { toastStore }
    },

    data() {
        return {
            body: '',
            is_private: false,
            urls: [], // Lưu trữ URL của các ảnh đã chọn để hiển thị
            files: [], // Lưu trữ các file ảnh đã chọn
            uploadedImages: [], // Lưu trữ thông tin ảnh đã tải lên (ví dụ: URL hoặc ID)
            isUploading: false, // Trạng thái đang tải ảnh
            isSubmitting: false // Trạng thái đang gửi bài viết
        }
    },

    methods: {
        async onFileChange(event) {
            const selectedFiles = Array.from(event.target.files);
            if (selectedFiles.length === 0) return;

            this.files = [...this.files, ...selectedFiles];

            // Tạo URL để hiển thị ảnh hoặc video
            const newUrls = selectedFiles.map(file => {
                if (file.type.startsWith('image/')) {
                    return URL.createObjectURL(file); // URL cho ảnh
                } else if (file.type.startsWith('video/')) {
                    return URL.createObjectURL(file); // URL cho video
                }
            });
            this.urls = [...this.urls, ...newUrls];

            // Tải file lên server
            this.isUploading = true;
            try {
                const uploadPromises = selectedFiles.map(file => {
                    let formData = new FormData();
                    formData.append('file', file);
                    return axios.post('/api/upload/', formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    });
                });

                const responses = await Promise.all(uploadPromises);
                const newUploadedFiles = responses.map(response => response.data.file_url);
                this.uploadedImages = [...this.uploadedImages, ...newUploadedFiles];
                console.log('Uploaded files:', this.uploadedImages);
            } catch (error) {
                console.error('Error uploading files:', error);
                this.toastStore.showToast(5000, 'Error uploading files. Please try again.', 'bg-red-500');
            } finally {
                this.isUploading = false;
            }
        },

        removeImage(index) {
            // Xóa URL object để tránh rò rỉ bộ nhớ
            URL.revokeObjectURL(this.urls[index])

            // Xóa khỏi các mảng
            this.files.splice(index, 1)
            this.urls.splice(index, 1)
            this.uploadedImages.splice(index, 1)
        },

        resetForm() {
            // Xóa tất cả các URL object để tránh rò rỉ bộ nhớ
            this.urls.forEach(url => URL.revokeObjectURL(url))

            // Reset tất cả các trường
            this.body = ''
            this.is_private = false
            this.files = []
            this.urls = []
            this.uploadedImages = []

            // Reset file input
            if (this.$refs.file) {
                this.$refs.file.value = null
            }
        },

        async submitForm() {
            // Kiểm tra nếu form không có nội dung hoặc đang trong quá trình tải lên
            if ((!this.body.trim() && !this.uploadedImages.length) || this.isUploading) {
                return
            }

            this.isSubmitting = true
            console.log('submitForm', this.body)

            let formData = {
                content: this.body,
                title: "New post",
                document: this.uploadedImages
            }

            try {
                const response = await axios.post('/api/posts/store/', formData)
                console.log('data', response.data)

                // Reset form
                this.resetForm()

                // Hiển thị thông báo thành công
                this.toastStore.showToast(5000, 'Post created successfully!', 'bg-emerald-500')

                // Emit sự kiện để thông báo cho component cha biết có bài viết mới
                this.$emit('post-created')

            } catch (error) {
                console.log('error', error)
                this.toastStore.showToast(5000, 'Error creating post. Please try again.', 'bg-red-500')
            } finally {
                this.isSubmitting = false
            }
        }
    }
}
</script>

<style scoped>
/* Ẩn input file */
input[type="file"] {
    display: none;
}

/* Hiệu ứng chuyển đổi mượt mà */
.transition-colors {
    transition: background-color 0.2s, color 0.2s;
}

.transition-opacity {
    transition: opacity 0.2s;
}

textarea {
    min-height: 80px;
}
</style>
