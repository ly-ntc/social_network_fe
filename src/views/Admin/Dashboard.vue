<template>
    <div class="dashboard">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <!-- Orders Card -->
            <div class="bg-blue-500 text-white rounded-lg shadow-md p-6">
                <div class="text-4xl font-bold mb-2">{{ stats.bounceRate }}</div>
                <div class="text-sm opacity-80">Users</div>
            </div>

            <!-- Bounce Rate Card -->
            <div class="bg-green-500 text-white rounded-lg shadow-md p-6">
                <div class="text-4xl font-bold mb-2">{{ stats.newOrders }}</div>
                <div class="text-sm opacity-80">Posts</div>
            </div>

            <!-- User Registrations Card -->
            <div class="bg-yellow-500 text-white rounded-lg shadow-md p-6">
                <div class="text-4xl font-bold mb-2">{{ stats.userRegistrations }}</div>
                <div class="text-sm opacity-80">Likes</div>
            </div>

            <!-- Unique Visitors Card -->
            <div class="bg-red-500 text-white rounded-lg shadow-md p-6">
                <div class="text-4xl font-bold mb-2">{{ stats.uniqueVisitors }}</div>
                <div class="text-sm opacity-80">Report</div>
            </div>
        </div>

        <!-- Chart Section -->
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="chart-container">
                <canvas id="dashboardChart"></canvas>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
    name: 'Dashboard',
    setup() {
        const stats = ref({
            newOrders: 0,
            bounceRate: 0,
            userRegistrations: 0,
            uniqueVisitors: 0,
        });

        const chartData = ref([]); // Dữ liệu cho biểu đồ
        const chartLabels = ref([]); // Nhãn cho biểu đồ

        onMounted(async () => {
            try {
                // Gọi API để lấy dữ liệu
                const response = await axios.get('http://127.0.0.1:8000/api/get-for-admin');
                if (response.data.success) {
                    // Cập nhật stats
                    stats.value = {
                        newOrders: response.data.data.posts_count,
                        bounceRate: response.data.data.user_count,
                        userRegistrations: response.data.data.like_count,
                        uniqueVisitors: response.data.data.report_count,
                    };

                    // Cập nhật dữ liệu biểu đồ
                    const postsByDate = response.data.data.posts_by_date;
                    chartLabels.value = postsByDate.map(item => item.date); // Lấy danh sách ngày
                    chartData.value = postsByDate.map(item => item.count);

                    // Khởi tạo biểu đồ
                    const ctx = document.getElementById('dashboardChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'line', // Loại biểu đồ (line, bar, pie, etc.)
                        data: {
                            labels: chartLabels.value,
                            datasets: [
                                {
                                    label: 'Posts Count',
                                    data: chartData.value,
                                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 2,
                                    fill: true,
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Posts Count in the Last 7 Days',
                                },
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Date',
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Number of Posts',
                                    },
                                    beginAtZero: true,
                                },
                            },
                        },
                    });
                } else {
                    console.error('Failed to fetch stats:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        });

        return {
            stats,
        };
    },
};
</script>

<style scoped>
.dashboard {
    padding: 20px;
    background-color: #f9fafb;
}

.chart-container {
    max-width: 100%;
    height: 400px;
}

.grid {
    display: grid;
    gap: 1.5rem;
}

.bg-blue-500 {
    background-color: #3b82f6;
}

.bg-green-500 {
    background-color: #10b981;
}

.bg-yellow-500 {
    background-color: #f59e0b;
}

.bg-red-500 {
    background-color: #ef4444;
}

.shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>