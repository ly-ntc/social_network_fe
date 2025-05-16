<template>
    <div
        class="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <!-- Main Content -->
        <main class="flex-grow flex items-center justify-center">
            <div class="max-w-md w-full">
                <!-- OTP Verification Card -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div class="p-8">
                        <div class="text-center mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">Verify your account</h2>
                            <p class="text-gray-600 mt-2">
                                We've sent a verification code to <span class="font-medium">{{ maskedEmail }}</span>
                            </p>
                        </div>

                        <form @submit.prevent="submitForm" class="space-y-5">
                            <div>
                                <label for="otp" class="block text-sm font-medium text-gray-700 mb-1">Verification
                                    code</label>
                                <div class="flex justify-center gap-2">
                                    <input v-for="(digit, index) in otpDigits" :key="index" type="text" maxlength="1"
                                        v-model="otpDigits[index]" @input="onOtpInput($event, index)"
                                        @keydown="onOtpKeyDown($event, index)"
                                        class="w-12 h-12 text-center text-xl font-bold px-0 py-0 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                        required />
                                </div>
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
                                    :disabled="isSubmitting || !isOtpComplete">
                                    <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    {{ isSubmitting ? 'Verifying...' : 'Verify account' }}
                                </button>
                            </div>
                        </form>

                        <div class="mt-6 text-center space-y-3">
                            <p class="text-gray-600 text-sm">
                                Didn't receive the code?
                                <button @click="resendCode"
                                    class="text-purple-600 hover:text-purple-800 transition-colors font-medium"
                                    :disabled="resendCountdown > 0">
                                    {{ resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend code' }}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import axios from 'axios'

export default {
    setup() {
        const router = useRouter()
        const route = useRoute()
        const toastStore = useToastStore()
        const userStore = useUserStore()
        const otpDigits = ref(['', '', '', '', '', ''])
        const isSubmitting = ref(false)
        const errors = ref([])
        const resendCountdown = ref(0)
        let countdownInterval = null

        // Lấy email từ query params hoặc localStorage
        const email = ref('')

        onMounted(() => {
            // Ưu tiên lấy email từ query params
            if (route.query.email) {
                email.value = route.query.email
                // Lưu vào localStorage để dự phòng
                localStorage.setItem('signupEmail', route.query.email)
            } else {
                // Nếu không có trong query, thử lấy từ localStorage
                const storedEmail = localStorage.getItem('signupEmail')
                if (storedEmail) {
                    email.value = storedEmail
                } else {
                    // Nếu không có email, chuyển hướng về trang đăng ký
                    toastStore.showToast(5000, 'Please complete the registration form first', 'bg-red-500')
                    router.push('/signup')
                }
            }

            startResendCountdown()
        })

        const maskedEmail = computed(() => {
            if (!email.value) return ''

            const parts = email.value.split('@')
            if (parts.length !== 2) return email.value

            const username = parts[0]
            const domain = parts[1]

            const maskedUsername = username.substring(0, 2) +
                '*'.repeat(Math.max(username.length - 4, 0)) +
                (username.length > 2 ? username.substring(username.length - 2) : '')

            return `${maskedUsername}@${domain}`
        })

        const isOtpComplete = computed(() => {
            return otpDigits.value.every(digit => digit !== '')
        })

        const onOtpInput = (event, index) => {
            // Move to next input if current input is filled
            if (event.target.value && index < otpDigits.value.length - 1) {
                const nextInput = event.target.nextElementSibling
                if (nextInput) {
                    nextInput.focus()
                }
            }
        }

        const onOtpKeyDown = (event, index) => {
            // Move to previous input on backspace if current input is empty
            if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
                const prevInput = event.target.previousElementSibling
                if (prevInput) {
                    prevInput.focus()
                }
            }
        }

        const startResendCountdown = () => {
            resendCountdown.value = 60
            countdownInterval = setInterval(() => {
                if (resendCountdown.value > 0) {
                    resendCountdown.value--
                } else {
                    clearInterval(countdownInterval)
                }
            }, 1000)
        }

        const resendCode = async () => {
            if (resendCountdown.value > 0 || !email.value) return

            try {
                await axios.post('/api/resend-otp/', {
                    email: email.value
                })

                toastStore.showToast(5000, 'Verification code resent to your email!', 'bg-emerald-500')
                startResendCountdown()
            } catch (error) {
                console.error('Error:', error)
                toastStore.showToast(5000, 'Failed to resend verification code', 'bg-red-500')
            }
        }

        const submitForm = async () => {
            errors.value = []

            if (!isOtpComplete.value) {
                errors.value.push('Please enter the complete verification code')
                return
            }

            if (!email.value) {
                errors.value.push('Email address is missing. Please go back to the signup page.')
                return
            }

            isSubmitting.value = true
            const otp = otpDigits.value.join('')

            try {
                const response = await axios.post('/api/verify-otp/', {
                    email: email.value,
                    otp: otp
                })

                // Clear stored email
                localStorage.removeItem('signupEmail')

                toastStore.showToast(5000, 'Account verified successfully!', 'bg-emerald-500')

                // If the API returns user data and token, log the user in
            
                    router.push('/')
            } catch (error) {
                console.error('Error:', error)

                if (error.response && error.response.data.message) {
                    errors.value.push(error.response.data.message)
                } else {
                    errors.value.push('Invalid verification code. Please try again.')
                }

                toastStore.showToast(5000, 'Verification failed', 'bg-red-500')
            } finally {
                isSubmitting.value = false
            }
        }

        onUnmounted(() => {
            if (countdownInterval) {
                clearInterval(countdownInterval)
            }
        })

        return {
            otpDigits,
            isSubmitting,
            errors,
            maskedEmail,
            isOtpComplete,
            resendCountdown,
            onOtpInput,
            onOtpKeyDown,
            resendCode,
            submitForm
        }
    }
}
</script>