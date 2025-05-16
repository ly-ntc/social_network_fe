<template>
    <div
        class="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <!-- Main Content -->
        <main class="flex-grow flex items-center justify-center">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
                <!-- Left Column - Welcome Message -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div class="p-8 flex flex-col h-full">
                        <div class="flex-grow">
                            <h2 class="text-3xl font-bold text-gray-800 mb-6">Join our community!</h2>
                            <p class="text-gray-600 mb-4">
                                Sign up to connect with friends, share your moments, and discover content tailored just
                                for you.
                            </p>
                            <p class="text-gray-600 mb-8">
                                Create an account to unlock all features and become part of our growing community.
                            </p>
                        </div>
                        <div class="mt-auto">
                            <p class="text-gray-700">
                                Already have an account?
                                <RouterLink to="/login"
                                    class="text-purple-600 font-medium hover:text-purple-800 transition-colors">
                                    Log in here
                                </RouterLink>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Signup Form -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div class="p-8">
                        <h2 class="text-2xl font-bold text-gray-800 mb-6">Create your account</h2>
                        <form @submit.prevent="submitForm" class="space-y-5">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                                <input type="text" id="name" v-model="form.name"
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Enter your full name" required />
                            </div>

                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email
                                    address</label>
                                <input type="email" id="email" v-model="form.email"
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Enter your email" required />
                            </div>

                            <div>
                                <label for="password1"
                                    class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div class="relative">
                                    <input :type="showPassword1 ? 'text' : 'password'" id="password1"
                                        v-model="form.password1"
                                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Create a password" required />
                                    <button type="button" @click="showPassword1 = !showPassword1"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                                        <svg v-if="showPassword1" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
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
                            </div>

                            <div>
                                <label for="password2" class="block text-sm font-medium text-gray-700 mb-1">Confirm
                                    password</label>
                                <div class="relative">
                                    <input :type="showPassword2 ? 'text' : 'password'" id="password2"
                                        v-model="form.password2"
                                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Confirm your password" required />
                                    <button type="button" @click="showPassword2 = !showPassword2"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                                        <svg v-if="showPassword2" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
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
                                    {{ isSubmitting ? 'Creating account...' : 'Sign up' }}
                                </button>
                            </div>
                        </form>

                        <div class="mt-8">
                            <div class="relative">
                                <div class="absolute inset-0 flex items-center">
                                    <div class="w-full border-t border-gray-300"></div>
                                </div>
                                <div class="relative flex justify-center text-sm">
                                    <span class="px-2 bg-white text-gray-500">Or sign up with</span>
                                </div>
                            </div>

                            <div class="mt-6 grid grid-cols-2 gap-3">
                                <button type="button"
                                    class="w-full py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center">
                                    <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4" />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853" />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05" />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335" />
                                    </svg>
                                    Google
                                </button>
                                <button type="button"
                                    class="w-full py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center">
                                    <svg class="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'

export default {
    setup() {
        const router = useRouter()
        const toastStore = useToastStore()
        const isSubmitting = ref(false)
        const showPassword1 = ref(false)
        const showPassword2 = ref(false)
        const errors = ref([])
        const form = ref({
            email: '',
            name: '',
            password1: '',
            password2: ''
        })

        const submitForm = async () => {
            errors.value = []

            if (!form.value.email) {
                errors.value.push('Email address is required')
            }

            if (!form.value.name) {
                errors.value.push('Full name is required')
            }

            if (!form.value.password1) {
                errors.value.push('Password is required')
            }

            if (form.value.password1 !== form.value.password2) {
                errors.value.push('Passwords do not match')
            }

            if (errors.value.length === 0) {
                isSubmitting.value = true

                try {
                    const response = await axios.post('/api/register', {
                        email: form.value.email,
                        name: form.value.name,
                        password: form.value.password1
                    })

                    if (response.data.success === true) {
                        
                        localStorage.setItem('signupEmail', form.value.email)

                        toastStore.showToast(5000, 'Account created successfully! Please verify your email.', 'bg-emerald-500')

                       
                        router.push({
                            path: '/verify-otp-signup',
                            query: { email: form.value.email }
                        })
                    } else {
                        const data = JSON.parse(response.data.message)
                        for (const key in data) {
                            errors.value.push(data[key][0].message)
                        }

                        toastStore.showToast(5000, 'Something went wrong. Please try again', 'bg-red-500')
                    }
                } catch (error) {
                    console.error('Error:', error)
                    errors.value.push('An error occurred. Please try again later.')
                    toastStore.showToast(5000, 'An error occurred. Please try again later.', 'bg-red-500')
                } finally {
                    isSubmitting.value = false
                }
            }
        }

        return {
            form,
            errors,
            isSubmitting,
            showPassword1,
            showPassword2,
            submitForm
        }
    }
}
</script>