<template>
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="flex-shrink-0">
                <div :class="`p-3 rounded-full ${color} text-white`">
                    <component :is="resolvedIcon" class="h-6 w-6" />
                </div>
            </div>
            <div class="ml-5 w-0 flex-1">
                <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">{{ title }}</dt>
                    <dd>
                        <div v-if="loading" class="h-8 flex items-center">
                            <div class="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                        </div>
                        <div v-else class="text-lg font-semibold text-gray-900">
                            {{ formattedValue }}
                        </div>
                    </dd>
                </dl>
            </div>
        </div>
        <div v-if="showTrend && !loading" class="mt-4">
            <div class="flex items-center">
                <span class="text-sm font-medium mr-2"
                    :class="trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'">
                    {{ formatTrend(trend) }}
                </span>
                <span class="text-xs text-gray-500">vs last period</span>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import {
    UsersIcon,
    FileTextIcon,
    UserCheckIcon,
    TrendingUpIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    ClockIcon,
    HeartIcon
} from 'lucide-vue-next';

export default {
    name: 'StatCard',
    components: {
        UsersIcon,
        FileTextIcon,
        UserCheckIcon,
        TrendingUpIcon,
        ChartBarIcon,
        CurrencyDollarIcon,
        ClockIcon,
        HeartIcon
    },
    props: {
        title: {
            type: String,
            required: true
        },
        value: {
            type: [Number, String],
            required: true
        },
        icon: {
            type: String,
            default: 'chart-bar'
        },
        color: {
            type: String,
            default: 'bg-blue-500'
        },
        loading: {
            type: Boolean,
            default: false
        },
        trend: {
            type: Number,
            default: null
        },
        showTrend: {
            type: Boolean,
            default: false
        },
        valuePrefix: {
            type: String,
            default: ''
        },
        valueSuffix: {
            type: String,
            default: ''
        },
        formatNumber: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const resolvedIcon = computed(() => {
            const iconMap = {
                'users': UsersIcon,
                'file-text': FileTextIcon,
                'user-check': UserCheckIcon,
                'trending-up': TrendingUpIcon,
                'chart-bar': ChartBarIcon,
                'currency-dollar': CurrencyDollarIcon,
                'clock': ClockIcon,
                'heart': HeartIcon
            };

            return iconMap[props.icon] || ChartBarIcon;
        });

        const formattedValue = computed(() => {
            if (typeof props.value !== 'number' || !props.formatNumber) {
                return `${props.valuePrefix}${props.value}${props.valueSuffix}`;
            }

            // Format number with commas
            const formattedNum = new Intl.NumberFormat('en-US').format(props.value);
            return `${props.valuePrefix}${formattedNum}${props.valueSuffix}`;
        });

        const formatTrend = (trend) => {
            if (trend === null || trend === undefined) return '';

            const prefix = trend > 0 ? '+' : '';
            return `${prefix}${trend}%`;
        };

        return {
            resolvedIcon,
            formattedValue,
            formatTrend
        };
    }
}
</script>