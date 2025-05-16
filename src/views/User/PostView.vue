<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-center col-span-3 space-y-4" :class="{ 'pb-32': replyingTo }">
            <!-- Post content -->
            <div class="p-4 bg-white border border-gray-200 rounded-lg" v-if="post.id">
                <FeedItem v-bind:post="post" />
            </div>
            
            <!-- Main comment form (for top-level comments) - NOW POSITIONED AT THE TOP -->
            <CommentForm 
                v-if="!replyingTo"
                :postId="post.id" 
                :isSubmitting="isSubmitting"
                @submit="handleCommentSubmit"
            />
            
            <!-- Comments list -->
            <div v-for="comment in post.comments" :key="comment.id" class="space-y-3">
                <CommentItem :comment="comment" @reply="startReply" />
            </div>

            <!-- Reply form (positioned at the bottom of the screen) -->
            <CommentForm 
                v-if="replyingTo"
                :postId="post.id"
                :parentId="replyingTo"
                :replyToName="replyingToName"
                :isSubmitting="isSubmitting"
                @submit="handleCommentSubmit"
                @cancel="cancelReply"
            />
        </div>

        <div class="main-right col-span-1 space-y-4">
            <PeopleYouMayKnow />
            <!-- <Trends /> -->
        </div>
    </div>
</template>

<script>
import axios from '../../stores/axios.js';
import PeopleYouMayKnow from '../../components/PeopleYouMayKnow.vue';
import Trends from '../../components/Trends.vue';
import CommentItem from '../../components/CommentItem.vue';
import FeedItem from '../../components/FeedItem.vue';
import CommentForm from '../../components/CommentForm.vue';

export default {
    name: 'PostView',

    components: {
        PeopleYouMayKnow,
        Trends,
        CommentItem,
        FeedItem,
        CommentForm
    },

    data() {
        return {
            post: {
                id: null,
                comments: []
            },
            replyingTo: null, // ID of comment being replied to
            replyingToName: '', // Name of user being replied to
            isSubmitting: false
        };
    },

    mounted() {
        this.getPost();
    },

    methods: {
        getPost() {
            axios
                .get(`/api/posts/${this.$route.params.id}/`)
                .then(response => {
                    console.log('Post data:', response.data.data);
                    this.post = response.data.data;
                })
                .catch(error => {
                    console.log('error', error);
                });
        },

        // Start replying to a comment
        startReply(data) {
            this.replyingTo = data.commentId;
            this.replyingToName = data.userName;
        },

        // Cancel replying
        cancelReply() {
            this.replyingTo = null;
            this.replyingToName = '';
        },

        // Handle comment submission (both top-level and replies)
        handleCommentSubmit(commentData) {
            this.isSubmitting = true;

            axios
                .post(`/api/comments/store`, commentData)
                .then(response => {
                    console.log('Comment data:', response.data);
                    
                    // Instead of manually adding the comment to the structure,
                    // refresh the entire post data to get the updated comments list
                    this.refreshPostData();
                    
                    // If this was a reply, reset the reply state
                    if (this.replyingTo) {
                        this.cancelReply();
                    }
                })
                .catch(error => {
                    console.log('error', error);
                })
                .finally(() => {
                    this.isSubmitting = false;
                });
        },

        // Refresh the post data to get the updated comments list
        refreshPostData() {
            axios
                .get(`/api/posts/${this.$route.params.id}/`)
                .then(response => {
                    console.log('Refreshed post data:', response.data.data);
                    this.post = response.data.data;
                })
                .catch(error => {
                    console.log('Error refreshing post data:', error);
                });
        },

        // Find a comment by ID in the nested structure
        findCommentById(commentId, comments = this.post.comments) {
            for (const comment of comments) {
                if (comment.id === commentId) {
                    return comment;
                }
                if (comment.children && comment.children.length > 0) {
                    const found = this.findCommentById(commentId, comment.children);
                    if (found) return found;
                }
            }
            return null;
        }
    }
};
</script>

