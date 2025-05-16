<template>
    <div
        class="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <!-- Main Content -->
        <main class="flex-grow flex items-center justify-center">
            <div class="max-w-md w-full">
                <!-- Forgot Password Card -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div class="p-8">
                        <div class="text-center mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">Forgot your password?</h2>
                            <p class="text-gray-600 mt-2">
                                Enter your email address and we'll send you a verification code to reset your password.
                            </p>
                        </div>

                        <form @submit.prevent="submitForm" class="space-y-5">
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email
                                    address</label>
                                <input type="email" id="email" v-model="email"
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Enter your email" required />
                            </div>

                            <div v-if="errors.length > 0"
                                class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                                <p class="font-medium mb-1">Please correct the following errors:</p>
                                <ul class="list-disc pl-5">
                                    <li v-for="(error, index) in errors" :key="index" class="text-sm">
                                        {{ error }}
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <button type="submit"
                                    class="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                                    :disabled="isSubmitting">
                                    <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    {{ isSubmitting ? 'Sending...' : 'Send verification code' }}
                                </button>
                            </div>
                        </form>

                        <div class="mt-6 text-center">
                            <RouterLink to="/"
                                class="text-sm text-purple-600 hover:text-purple-800 transition-colors">
                                Back to login
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import axios from 'axios'

export default {
    setup() {
        const router = useRouter()
        const toastStore = useToastStore()
        const email = ref('')
        const isSubmitting = ref(false)
        const errors = ref([])

        const submitForm = async () => {
            errors.value = []

            if (!email.value) {
                errors.value.push('Email address is required')
                return
            }

            isSubmitting.value = true

            try {
                const response = await axios.post('/api/forgot-password', {
                    email: email.value
                })

                // Store email in localStorage to use in OTP verification
                localStorage.setItem('resetEmail', email.value)

                toastStore.showToast(5000, 'Verification code sent to your email!', 'bg-emerald-500')
                router.push('/verify-otp-password')
            } catch (error) {
                console.error('Error:', error)

                if (error.response && error.response.data.message) {
                    errors.value.push(error.response.data.message)
                } else {
                    errors.value.push('Failed to send verification code. Please try again.')
                }

                toastStore.showToast(5000, 'Failed to send verification code', 'bg-red-500')
            } finally {
                isSubmitting.value = false
            }
        }

        return {
            email,
            isSubmitting,
            errors,
            submitForm
        }
    }
}
</script>