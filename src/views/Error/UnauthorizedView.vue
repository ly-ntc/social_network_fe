<template>
    <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 class="text-6xl font-bold text-red-500 mb-4">401</h1>
        <p class="text-xl text-gray-700 mb-6">You are not authorized to access this page.</p>
        <router-link to="/dashboard" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Go to Home
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'UnauthorizedView'
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>