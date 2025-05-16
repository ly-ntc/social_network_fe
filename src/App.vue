<template>
    <div class="min-h-screen flex flex-col bg-gray-50">
        <!-- Admin Layout -->
        <template v-if="this.userStore.user.role_id ==1">
            <div class="flex h-screen bg-gray-100">
                <!-- Sidebar -->
                <div class="bg-gray-800 text-white w-64 flex-shrink-0 hidden md:block">
                    <div class="flex items-center justify-center h-16 border-b border-gray-700">
                        <div class="text-xl font-bold text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2 text-purple-400" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Admin Panel
                        </div>
                    </div>
                    <nav class="mt-5 px-2">
                        <router-link to="/dashboard"
                            class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors"
                            :class="[$route.path === '/admin/dashboard' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                        </router-link>

                        <router-link to="/users"
                            class="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors"
                            :class="[$route.path === '/admin/users' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Users
                        </router-link>

                        <router-link to="/posts"
                            class="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors"
                            :class="[$route.path === '/admin/posts' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            Posts
                        </router-link>

                        <div class="pt-4 mt-4 border-t border-gray-700">
                            <button @click="handleLogout"
                                class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full text-left">
                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 h-6 w-6" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </nav>
                </div>

                <!-- Mobile sidebar -->
                <div class="md:hidden">
                    <div class="fixed inset-0 flex z-40" v-if="mobileMenuOpen">
                        <!-- Overlay -->
                        <div class="fixed inset-0" @click="mobileMenuOpen = false">
                            <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
                        </div>

                        <!-- Sidebar -->
                        <div class="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
                            <div class="absolute top-0 right-0 -mr-12 pt-2">
                                <button @click="mobileMenuOpen = false"
                                    class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span class="sr-only">Close sidebar</span>
                                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                <div class="flex-shrink-0 flex items-center px-4">
                                    <div class="text-xl font-bold text-white flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2 text-purple-400"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Admin Panel
                                    </div>
                                </div>
                                <nav class="mt-5 px-2 space-y-1">
                                    <router-link to="/admin/dashboard"
                                        class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors"
                                        :class="[$route.path === '/admin/dashboard' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']"
                                        @click="mobileMenuOpen = false">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 h-6 w-6" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Dashboard
                                    </router-link>

                                    <router-link to="/admin/users"
                                        class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors"
                                        :class="[$route.path === '/admin/users' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']"
                                        @click="mobileMenuOpen = false">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 h-6 w-6" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        Users
                                    </router-link>

                                    <router-link to="/admin/posts"
                                        class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors"
                                        :class="[$route.path === '/admin/posts' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']"
                                        @click="mobileMenuOpen = false">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 h-6 w-6" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                        </svg>
                                        Posts
                                    </router-link>

                                    <div class="pt-4 mt-4 border-t border-gray-700">
                                        <button @click="handleLogout"
                                            class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full text-left">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 h-6 w-6" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="flex-1 flex flex-col overflow-hidden">
                    <!-- Header -->
                    <header class="bg-white shadow">
                        <div class="flex justify-between items-center px-4 py-4 sm:px-6 lg:px-8">
                            <div class="flex items-center">
                                <!-- Mobile menu button -->
                                <button @click="mobileMenuOpen = !mobileMenuOpen"
                                    class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500">
                                    <span class="sr-only">Open sidebar</span>
                                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>

                                <h1 class="text-xl font-semibold text-gray-900 md:ml-0 ml-4">{{ getAdminPageTitle() }}
                                </h1>
                            </div>

                            <div class="flex items-center">
                                <!-- User dropdown -->
                                <div class="ml-3 relative">
                                    <div>
                                        <button @click="isUserMenuOpen = !isUserMenuOpen"
                                            class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                            <span class="sr-only">Open user menu</span>
                                            <img class="h-8 w-8 rounded-full object-cover"
                                                :src="userStore.user.avatar || 'https://ui-avatars.com/api/?name=Admin&background=6366F1&color=fff'"
                                                alt="User avatar" />
                                        </button>
                                    </div>

                                    <div v-if="isUserMenuOpen"
                                        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                                        v-click-outside="() => isUserMenuOpen = false">
                                        <div class="block px-4 py-2 text-xs text-gray-400">
                                            {{ userStore.user.name || 'Admin' }}
                                        </div>
                                        <router-link :to="{ name: 'profile', params: { id: userStore.user.id } }"
                                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            @click="isUserMenuOpen = false">
                                            Your Profile
                                        </router-link>
                                        <router-link to="/"
                                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            @click="isUserMenuOpen = false">
                                            Back to Site
                                        </router-link>
                                        <button @click="handleLogout"
                                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <!-- Main Content Area -->
                    <main class="flex-1 overflow-y-auto p-4 md:p-6">
                        <RouterView />
                    </main>
                </div>
            </div>
        </template>

        <!-- User Layout -->
        <template v-else>
            <!-- Navigation -->
            <nav class="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        <!-- Logo -->
                        <div class="flex-shrink-0 flex items-center">
                            <RouterLink to="/" class="flex items-center">
                                <img src="/logo.svg" alt="Wey Logo" class="h-8 w-auto" />
                                <span class="ml-2 text-xl font-bold text-purple-800">Wey</span>
                            </RouterLink>
                        </div>

                        <!-- Center Navigation -->
                        <div class="hidden md:flex items-center justify-center space-x-8"
                            v-if="userStore.user.isAuthenticated">
                            <RouterLink to="/feed" class="nav-link"
                                :class="{ 'nav-link-active': $route.path === '/feed' || $route.path === '/' }">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                            </RouterLink>

                            <RouterLink to="/chat" class="nav-link"
                                :class="{ 'nav-link-active': $route.path.includes('/chat') }">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z">
                                    </path>
                                </svg>
                            </RouterLink>

                            <RouterLink to="/notifications" class="nav-link relative"
                                :class="{ 'nav-link-active': $route.path.includes('/notifications') }">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0">
                                    </path>
                                </svg>

                                <span v-if="unreadNotificationsCount > 0"
                                    class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                    {{ unreadNotificationsCount }}
                                </span>
                            </RouterLink>

                            <RouterLink to="/search" class="nav-link"
                                :class="{ 'nav-link-active': $route.path.includes('/search') }">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z">
                                    </path>
                                </svg>
                            </RouterLink>
                        </div>

                        <!-- Right Side - User Profile or Auth Buttons -->
                        <div class="flex items-center">
                            <template v-if="userStore.user.isAuthenticated && userStore.user.id">
                                <!-- Admin Dashboard Link for Admin Users -->
                                <RouterLink v-if="userStore.isAdmin" to="/admin/dashboard"
                                    class="mr-4 px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors">
                                    Admin
                                </RouterLink>

                                <RouterLink :to="{ name: 'profile', params: { 'id': userStore.user.id } }"
                                    class="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    :class="{ 'ring-2 ring-purple-500 ring-offset-2': $route.name === 'profile' && $route.params.id === userStore.user.id }">
                                    <img :src="userStore.user.avatar" class="w-10 h-10 rounded-full object-cover"
                                        alt="Profile" />
                                </RouterLink>
                            </template>

                            <template v-else>
                                <div class="flex items-center space-x-3">
                                    <RouterLink to="/login"
                                        class="px-5 py-2 rounded-md border border-gray-200 text-gray-700 font-medium hover:border-purple-300 hover:text-purple-700 transition-colors"
                                        :class="{ 'border-purple-300 text-purple-700': $route.path === '/login' }">
                                        Log in
                                    </RouterLink>
                                    <RouterLink to="/signup"
                                        class="px-5 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors"
                                        :class="{ 'bg-purple-700': $route.path === '/signup' }">
                                        Sign up
                                    </RouterLink>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Mobile Navigation -->
                <div class="md:hidden border-t border-gray-200" v-if="userStore.user.isAuthenticated">
                    <div class="flex justify-around py-2">
                        <RouterLink to="/feed" class="mobile-nav-link"
                            :class="{ 'mobile-nav-link-active': $route.path === '/feed' || $route.path === '/' }">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                        </RouterLink>

                        <RouterLink to="/chat" class="mobile-nav-link"
                            :class="{ 'mobile-nav-link-active': $route.path.includes('/chat') }">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z">
                                </path>
                            </svg>
                        </RouterLink>

                        <RouterLink to="/notifications" class="mobile-nav-link relative"
                            :class="{ 'mobile-nav-link-active': $route.path.includes('/notifications') }">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0">
                                </path>
                            </svg>

                            <span v-if="unreadNotificationsCount > 0"
                                class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                {{ unreadNotificationsCount }}
                            </span>
                        </RouterLink>

                        <RouterLink to="/search" class="mobile-nav-link"
                            :class="{ 'mobile-nav-link-active': $route.path.includes('/search') }">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z">
                                </path>
                            </svg>
                        </RouterLink>
                    </div>
                </div>
            </nav>

            <!-- Main Content -->
            <main class="flex-grow">
                <RouterView />
            </main>
        </template>

        <Toast />
    </div>
