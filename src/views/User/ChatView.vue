<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-left col-span-1">
            <div class="p-4 bg-white border border-gray-200 rounded-lg">
                <div class="space-y-4">
                    <div class="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                        v-for="conversation in conversations" v-bind:key="conversation.id"
                        v-on:click="setActiveConversation(conversation.id)"
                        :class="{ 'bg-gray-100': activeConversation.id === conversation.id }">
                        <div class="flex items-center space-x-2">
                            <img v-if = "userStore.user.avatar == conversation.user1.avatar"
                                :src="conversation.user2.avatar" class="w-[40px] h-[40px] rounded-full">
                            <img v-else
                            :src="conversation.user1.avatar" class="w-[40px] h-[40px] rounded-full">
                            <p v-if="userStore.user.id == conversation.user1.id"
                                class="text-xs font-bold">{{ conversation.user2.name }}</p>
                            <p v-else class="text-xs font-bold">{{ conversation.user1.name }}</p>
                        </div>
                        <span class="text-xs text-gray-500">{{ conversation.modified_at_formatted }} ago</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="main-center col-span-3 space-y-4 flex flex-col">
            <div class="bg-white border border-gray-200 rounded-lg flex-grow flex flex-col">
                <div class="flex flex-col p-4 overflow-y-auto" style="min-height: 60vh; max-height: 60vh;"
                    ref="messagesContainer">
                    <div v-if="!activeConversation.messages || activeConversation.messages.length === 0"
                        class="flex items-center justify-center h-full">
                        <p class="text-gray-500">No messages yet. Start a conversation!</p>
                    </div>

                    <template v-for="message in activeConversation.messages" v-bind:key="message.id">
                        <div class="flex w-full mt-2 space-x-3 max-w-md ml-auto justify-end"
                            v-if="message.sender_id == userStore.user.id">
                            <div class="max-w-[80%]">
                                <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                    <p class="text-sm break-words">{{ message.content }}</p>
                                </div>
                                <span class="text-xs text-gray-500 leading-none">{{ formatTimeAgo(message.created_at) }}</span>
                            </div>
                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"> 
                                <img v-if = "userStore.user.avatar == activeConversation.user1.avatar"
                                    :src="activeConversation.user1.avatar" class="w-[40px] h-[40px] rounded-full">
                                <img v-else
                                 :src="activeConversation.user2.avatar" class="w-[40px] h-[40px] rounded-full">
                            </div>
                        </div>

                        <div class="flex w-full mt-2 space-x-3 max-w-md" v-else>
                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                                <img v-if = "userStore.user.avatar == activeConversation.user1.avatar"
                                    :src="activeConversation.user2.avatar" class="w-[40px] h-[40px] rounded-full">
                                <img v-else
                                 :src="activeConversation.user1.avatar" class="w-[40px] h-[40px] rounded-full">
                            </div>
                            <div class="max-w-[80%]">
                                <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                    <p class="text-sm break-words">{{ message.content }}</p>
                                </div>
                                <span class="text-xs text-gray-500 leading-none">{{ formatTimeAgo(message.created_at) }}</span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg">
                <form v-on:submit.prevent="submitForm">
                    <div class="p-4">
                        <textarea v-model="body" class="p-4 w-full bg-gray-100 rounded-lg"
                            placeholder="What do you want to say?" rows="3" @keydown.enter.prevent="submitForm">
            </textarea>
                    </div>

                    <div class="p-4 border-t border-gray-100 flex justify-between">
                        <button class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg"
                            :disabled="!body.trim()" :class="{ 'opacity-50 cursor-not-allowed': !body.trim() }">
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../../stores/axios.js';
import { useUserStore } from '@/stores/user'
import { formatDistanceToNow } from 'date-fns';

export default {
    name: 'chat',

    setup() {
        const userStore = useUserStore()

        return {
            userStore
        }
    },

    data() {
        return {
            conversations: [],
            activeConversation: {
                id: null,
                messages: []
            },
            body: ''
        }
    },

    mounted() {
        this.getConversations();
    },

    watch: {
        'activeConversation.id': {
            immediate: true,
            handler(newId) {
                if (!newId) return;

                // Hủy đăng ký kênh cũ nếu có
                if (this.channel) {
                    this.channel.stopListening('.MessageSent');
                }

                // Đăng ký kênh mới
                this.channel = window.Echo.private(`chat.${newId}`)
                    .listen('.MessageSent', (data) => {
                        console.log("📩 Tin nhắn mới nhận được:", data);

                        // Kiểm tra nếu tin nhắn đã tồn tại trong danh sách
                        const exists = this.activeConversation.messages.some(message => message.id === data.id);
                        if (!exists) {
                            this.activeConversation.messages.push(data);
                            this.scrollToBottom();
                        }
                    });
                console.log(`✅ Đã đăng ký kênh chat.${newId}`);
            }
        }
    }
    ,

    methods: {
        formatTimeAgo(date) {
            return formatDistanceToNow(new Date(date), { addSuffix: true });
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.messagesContainer;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
        },

        setActiveConversation(id) {
            // console.log('setActiveConversation', id)

            this.activeConversation.id = id; // Cập nhật trực tiếp `id`
            this.activeConversation.messages = []; // Xóa tin nhắn cũ
            this.getMessages();
        },

        getConversations() {
            // console.log('getConversations')

            axios
                .get('/api/conversations/list/')
                .then(response => {
                    // console.log(response.data)

                    this.conversations = response.data

                    if (this.conversations.length) {
                        this.activeConversation = {
                            id: this.conversations[0].id,
                            messages: []
                        }
                        this.getMessages()
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },

        getMessages() {
            // console.log('getMessages')

            axios
                .get(`/api/conversations/${this.activeConversation.id}/`)
                .then(response => {
                    this.activeConversation = response.data
                    // console.log(response.data)

                    this.$nextTick(() => {
                        this.scrollToBottom()
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        },

        submitForm() {
            if (!this.body.trim()) return;

            axios
                .post(`/api/conversations/${this.activeConversation.id}/messages/`, {
                    content: this.body,
                    conversation_id: this.activeConversation.id
                })
                .then(response => {
                    console.log('Tin nhắn đã gửi:', response.data);

                    // Nếu WebSocket không hoạt động, thêm tin nhắn vào danh sách
                    if (!this.channel) {
                        this.activeConversation.messages.push(response.data);
                    }

                    this.body = '';

                    this.$nextTick(() => {
                        this.scrollToBottom();
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
}
</script>
