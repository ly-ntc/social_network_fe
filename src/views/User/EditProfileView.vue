<template>
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="main-left">
            <div class="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h1 class="mb-4 text-2xl font-bold text-gray-800">Edit Profile</h1>

                <p class="mb-6 text-gray-600">
                    Update your personal information and how others see you on the platform.
                    Your profile helps others connect with you and learn more about you.
                </p>

                <div class="flex flex-col space-y-3">
                    <RouterLink 
                        to="/profile/edit/password" 
                        class="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Change Password
                    </RouterLink>
                    
                    <RouterLink 
                        :to="{ name: 'profile', params: { id: userStore.user.id }}" 
                        class="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Your Profile
                    </RouterLink>
                </div>
            </div>
        </div>

        <div class="main-right">
            <div class="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <form class="space-y-6" @submit.prevent="submitForm">
                    <!-- Avatar Upload Section -->
                    <div class="flex flex-col items-center space-y-4">
                        <div class="relative group">
                            <img 
                                :src="avatarPreview || userStore.user.avatar || '/placeholder.svg?height=120&width=120'" 
                                class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                alt="Profile Avatar"
                            />
                            <div 
                                class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                @click="triggerFileInput"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                        <input 
                            type="file" 
                            ref="fileInput" 
                            @change="handleFileUpload" 
                            accept="image/*" 
                            class="hidden"
                        />
                        <button 
                            type="button" 
                            @click="triggerFileInput" 
                            class="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                        >
                            Change Profile Picture
                        </button>
                        <div v-if="isUploading" class="flex items-center space-x-2">
                            <svg class="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span class="text-sm text-gray-600">Uploading...</span>
                        </div>
                    </div>

                    <!-- Personal Information -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                v-model="form.name" 
                                placeholder="Your full name" 
                                class="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                            >
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                v-model="form.email" 
                                disabled
                                placeholder="Your email address" 
                                class="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                            >
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input 
                                type="date" 
                                v-model="form.dateOfBirth" 
                                class="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                            >
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select 
                                v-model="form.gender" 
                                class="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>


                    <!-- Error Messages -->
                    <div v-if="errors.length > 0" class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                        <p class="font-medium mb-1">Please correct the following errors:</p>
                        <ul class="list-disc pl-5">
                            <li v-for="(error, index) in errors" :key="index" class="text-sm">
                                {{ error }}
                            </li>
                        </ul>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-end">
                        <button 
                            type="submit" 
                            class="py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center"
                            :disabled="isSubmitting"
                        >
                            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../../stores/axios.js';
import { ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'

export default {
    setup() {
        const toastStore = useToastStore()
        const userStore = useUserStore()
        const fileInput = ref(null)
        const avatarPreview = ref(null)
        const isUploading = ref(false)
        const isSubmitting = ref(false)

        return {
            toastStore,
            userStore,
            fileInput,
            avatarPreview,
            isUploading,
            isSubmitting
        }
    },

    data() {
        return {
            form: {
                email: this.userStore.user.email || '',
                name: this.userStore.user.name || '',
                dateOfBirth: this.userStore.user.date_of_birth || '',
                gender: this.userStore.user.gender || '',
                avatarUrl: this.userStore.user.avatar || ''
            },
            errors: [],
        }
    },

    methods: {
        triggerFileInput() {
            this.fileInput.focus()
            this.fileInput.click()
        },

        handleFileUpload(event) {
            const file = event.target.files[0]
            if (!file) return

            // Create a preview
            this.avatarPreview = URL.createObjectURL(file)

            // Upload the file immediately
            this.uploadAvatar(file)
        },

        async uploadAvatar(file) {
            this.isUploading = true
            
            try {
                const formData = new FormData()
                formData.append('file', file)

                const response = await axios.post('/api/upload/', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })

                // Store the uploaded avatar URL
                this.form.avatarUrl = response.data.file_url
                this.toastStore.showToast(3000, 'Profile picture uploaded successfully', 'bg-emerald-500')
            } catch (error) {
                console.error('Error uploading avatar:', error)
                this.toastStore.showToast(5000, 'Failed to upload profile picture. Please try again.', 'bg-red-500')
                
                // Reset the preview if upload fails
                this.avatarPreview = null
            } finally {
                this.isUploading = false
            }
        },

        submitForm() {
            this.errors = []

            // Validate required fields
            if (!this.form.email) {
                this.errors.push('Email address is required')
            }

            if (!this.form.name) {
                this.errors.push('Full name is required')
            }

            if (this.errors.length === 0) {
                this.isSubmitting = true
                
                // Prepare form data for submission
                const formData = {
                    name: this.form.name,
                    email: this.form.email,
                    date_of_birth: this.form.dateOfBirth,
                    gender: this.form.gender,
                    avatar: this.form.avatarUrl
                }

                axios
                    .put(`/api/${this.userStore.user.id}/`, formData)
                    .then(response => {
                        if (response.data.success) {
                            console.log('Profile updated successfully:', response.data.data)
                            this.toastStore.showToast(5000, 'Profile updated successfully', 'bg-emerald-500')

                            // Update user store with new information
                            this.userStore.setUserInfo({
                                id: this.userStore.user.id,
                                name: this.form.name,
                                email: this.form.email,
                                avatar: this.form.avatarUrl || response.data.user.get_avatar,
                                role_id: this.userStore.user.role_id,
                            })
                        
                            // Redirect to profile page
                            this.$router.push({ name: 'profile', params: { id: this.userStore.user.id } })
                        } else {
                            this.toastStore.showToast(5000, `${response.data.message}. Please try again`, 'bg-red-500')
                        }
                    })
                    .catch(error => {
                        console.error('Error updating profile:', error)
                        this.toastStore.showToast(5000, 'Failed to update profile. Please try again.', 'bg-red-500')
                    })
                    .finally(() => {
                        this.isSubmitting = false
                    })
            }
        }
    }
}
</script>

