<template>
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <img :src="post.user.avatar" class="w-[40px] h-[40px] rounded-full object-cover">

                <div>
                    <p class="font-medium">
                        <RouterLink :to="{ name: 'profile', params: { 'id': post.user.id } }" class="hover:underline">
                            {{ post.user.name }}
                        </RouterLink>
                    </p>
                    <p class="text-xs text-gray-500">{{ formatDate(post.created_at) }}</p>
                </div>
            </div>

            <div>
                <button @click="toggleExtraModal" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5 text-gray-500">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z">
                        </path>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Hiển thị nội dung bài viết -->
        <p class="mb-3 whitespace-pre-line">{{ post.content }}</p>

        <!-- Hiển thị danh sách ảnh từ document kiểu Facebook -->
        <div v-if="post.document && post.document.length" class="mb-3">
            <!-- Trường hợp 1 file -->
            <div v-if="post.document.length === 1" class="rounded-lg overflow-hidden">
                <template v-if="isImage(post.document[0])">
                    <img :src="post.document[0]" alt="Post image"
                        class="w-full h-auto max-h-[600px] object-cover cursor-pointer" @click="openImageViewer(0)" />
                </template>
                <template v-else>
                    <video :src="post.document[0]" controls
                        class="w-full h-auto max-h-[600px] object-cover cursor-pointer"></video>
                </template>
            </div>

            <!-- Trường hợp 2 file -->
            <div v-else-if="post.document.length === 2" class="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                <template v-for="(file, index) in post.document" :key="index">
                    <template v-if="isImage(file)">
                        <img :src="file" alt="Post image" class="w-full h-[350px] object-cover cursor-pointer"
                            @click="openImageViewer(index)" />
                    </template>
                    <template v-else>
                        <video :src="file" controls class="w-full h-[350px] object-cover cursor-pointer"></video>
                    </template>
                </template>
            </div>

            <!-- Trường hợp 3 file -->
            <div v-else-if="post.document.length === 3" class="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                <template v-if="isImage(post.document[0])">
                    <img :src="post.document[0]" alt="Post image"
                        class="w-full h-[600px] object-cover row-span-2 cursor-pointer" @click="openImageViewer(0)" />
                </template>
                <template v-else>
                    <video :src="post.document[0]" controls
                        class="w-full h-[600px] object-cover row-span-2 cursor-pointer"></video>
                </template>
                <template v-for="index in 2" :key="index">
                    <template v-if="isImage(post.document[index])">
                        <img :src="post.document[index]" alt="Post image"
                            class="w-full h-[299px] object-cover cursor-pointer" @click="openImageViewer(index)" />
                    </template>
                    <template v-else>
                        <video :src="post.document[index]" controls
                            class="w-full h-[299px] object-cover cursor-pointer"></video>
                    </template>
                </template>
            </div>

            <!-- Trường hợp 4+ file -->
            <div v-else class="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                <div class="col-span-2 grid grid-cols-2 gap-1">
                    <template v-for="index in 3" :key="index - 1">
                        <template v-if="isImage(post.document[index - 1])">
                            <img :src="post.document[index - 1]" alt="Post image"
                                class="w-full h-[300px] object-cover cursor-pointer"
                                @click="openImageViewer(index - 1)" />
                        </template>
                        <template v-else>
                            <video :src="post.document[index - 1]" controls
                                class="w-full h-[300px] object-cover cursor-pointer"></video>
                        </template>
                    </template>
                    <div class="relative cursor-pointer" @click="openImageViewer(3)">
                        <template v-if="isImage(post.document[3])">
                            <img :src="post.document[3]" alt="Post image"
                                class="w-full h-[300px] object-cover brightness-75" />
                        </template>
                        <template v-else>
                            <video :src="post.document[3]" controls
                                class="w-full h-[300px] object-cover brightness-75"></video>
                        </template>
                        <div
                            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white font-bold text-2xl">
                            +{{ post.document.length - 4 }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <div class="flex space-x-6 items-center">
                <button class="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
                    @click="toggleLike(post.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        :stroke="isLiked ? '#3b82f6' : 'currentColor'" :fill="isLiked ? '#3b82f6' : 'none'"
                        class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z">
                        </path>
                    </svg>

                    <span :class="isLiked ? 'text-blue-500' : 'text-gray-500'" class="text-sm">
                        {{ post.likes_count || 0 }} {{ post.likes_count === 1 ? 'like' : 'likes' }}
                    </span>
                </button>

                <RouterLink :to="{ name: 'postview', params: { id: post.id } }"
                    class="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z">
                        </path>
                    </svg>

                    <span class="text-gray-500 text-sm">
                        {{ post.comments_count || 0 }} {{ post.comments_count === 1 ? 'comment' : 'comments' }}
                    </span>
                </RouterLink>

                <!-- Share Button -->
                <button class="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
                    @click="toggleShareModal">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                    <span :class=" text-gray-500" class="text-sm">
                        {{ post.shares_count || 0 }} {{ post.shares_count === 1 ? 'share' : 'shares' }}
                    </span>
                </button>
                <div v-if="post.is_private" class="flex items-center space-x-2 text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>

                    <span>Private</span>
                </div>
            </div>
        </div>

        <!-- Extra options modal -->
        <div v-if="showExtraModal" class="mt-3 p-3 bg-gray-50 rounded-lg">
            <div class="flex flex-col space-y-2">
                <button class="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
                    @click="openDeleteModal" v-if="userStore.user.id == post.user.id">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5 text-red-500">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span class="text-red-500 text-sm">Delete post</span>
                </button>

                <button class="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
                    @click="openReportModal" v-if="userStore.user.id != post.user.id">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5 text-orange-500">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                    </svg>
                    <span class="text-orange-500 text-sm">Report post</span>
                </button>
            </div>
        </div>

        <!-- Image Viewer Modal -->
        <div v-if="showImageViewer" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            @click="closeImageViewer">
            <div class="relative w-full h-full flex items-center justify-center">
                <!-- Close button -->
                <button class="absolute top-4 right-4 text-white z-10" @click.stop="closeImageViewer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Previous button -->
                <button v-if="post.document.length > 1"
                    class="absolute left-4 text-white z-10 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
                    @click.stop="prevImage">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <!-- Next button -->
                <button v-if="post.document.length > 1"
                    class="absolute right-4 text-white z-10 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
                    @click.stop="nextImage">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

                <!-- Image counter -->
                <div class="absolute bottom-6 left-0 right-0 text-center text-white text-lg font-medium">
                    {{ currentImageIndex + 1 }} / {{ post.document.length }}
                </div>

                <!-- Current image or video -->
                <template v-if="isImage(post.document[currentImageIndex])">
                    <img :src="post.document[currentImageIndex]" alt="Post image"
                        class="max-h-[95vh] max-w-[95vw] object-contain" @click.stop />
                </template>
                <template v-else>
                    <video :src="post.document[currentImageIndex]" controls
                        class="max-h-[95vh] max-w-[95vw] object-contain" @click.stop></video>
                </template>
            </div>
        </div>

        <!-- Share Modal -->
        <div v-if="showShareModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            @click="closeShareModal">
            <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4" @click.stop>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium">Share this post</h3>
                    <button @click="closeShareModal" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <!-- Facebook -->
                    <button @click="shareToSocial('facebook')"
                        class="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
                        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                            </svg>
                        </div>
                        <span class="text-sm">Facebook</span>
                    </button>

                    <!-- Twitter -->
                    <button @click="shareToSocial('twitter')"
                        class="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
                        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M22 5.8a8.49 8.49 0 0 1-2.36.64 4.13 4.13 0 0 0 1.81-2.27 8.21 8.21 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.64 11.64 0 0 1-8.45-4.29 4.16 4.16 0 0 0-.55 2.07 4.09 4.09 0 0 0 1.82 3.41 4.05 4.05 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.3 4 3.93 3.93 0 0 1-1.1.17 4.9 4.9 0 0 1-.77-.07 4.11 4.11 0 0 0 3.83 2.84A8.22 8.22 0 0 1 3 18.34a7.93 7.93 0 0 1-1-.06 11.57 11.57 0 0 0 6.29 1.85A11.59 11.59 0 0 0 20 8.45v-.53a8.43 8.43 0 0 0 2-2.12Z" />
                            </svg>
                        </div>
                        <span class="text-sm">Twitter</span>
                    </button>

                    <!-- WhatsApp -->
                    <button @click="shareToSocial('whatsapp')"
                        class="flex flex-col items-center p-3 rounded-lg hover:bg-green-50 transition-colors">
                        <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.867 2.03-1.71.273-.843.273-1.563.191-1.71-.08-.149-.297-.223-.594-.372z" />
                                <path
                                    d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5.002l-1.3 4.708L7.1 20.6A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.657 0-3.204-.477-4.514-1.3l-.32-.19-3.36.88.9-3.28-.21-.33A7.993 7.993 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                            </svg>
                        </div>
                        <span class="text-sm">WhatsApp</span>
                    </button>

                    <!-- Copy Link -->
                    <button @click="copyPostLink"
                        class="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                            </svg>
                        </div>
                        <span class="text-sm">Copy Link</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Report Modal -->
        <div v-if="showReportModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium">Report this post</h3>
                    <button @click="closeReportModal" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <textarea v-model="reportReason" placeholder="Enter your reason for reporting this post"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>

                <div class="flex justify-end mt-4">
                    <button @click="closeReportModal"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg mr-2 hover:bg-gray-300">
                        Cancel
                    </button>
                    <button @click="reportPost" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        Report
                    </button>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium">Delete Post</h3>
                    <button @click="closeDeleteModal" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p class="text-gray-700 mb-4">Are you sure you want to delete this post? This action cannot be undone.
                </p>

                <div class="flex justify-end">
                    <button @click="closeDeleteModal"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg mr-2 hover:bg-gray-300">
                        Cancel
                    </button>
                    <button @click="confirmDelete" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../stores/axios';
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'

export default {
    props: {
        post: Object
    },

    emits: ['deletePost', 'reportPost'],

    setup() {
        const userStore = useUserStore()
        const toastStore = useToastStore()

        return {
            userStore,
            toastStore
        }
    },

    data() {
        return {
            showExtraModal: false,
            showImageViewer: false,
            currentImageIndex: 0,
            isLiked: false,
            showShareModal: false,
            showExtraModal: false,
            showReportModal: false,
            reportReason: '',
            showDeleteModal: false,
        }
    },

    methods: {
        openDeleteModal() {
            this.showDeleteModal = true;
        },

        closeDeleteModal() {
            this.showDeleteModal = false;
        },
        openReportModal() {
            this.showReportModal = true;
        },

        closeReportModal() {
            this.showReportModal = false;
            this.reportReason = ''; // Xóa lý do khi đóng modal
        },
        toggleShareModal() {
            this.showShareModal = !this.showShareModal;
        },

        closeShareModal() {
            this.showShareModal = false;
        },

        async shareToSocial(platform) {
            const postUrl = `${window.location.origin}/post/${this.post.id}`;
            const postContent = this.post.content.length > 50
                ? this.post.content.substring(0, 50) + '...'
                : this.post.content;
            const text = `${this.post.user.name}: "${postContent}"`;

            try {
                // Gọi API để lưu thông tin chia sẻ
                const response = await axios.post(`/api/posts/share/store`, {
                    post_id: this.post.id,
                    platform: platform,
                    user_id: this.userStore.user.id,
                });
                console.log(`Share recorded for platform: ${platform}`, response.data);
                this.post.shares_count = (this.post.shares_count || 0) + 1;
                // Xử lý chia sẻ theo nền tảng
                let shareUrl = '';
                switch (platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(text)}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n' + postUrl)}`;
                        break;
                    case 'instagram':
                        this.toastStore.showToast(5000, 'Instagram sharing is not directly supported. Copy the link instead.', 'bg-yellow-500');
                        this.copyPostLink();
                        return;
                }

                if (shareUrl) {
                    window.open(shareUrl, '_blank'); // Chuyển hướng sau khi API hoàn tất
                }
            } catch (error) {
                console.error(`Error recording share for platform: ${platform}`, error);
                this.toastStore.showToast(5000, 'Failed to record share. Please try again.', 'bg-red-500');
            } finally {
                this.closeShareModal();
            }
        },
        copyPostLink() {
            const postUrl = `${window.location.origin}/post/${this.post.id}`;

            navigator.clipboard.writeText(postUrl)
                .then(() => {
                    this.toastStore.showToast(3000, 'Link copied to clipboard!', 'bg-emerald-500');
                    this.closeShareModal();
                })
                .catch(err => {
                    console.error('Failed to copy link: ', err);
                    this.toastStore.showToast(5000, 'Failed to copy link. Please try again.', 'bg-red-500');
                });
        },
        isImage(file) {
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            const extension = file.split('.').pop().toLowerCase();
            return imageExtensions.includes(extension);
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffSec = Math.floor(diffMs / 1000);
            const diffMin = Math.floor(diffSec / 60);
            const diffHour = Math.floor(diffMin / 60);
            const diffDay = Math.floor(diffHour / 24);

            if (diffDay > 7) {
                return date.toLocaleDateString();
            } else if (diffDay > 0) {
                return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
            } else if (diffHour > 0) {
                return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
            } else if (diffMin > 0) {
                return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
            } else {
                return 'Just now';
            }
        },

        // Phương thức để xử lý like/unlike
        toggleLike(id) {
            // Lưu trạng thái hiện tại trước khi thay đổi
            const wasLiked = this.isLiked;
            const originalLikeCount = this.post.likes_count || 0;

            // Cập nhật UI ngay lập tức để phản hồi nhanh
            this.isLiked = !wasLiked;

            // Cập nhật số lượng like dựa trên trạng thái mới
            if (this.isLiked) {
                // Nếu chuyển sang trạng thái đã like, tăng số lượng like
                this.post.likes_count = originalLikeCount + 1;
                // Gọi API like
                this.likePost(id, wasLiked, originalLikeCount);
            } else {
                // Nếu chuyển sang trạng thái chưa like, giảm số lượng like
                this.post.likes_count = Math.max(0, originalLikeCount - 1);
                // Gọi API unlike
                this.unlikePost(id, wasLiked, originalLikeCount);
            }
        },

        // API để like bài viết
        likePost(id, wasLiked, originalLikeCount) {
            console.log(`Liking post: ${id}`);

            axios
                .post(`/api/posts/${id}/like/`)
                .then(response => {
                    console.log("Like response:", response.data);
                    // Không cần cập nhật UI ở đây vì đã cập nhật trong toggleLike
                    // Chỉ xử lý trường hợp lỗi từ server nếu cần
                })
                .catch(error => {
                    console.error("Error liking post:", error);

                    // Khôi phục trạng thái ban đầu nếu có lỗi
                    this.isLiked = wasLiked;
                    this.post.likes_count = originalLikeCount;

                    this.toastStore.showToast(5000, 'Không thể thích bài viết. Vui lòng thử lại sau.', 'bg-red-500');
                });
        },

        // API để unlike bài viết
        unlikePost(id, wasLiked, originalLikeCount) {
            console.log(`Unliking post: ${id}`);

            axios
                .post(`/api/posts/${id}/unlike/`)
                .then(response => {
                    console.log("Unlike response:", response.data);
                    // Không cần cập nhật UI ở đây vì đã cập nhật trong toggleLike
                    // Chỉ xử lý trường hợp lỗi từ server nếu cần
                })
                .catch(error => {
                    console.error("Error unliking post:", error);

                    // Khôi phục trạng thái ban đầu nếu có lỗi
                    this.isLiked = wasLiked;
                    this.post.likes_count = originalLikeCount;

                    this.toastStore.showToast(5000, 'Không thể bỏ thích bài viết. Vui lòng thử lại sau.', 'bg-red-500');
                });
        },

        reportPost() {
            if (!this.reportReason.trim()) {
                this.toastStore.showToast(5000, 'Please provide a reason for reporting.', 'bg-red-500');
                return;
            }

            axios
                .post(`/api/posts/report/store/`, {
                    user_id: this.userStore.user.id, // Truyền ID người dùng
                    post_id: this.post.id, // Truyền ID bài viết
                    reason: this.reportReason // Truyền lý do báo cáo
                })
                .then(response => {
                    console.log(response.data);
                    this.showReportModal = false; // Đóng modal báo cáo
                    this.reportReason = ''; // Xóa lý do sau khi gửi
                    this.toastStore.showToast(5000, 'The post was reported successfully.', 'bg-emerald-500');

                    // Gọi emit để thông báo cho component cha
                    this.$emit('reportPost', this.post.id);
                })
                .catch(error => {
                    console.log("Error reporting post:", error);
                    this.toastStore.showToast(5000, 'Failed to report the post. Please try again.', 'bg-red-500');
                });
        },

        confirmDelete() {
            axios
                .put(`/api/posts/delete/${this.post.id}`)
                .then(response => {
                    console.log(response.data);
                    this.showDeleteModal = false;
                    this.$emit('deletePost', this.post.id);
                    this.toastStore.showToast(5000, 'The post was deleted successfully.', 'bg-emerald-500');
                })
                .catch(error => {
                    console.error("Error deleting post:", error);
                    this.toastStore.showToast(5000, 'Failed to delete the post. Please try again.', 'bg-red-500');
                });
        },

        toggleExtraModal() {
            this.showExtraModal = !this.showExtraModal
        },

        openImageViewer(index) {
            this.currentImageIndex = index;
            this.showImageViewer = true;
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        },

        closeImageViewer() {
            this.showImageViewer = false;
            document.body.style.overflow = ''; // Restore scrolling
        },

        nextImage() {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.post.document.length;
        },

        prevImage() {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.post.document.length) % this.post.document.length;
        },

        checkIfLiked() {
            axios
                .get(`/api/posts/${this.post.id}/check-like/`)
                .then(response => {
                    // Kiểm tra cấu trúc dữ liệu và log ra để debug
                    console.log("Check like response:", response.data);

                    // Kiểm tra các cấu trúc dữ liệu có thể có
                    if (response.data.is_liked !== undefined) {
                        this.isLiked = response.data.is_liked;
                    } else if (response.data.data && response.data.data.is_liked !== undefined) {
                        this.isLiked = response.data.data.is_liked;
                    } else if (typeof response.data === 'boolean') {
                        this.isLiked = response.data;
                    }
                })
                .catch(error => {
                    console.error("Error checking like status:", error);
                });
        }
    },

    mounted() {
        // Kiểm tra xem người dùng đã thích bài viết chưa khi component được tạo
        if (this.userStore.user) {
            console.log("Checking like status for post:", this.post.id);
            this.checkIfLiked();
        }
    },

    components: { RouterLink }
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

/* Hiệu ứng cho nút like khi hover */
button:hover svg {
    transform: scale(1.1);
    transition: transform 0.2s;
}
</style>
