<template>
    <div>
        <!-- Filters and Search -->
        <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex flex-col sm:flex-row gap-3">
                <!-- Search -->
                <div class="relative">
                    <input type="text" v-model="searchQuery" :placeholder="`Search ${title.toLowerCase()}...`"
                        class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none w-full sm:w-64"
                        @input="debounceSearch" />
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <!-- Custom Filters -->
                <div v-for="(filter, index) in filters" :key="`filter-${index}`" class="relative">
                    <select v-model="activeFilters[filter.key]"
                        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                        @change="fetchData">
                        <option value="">{{ filter.placeholder }}</option>
                        <option v-for="option in filter.options" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Add Button -->
            <button v-if="showAddButton"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                @click="$emit('add')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add {{ addButtonText }}
            </button>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th v-for="column in columns" :key="column.key" scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                :class="{ 'cursor-pointer hover:bg-gray-100': column.sortable }"
                                @click="column.sortable ? handleSort(column.key) : null">
                                <div class="flex items-center">
                                    {{ column.label }}
                                    <span v-if="column.sortable" class="ml-1">
                                        <svg v-if="sortField === column.key && sortDirection === 'asc'"
                                            xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 15l7-7 7 7" />
                                        </svg>
                                        <svg v-else-if="sortField === column.key && sortDirection === 'desc'"
                                            xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                        </svg>
                                    </span>
                                </div>
                            </th>
                            <th v-if="actions.length > 0" scope="col"
                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="loading">
                            <td :colspan="actions.length > 0 ? columns.length + 1 : columns.length"
                                class="px-6 py-12 text-center">
                                <div class="flex justify-center">
                                    <div
                                        class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="data.length === 0">
                            <td :colspan="actions.length > 0 ? columns.length + 1 : columns.length"
                                class="px-6 py-12 text-center text-gray-500">
                                No data found matching your criteria
                            </td>
                        </tr>
                        <tr v-for="item in data" :key="item.id" class="hover:bg-gray-50">
                            <td v-for="column in columns" :key="`${item.id}-${column.key}`"
                                class="px-6 py-4 whitespace-nowrap">
                                <!-- Custom render function for column -->
                                <slot :name="`column-${column.key}`" :item="item"
                                    :value="getItemValue(item, column.key)">
                                    <!-- Default rendering based on column type -->
                                    <div v-if="column.type === 'image'" class="flex items-center">
                                        <div class="flex-shrink-0 h-10 w-10">
                                            <img class="h-10 w-10 rounded-full object-cover"
                                                :src="getItemValue(item, column.key)" alt="" />
                                        </div>
                                        <div v-if="column.subText" class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">{{ getItemValue(item,
                                                column.subText) }}</div>
                                            <div class="text-sm text-gray-500">ID: {{ item.id }}</div>
                                        </div>
                                    </div>
                                    <div v-else-if="column.type === 'badge'" class="inline-flex">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                            :class="getBadgeClasses(column, getItemValue(item, column.key))">
                                            {{ getItemValue(item, column.key) }}
                                        </span>
                                    </div>
                                    <div v-else-if="column.type === 'date'" class="text-sm text-gray-500">
                                        {{ formatDate(getItemValue(item, column.key)) }}
                                    </div>
                                    <div v-else class="text-sm text-gray-900">
                                        {{ getItemValue(item, column.key) }}
                                    </div>
                                </slot>
                            </td>
                            <td v-if="actions.length > 0"
                                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button v-for="action in actions" :key="action.name"
                                        @click="handleAction(action.name, item)" class="p-1 rounded-full"
                                        :class="action.buttonClasses" :title="action.label">
                                        <component :is="action.icon" class="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                        Previous
                    </button>
                    <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                        Next
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            Showing
                            <span class="font-medium">{{ paginationStart }}</span>
                            to
                            <span class="font-medium">{{ paginationEnd }}</span>
                            of
                            <span class="font-medium">{{ totalItems }}</span>
                            results
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                                <span class="sr-only">Previous</span>
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                    fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                            <button v-for="page in displayedPages" :key="page"
                                @click="typeof page === 'number' ? handlePageChange(page) : null" :class="[
                                    typeof page === 'number' ? (
                                        page === currentPage
                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    ) : 'bg-white border-gray-300 text-gray-700',
                                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                                ]" :disabled="typeof page !== 'number'">
                                {{ page }}
                            </button>
                            <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                                <span class="sr-only">Next</span>
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                    fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-red-700">
                        {{ error }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useToastStore } from '@/stores/toast';

