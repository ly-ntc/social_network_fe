<template>
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="main-left">
            <div class="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h1 class="mb-4 text-2xl font-bold text-gray-800">Change Password</h1>

                <p class="mb-6 text-gray-600">
                    Updating your password regularly helps keep your account secure. 
                    Choose a strong password that you don't use for other websites.
                </p>

                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-blue-700">
                                A strong password should include a mix of letters, numbers, and special characters.
                            </p>
                        </div>
                    </div>
                </div>

                <RouterLink 
                    to="/profile/edit" 
                    class="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Back to Profile Edit
                </RouterLink>
            </div>
        </div>

        <div class="main-right">
            <div class="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <form class="space-y-6" @submit.prevent="submitForm">
                    <!-- Current Password -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <div class="relative">
                            <input 
                                :type="showOldPassword ? 'text' : 'password'" 
                                v-model="form.old_password" 
                                placeholder="Enter your current password" 
                                class="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none pr-10"
                            >
                            <button 
                                type="button" 
                                @click="showOldPassword = !showOldPassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                <svg v-if="showOldPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- New Password -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div class="relative">
                            <input 
                                :type="showNewPassword ? 'text' : 'password'" 
                                v-model="form.new_password1" 
                                placeholder="Enter your new password" 
                                class="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none pr-10"
                                @input="checkPasswordStrength"
                            >
                            <button 
                                type="button" 
                                @click="showNewPassword = !showNewPassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Password Strength Indicator -->
                        <div v-if="form.new_password1" class="mt-2">
                            <div class="flex items-center space-x-2">
                                <div class="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        class="h-full rounded-full transition-all duration-300"
                                        :class="{
                                            'bg-red-500': passwordStrength === 'weak',
                                            'bg-yellow-500': passwordStrength === 'medium',
                                            'bg-green-500': passwordStrength === 'strong'
                                        }"
                                        :style="{ width: passwordStrengthPercent + '%' }"
                                    ></div>
                                </div>
                                <span class="text-xs font-medium" :class="{
                                    'text-red-500': passwordStrength === 'weak',
                                    'text-yellow-500': passwordStrength === 'medium',
                                    'text-green-500': passwordStrength === 'strong'
                                }">
                                    {{ passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1) }}
                                </span>
                            </div>
                            <div class="mt-1 text-xs text-gray-500">
                                <ul class="space-y-1">
                                    <li :class="{ 'text-green-500': form.new_password1.length >= 8 }">
                                        <span v-if="form.new_password1.length >= 8">✓</span>
                                        <span v-else>•</span>
                                        At least 8 characters
                                    </li>
                                    <li :class="{ 'text-green-500': /[A-Z]/.test(form.new_password1) }">
                                        <span v-if="/[A-Z]/.test(form.new_password1)">✓</span>
                                        <span v-else>•</span>
                                        At least one uppercase letter
                                    </li>
                                    <li :class="{ 'text-green-500': /[0-9]/.test(form.new_password1) }">
                                        <span v-if="/[0-9]/.test(form.new_password1)">✓</span>
                                        <span v-else>•</span>
                                        At least one number
                                    </li>
                                    <li :class="{ 'text-green-500': /[^A-Za-z0-9]/.test(form.new_password1) }">
                                        <span v-if="/[^A-Za-z0-9]/.test(form.new_password1)">✓</span>
                                        <span v-else>•</span>
                                        At least one special character
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Confirm Password -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div class="relative">
                            <input 
                                :type="showConfirmPassword ? 'text' : 'password'" 
                                v-model="form.new_password2" 
                                placeholder="Confirm your new password" 
                                class="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none pr-10"
                            >
                            <button 
                                type="button" 
                                @click="showConfirmPassword = !showConfirmPassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                </svg>
                            </button>
                        </div>
                        <div v-if="form.new_password1 && form.new_password2 && form.new_password1 !== form.new_password2" class="mt-1 text-xs text-red-500">
                            Passwords do not match
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
                            :disabled="isSubmitting || !isFormValid"
                            :class="{ 'opacity-50 cursor-not-allowed': isSubmitting || !isFormValid }"
                        >
                            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ isSubmitting ? 'Updating...' : 'Update Password' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { ref, computed } from 'vue'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

export default {
    setup() {
        const toastStore = useToastStore()
        const userStore = useUserStore()
        const router = useRouter()
        
        const showOldPassword = ref(false)
        const showNewPassword = ref(false)
        const showConfirmPassword = ref(false)
        const isSubmitting = ref(false)
        const passwordStrength = ref('weak')
        const passwordStrengthPercent = ref(0)

        const form = ref({
            old_password: '',
            new_password1: '',
            new_password2: '',
        })
        
        const errors = ref([])

        const isFormValid = computed(() => {
            return (
                form.value.old_password && 
                form.value.new_password1 && 
                form.value.new_password2 && 
                form.value.new_password1 === form.value.new_password2 &&
                passwordStrength.value !== 'weak'
            )
        })

        const checkPasswordStrength = () => {
            const password = form.value.new_password1
            
            if (!password) {
                passwordStrength.value = 'weak'
                passwordStrengthPercent.value = 0
                return
            }
            
            let score = 0
            
            // Length check
            if (password.length >= 8) score += 25
            
            // Uppercase check
            if (/[A-Z]/.test(password)) score += 25
            
            // Number check
            if (/[0-9]/.test(password)) score += 25
            
            // Special character check
            if (/[^A-Za-z0-9]/.test(password)) score += 25
            
            passwordStrengthPercent.value = score
            
            if (score < 50) {
                passwordStrength.value = 'weak'
            } else if (score < 75) {
                passwordStrength.value = 'medium'
            } else {
                passwordStrength.value = 'strong'
            }
        }

        const submitForm = async () => {
            errors.value = []

            // Validate passwords match
            if (form.value.new_password1 !== form.value.new_password2) {
                errors.value.push('The passwords do not match')
                return
            }
            
            // Validate password strength
            if (passwordStrength.value === 'weak') {
                errors.value.push('Please choose a stronger password')
                return
            }

            if (errors.value.length === 0) {
                isSubmitting.value = true
                
                try {
                    const formData = new FormData()
                    formData.append('old_password', form.value.old_password)
                    formData.append('new_password', form.value.new_password1)
                    // formData.append('new_password2', form.value.new_password2)

                    const response = await axios.post('/api/change-password/', formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": `Bearer ${userStore.user.access}`
                        }
                    })

                    if (response.data.success) {
                        toastStore.showToast(5000, 'Password updated successfully', 'bg-emerald-500')
                        router.push(`/profile/${userStore.user.id}`)
                    } else {
                        try {
                            const data = JSON.parse(response.data.message)
                            for (const key in data) {
                                errors.value.push(data[key][0].message)
                            }
                        } catch (e) {
                            errors.value.push('An error occurred. Please try again.')
                        }
                    }
                } catch (error) {
                    console.error('Error updating password:', error)
                    
                    if (error.response && error.response.data && error.response.data.message) {
                        errors.value.push(error.response.data.message)
                    } else {
                        errors.value.push('Failed to update password. Please try again.')
                    }
                } finally {
                    isSubmitting.value = false
                }
            }
        }

        return {
            toastStore,
            userStore,
            form,
            errors,
            showOldPassword,
            showNewPassword,
            showConfirmPassword,
            isSubmitting,
            passwordStrength,
            passwordStrengthPercent,
            isFormValid,
            checkPasswordStrength,
            submitForm
        }
    }
}
</script>

