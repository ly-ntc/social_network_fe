<template>
    <div
        class="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <!-- Main Content -->
        <main class="flex-grow flex items-center justify-center">
            <div class="max-w-md w-full">
                <!-- Reset Password Card -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div class="p-8">
                        <div class="text-center mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">Reset your password</h2>
                            <p class="text-gray-600 mt-2">
                                Create a new password for your account
                            </p>
                        </div>

                        <form @submit.prevent="submitForm" class="space-y-5">
                            <div>
                                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">New
                                    password</label>
                                <div class="relative">
                                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Enter new password" required />
                                    <button type="button" @click="showPassword = !showPassword"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                                        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fill-rule="evenodd"
                                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                                clip-rule="evenodd" />
                                            <path
                                                d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                        </svg>
                                    </button>
                                </div>
                                <div class="mt-1">
                                    <div class="text-xs text-gray-500">Password must contain:</div>
                                    <ul class="text-xs text-gray-500 mt-1 space-y-1 pl-5 list-disc">
                                        <li :class="{ 'text-green-500': passwordLength }">At least 8 characters</li>
                                        <li :class="{ 'text-green-500': passwordUppercase }">At least one uppercase letter
                                        </li>
                                        <li :class="{ 'text-green-500': passwordLowercase }">At least one lowercase letter
                                        </li>
                                        <li :class="{ 'text-green-500': passwordNumber }">At least one number</li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <label for="confirmPassword"
                                    class="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
                                <div class="relative">
                                    <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword"
                                        v-model="confirmPassword"
                                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Confirm new password" required />
                                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                                        <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg"
                                            class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fill-rule="evenodd"
                                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                                clip-rule="evenodd" />
                                            <path
                                                d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                        </svg>
                                    </button>
                                </div>
                                <div v-if="password && confirmPassword && password !== confirmPassword"
                                    class="mt-1 text-xs text-red-500">
                                    Passwords do not match
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
                                    :disabled="isSubmitting || !isPasswordValid || !doPasswordsMatch">
                                    <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    {{ isSubmitting ? 'Updating...' : 'Reset password' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import axios from 'axios'

export default {
    setup() {
        const router = useRouter()
        const toastStore = useToastStore()
        const password = ref('')
        const confirmPassword = ref('')
        const showPassword = ref(false)
        const showConfirmPassword = ref(false)
        const isSubmitting = ref(false)
        const errors = ref([])
        const email = ref(localStorage.getItem('resetEmail') || '')

        // Password validation
        const passwordLength = computed(() => password.value.length >= 8)
        const passwordUppercase = computed(() => /[A-Z]/.test(password.value))
        const passwordLowercase = computed(() => /[a-z]/.test(password.value))
        const passwordNumber = computed(() => /[0-9]/.test(password.value))

        const isPasswordValid = computed(() =>
            passwordLength.value &&
            passwordUppercase.value &&
            passwordLowercase.value &&
            passwordNumber.value
        )

        const doPasswordsMatch = computed(() =>
            password.value && confirmPassword.value && password.value === confirmPassword.value
        )

        const submitForm = async () => {
            errors.value = []

            if (!isPasswordValid.value) {
                errors.value.push('Password does not meet the requirements')
                return
            }

            if (!doPasswordsMatch.value) {
                errors.value.push('Passwords do not match')
                return
            }


            isSubmitting.value = true

            try {
                await axios.post('/api/reset-password/', {
                    email: email.value,
                    new_password: password.value
                })

                // Clear stored data
                localStorage.removeItem('resetEmail')

                toastStore.showToast(5000, 'Password reset successful! You can now log in with your new password.', 'bg-emerald-500')
                router.push('/')
            } catch (error) {
                console.error('Error:', error)

                if (error.response && error.response.data.message) {
                    errors.value.push(error.response.data.message)
                } else {
                    errors.value.push('Failed to reset password. Please try again.')
                }

                toastStore.showToast(5000, 'Failed to reset password', 'bg-red-500')
            } finally {
                isSubmitting.value = false
            }
        }

        return {
            password,
            confirmPassword,
            showPassword,
            showConfirmPassword,
            isSubmitting,
            errors,
            passwordLength,
            passwordUppercase,
            passwordLowercase,
            passwordNumber,
            isPasswordValid,
            doPasswordsMatch,
            submitForm
        }
    }
}
</script>