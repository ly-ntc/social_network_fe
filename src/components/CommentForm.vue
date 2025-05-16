<template>
    <div class="bg-white border border-gray-200 rounded-lg" :class="{ 'fixed bottom-0 left-0 right-0 shadow-lg z-50': isReply }">
        <div class="max-w-3xl mx-auto">
            <!-- Reply header (only shown when replying) -->
            <div v-if="isReply" class="flex justify-between items-center p-3 border-b border-gray-100">
                <p class="text-sm text-gray-600">
                    Replying to <span class="font-medium">{{ replyToName }}</span>
                </p>
                <button 
                    @click="$emit('cancel')" 
                    class="text-gray-500 hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            
            <form @submit.prevent="submitComment">
                <div class="p-4">
                    <textarea 
                        v-model="content" 
                        class="p-4 w-full bg-gray-100 rounded-lg"
                        :placeholder="isReply ? 'Write your reply...' : 'What do you think?'" 
                        :rows="isReply ? 2 : 3"
                        ref="commentInput"
                        @keydown.enter.prevent="handleEnterKey"
                    ></textarea>
                </div>

                <div class="p-4 border-t border-gray-100" :class="{ 'flex justify-between': isReply }">
                    <button
                        type="submit"
                        class="inline-block py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        :disabled="!content.trim() || isSubmitting"
                    >
                        <span v-if="isSubmitting">{{ isReply ? 'Replying...' : 'Posting...' }}</span>
                        <span v-else>{{ isReply ? 'Reply' : 'Comment' }}</span>
                    </button>
                    
                    <button
                        v-if="isReply"
                        type="button"
                        @click="$emit('cancel')"
                        class="inline-block py-3 px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { nextTick } from 'vue';

export default {
    name: 'CommentForm',
    
    props: {
        postId: {
            type: [Number, String],
            required: true
        },
        parentId: {
            type: [Number, String],
            default: null
        },
        replyToName: {
            type: String,
            default: ''
        },
        isSubmitting: {
            type: Boolean,
            default: false
        }
    },
    
    emits: ['submit', 'cancel'],
    
    data() {
        return {
            content: ''
        };
    },
    
    computed: {
        isReply() {
            return !!this.parentId;
        }
    },
    
    watch: {
        parentId() {
            // Focus the input when switching to reply mode
            this.focusInput();
        }
    },
    
    mounted() {
        this.focusInput();
    },
    
    methods: {
        focusInput() {
            nextTick(() => {
                if (this.$refs.commentInput) {
                    this.$refs.commentInput.focus();
                }
            });
        },
        
        submitComment() {
            if (!this.content.trim()) return;
            
            this.$emit('submit', {
                post_id: this.postId,
                parent_id: this.parentId,
                content: this.content
            });
            
            // Clear the content after submission
            this.content = '';
        },
        
        resetForm() {
            this.content = '';
        },

        handleEnterKey(event) {
            // Allow Shift+Enter for line breaks
            if (event.shiftKey) {
                return;
            }
            
            // Submit the form on Enter
            this.submitComment();
        }
    }
};
</script>