</template>

<script>
import axios from 'axios'
import Toast from '@/components/Toast.vue'
import { useUserStore } from '@/stores/user'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
    components: {
        Toast
    },

    data() {
        return {
            unreadNotificationsCount: 0,
            notificationInterval: null,
            mobileMenuOpen: false,
            isUserMenuOpen: false
        }
    },

    created() {
        this.userStore = useUserStore();
        this.userStore.initStore();

        const token = this.userStore.user.access;
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        } else {
            axios.defaults.headers.common["Authorization"] = "";
        }

        // Fetch unread notifications count when app is created
        // this.fetchUnreadNotificationsCount();

        // Set up interval to periodically check for new notifications (every 30 seconds)
        // this.notificationInterval = setInterval(() => {
        //     this.fetchUnreadNotificationsCount();
        // }, 30000);
    },

    beforeUnmount() {
        // Clear the interval when component is unmounted
        if (this.notificationInterval) {
            clearInterval(this.notificationInterval);
        }
    },

    methods: {
        fetchUnreadNotificationsCount() {
            // Only fetch if user is authenticated
            if (this.userStore.user.isAuthenticated) {
                axios
                    .get('/api/notifications/count/')
                    .then(response => {
                        console.log('Notification count response:', response.data);
                        this.unreadNotificationsCount = response.data.count;
                    })
                    .catch(error => {
                        console.error('Error fetching unread notifications count:', error);
                    });
            }
        },

        handleLogout() {
            // Call logout API
            axios.post('/api/logout')
                .then(() => {
                    // Clear user data
                    this.userStore.removeToken();
                    // Redirect to login page
                    this.$router.push('/');
                })
                .catch(error => {
                    console.error('Logout error:', error);
                });
        },

        getAdminPageTitle() {
            const path = this.$route.path;
            if (path.includes('/dashboard')) return 'Dashboard';
            if (path.includes('/users')) return 'User Management';
            if (path.includes('/posts')) return 'Post Management';
            return 'Admin Panel';
        }
    },

    setup() {
        const userStore = useUserStore();
        const route = useRoute();

        // Check if current route is an admin route
        const isAdminRoute = computed(() => {
            return route.path.startsWith('/admin');
        });

        return {
            userStore,
            isAdminRoute
        };
    },

    directives: {
        'click-outside': {
            mounted(el, binding) {
                el.clickOutsideEvent = (event) => {
                    if (!(el === event.target || el.contains(event.target))) {
                        binding.value(event);
                    }
                };
                document.addEventListener('click', el.clickOutsideEvent);
            },
            unmounted(el) {
                document.removeEventListener('click', el.clickOutsideEvent);
            }
        }
    }
}
</script>

<style>
/* Base styles */
body {
    @apply antialiased text-gray-800;
}

/* Navigation link styles */
.nav-link {
    @apply p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all;
}

.nav-link-active {
    @apply text-purple-600 bg-purple-50;
}

.mobile-nav-link {
    @apply p-3 rounded-lg text-gray-500 hover:text-purple-600 transition-all;
}

.mobile-nav-link-active {
    @apply text-purple-600;
}

/* Remove default background from RouterView */
main {
    @apply bg-gray-50;
}

/* For pages that need white background */
.page-white {
    @apply bg-white rounded-lg shadow-sm p-6;
}
</style>