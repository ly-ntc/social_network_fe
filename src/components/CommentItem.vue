<template>
    <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <!-- Comment content -->
        <div class="flex items-start space-x-3">
            <img :src="comment.user?.avatar || '/placeholder.svg?height=32&width=32'" class="w-8 h-8 rounded-full flex-shrink-0" />
            <div class="flex-grow">
                <div class="bg-gray-100 rounded-lg p-3">
                    <div class="flex justify-between items-start">
                        <p class="text-xs font-medium">{{ comment.user?.name || 'Unknown User' }}</p>
                        <p class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</p>
                    </div>
                    <p class="text-sm mt-1">{{ comment.content }}</p>
                </div>
                
                <!-- Reply button -->
                <div class="mt-2">
                    <button 
                        class="text-xs text-purple-600 hover:text-purple-800 transition-colors"
                        @click="handleReply"
                    >
                        Reply
                    </button>
                </div>
            </div>
        </div>

        <!-- Child comments -->
        <div v-if="comment.children && comment.children.length > 0" class="mt-4 ml-8 space-y-3">
            <CommentItem 
                v-for="child in comment.children" 
                :key="child.id" 
                :comment="child" 
                @reply="$emit('reply', $event)" 
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'CommentItem',
    props: {
        comment: {
            type: Object,
            required: true
        }
    },
    
    emits: ['reply'],
    
    methods: {
        handleReply() {
            // Emit both the comment ID and the user info for the reply
            this.$emit('reply', {
                commentId: this.comment.id,
                userName: this.comment.user?.name || 'Unknown User'
            });
        },
        
        formatDate(dateString) {
            if (!dateString) return 'Just now';
            
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
        }
    }
};
</script>