export default {
    name: 'AdminTable',
    props: {
        // API endpoint to fetch data from
        apiEndpoint: {
            type: String,
            required: true
        },
        // Table title (used for search placeholder)
        title: {
            type: String,
            default: 'Items'
        },
        // Table columns configuration
        columns: {
            type: Array,
            required: true,
            // Example: [{ key: 'name', label: 'Name', sortable: true, type: 'text' }]
        },
        // Filter options
        filters: {
            type: Array,
            default: () => [],
            // Example: [{ key: 'status', placeholder: 'All Status', options: [{ value: 'active', label: 'Active' }] }]
        },
        // Available actions
        actions: {
            type: Array,
            default: () => [],
            // Example: [{ name: 'edit', label: 'Edit', icon: 'PencilIcon', buttonClasses: 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50' }]
        },
        // Default sort field
        defaultSortField: {
            type: String,
            default: 'id'
        },
        // Default sort direction
        defaultSortDirection: {
            type: String,
            default: 'desc',
            validator: (value) => ['asc', 'desc'].includes(value)
        },
        // Items per page
        perPage: {
            type: Number,
            default: 10
        },
        // Show add button
        showAddButton: {
            type: Boolean,
            default: true
        },
        // Add button text
        addButtonText: {
            type: String,
            default: 'Item'
        }
    },
    emits: ['action', 'add', 'data-loaded'],
    setup(props, { emit }) {
        const toastStore = useToastStore();

        // Data state
        const data = ref([]);
        const loading = ref(false);
        const error = ref(null);
        const totalItems = ref(0);
        const totalPages = ref(0);

        // Pagination state
        const currentPage = ref(1);

        // Sorting state
        const sortField = ref(props.defaultSortField);
        const sortDirection = ref(props.defaultSortDirection);

        // Filtering and search state
        const searchQuery = ref('');
        const activeFilters = ref({});

        // Initialize active filters
        props.filters.forEach(filter => {
            activeFilters.value[filter.key] = '';
        });

        // Computed properties for pagination
        const paginationStart = computed(() => {
            return (currentPage.value - 1) * props.perPage + 1;
        });

        const paginationEnd = computed(() => {
            return Math.min(currentPage.value * props.perPage, totalItems.value);
        });

        const displayedPages = computed(() => {
            const pages = [];
            const maxPagesToShow = 5;

            if (totalPages.value <= maxPagesToShow) {
                // Show all pages if there are fewer than maxPagesToShow
                for (let i = 1; i <= totalPages.value; i++) {
                    pages.push(i);
                }
            } else {
                // Always show first page
                pages.push(1);

                // Calculate start and end of pages to show
                let start = Math.max(2, currentPage.value - 1);
                let end = Math.min(totalPages.value - 1, currentPage.value + 1);

                // Adjust if we're at the beginning or end
                if (currentPage.value <= 2) {
                    end = Math.min(totalPages.value - 1, maxPagesToShow - 1);
                } else if (currentPage.value >= totalPages.value - 1) {
                    start = Math.max(2, totalPages.value - maxPagesToShow + 2);
                }

                // Add ellipsis if needed
                if (start > 2) {
                    pages.push('...');
                }

                // Add middle pages
                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }

                // Add ellipsis if needed
                if (end < totalPages.value - 1) {
                    pages.push('...');
                }

                // Always show last page
                if (totalPages.value > 1) {
                    pages.push(totalPages.value);
                }
            }

            return pages;
        });

        // Methods
        const fetchData = async () => {
            loading.value = true;
            error.value = null;

            try {
                // Prepare filters
                const filterParams = {};
                Object.keys(activeFilters.value).forEach(key => {
                    if (activeFilters.value[key]) {
                        filterParams[key] = activeFilters.value[key];
                    }
                });

                // Make API request
                const response = await axios.get(props.apiEndpoint, {
                    params: {
                        filters: filterParams,
                        keyword: searchQuery.value || null,
                        perPage: props.perPage,
                        orderBy: sortField.value,
                        orderDirection: sortDirection.value,
                        page: currentPage.value
                    }
                });

                // Update state with response data
                if (response.data && response.data.data) {
                    data.value = response.data.data;
                    totalItems.value = response.data.total || response.data.data.length;
                    totalPages.value = response.data.last_page || Math.ceil(totalItems.value / props.perPage);

                    // Emit data loaded event
                    emit('data-loaded', {
                        data: data.value,
                        total: totalItems.value,
                        currentPage: currentPage.value,
                        totalPages: totalPages.value
                    });
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                error.value = 'Failed to load data. Please try again.';
                toastStore.showToast(5000, 'Failed to load data', 'bg-red-500');
            } finally {
                loading.value = false;
            }
        };

        // Handle sorting
        const handleSort = (field) => {
            if (sortField.value === field) {
                // Toggle direction if clicking the same field
                sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
            } else {
                // Set new field and default to ascending
                sortField.value = field;
                sortDirection.value = 'asc';
            }

            // Reset to first page and fetch data
            currentPage.value = 1;
            fetchData();
        };

        // Handle pagination
        const handlePageChange = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
                fetchData();
            }
        };

        // Handle actions (edit, delete, etc.)
        const handleAction = (actionName, item) => {
            emit('action', { action: actionName, item });
        };

        // Get value from nested object path (e.g. 'user.name')
        const getItemValue = (item, path) => {
            if (!path) return '';

            const keys = path.split('.');
            let value = item;

            for (const key of keys) {
                if (value === null || value === undefined) return '';
                value = value[key];
            }

            return value;
        };

        // Format date
        const formatDate = (dateString) => {
            if (!dateString) return '';

            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;

            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(date);
        };

        // Get badge classes based on value
        const getBadgeClasses = (column, value) => {
            if (!column.badges || !column.badges[value]) {
                return 'bg-gray-100 text-gray-800';
            }

            return column.badges[value];
        };

        // Debounce search to avoid too many requests
        let searchTimeout;
        const debounceSearch = () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentPage.value = 1; // Reset to first page
                fetchData();
            }, 500);
        };

        // Watch for changes in perPage
        watch(() => props.perPage, () => {
            currentPage.value = 1; // Reset to first page
            fetchData();
        });

        // Initial data fetch
        onMounted(() => {
            fetchData();
        });

        return {
            data,
            loading,
            error,
            totalItems,
            totalPages,
            currentPage,
            sortField,
            sortDirection,
            searchQuery,
            activeFilters,
            paginationStart,
            paginationEnd,
            displayedPages,
            fetchData,
            handleSort,
            handlePageChange,
            handleAction,
            getItemValue,
            formatDate,
            getBadgeClasses,
            debounceSearch
        };
    }
}
</script>