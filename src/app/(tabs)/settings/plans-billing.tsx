import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Check,
} from 'lucide-react-native';

import { Layout } from '@/constants/layout';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext';
import { getPlanDisplayName } from '@/utils/plan';

type PlanId = 'free' | 'pro';

interface PlanConfig {
    id: PlanId;
    title: string;
    price: string;
    interval: string;
    isCurrent: boolean;
    features: string[];
}

export default function PlansBillingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const currentPlan = getPlanDisplayName(user?.plan);

    const plans: PlanConfig[] = [
        {
            id: 'free',
            title: 'Free',
            price: '$0',
            interval: '/mo',
            isCurrent: currentPlan === 'Free',
            features: [
                'Manual reminders',
                'Calendar view',
                'Categories',
                'Basic notifications',
                'Up to 10 reminders',
                'View Discover events',
                '3 document/image AI tries',
                '3 voice reminder tries',
            ],
        },
        {
            id: 'pro',
            title: 'Pro',
            price: '$2.99',
            interval: '/mo',
            isCurrent: currentPlan === 'Pro',
            features: [
                'Unlimited reminders',
                'Reminder Guardian',
                'Recurring reminders',
                'Smart Timing Assistant',
                'High quality AI analysis',
                'Voice Reminder with more usage',
                'Add reminders from Discover',
                'Generous AI usage limits',
            ],
        },
    ];

    return (
        <View className="flex-1 bg-bg-primary">
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    ...Layout.tabBarAwareContent,
                    paddingTop: insets.top + 20,
                    paddingHorizontal: 24,
                    paddingBottom: 220,
                }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-row items-center gap-6 mb-10">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95"
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <ArrowLeft size={20} color="white" />
                    </TouchableOpacity>
                    <Text variant="h2" weight="extrabold" className="text-white tracking-tighter">
                        Plans & Billing
                    </Text>
                </View>

                <View className="gap-6">
                    <Text variant="micro" className="text-zinc-600 uppercase tracking-[0.2em] px-2 text-[10px]">
                        Available Plans
                    </Text>

                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

function PlanCard({
    plan,
}: {
    plan: PlanConfig;
}) {
    const isPro = plan.id === 'pro';

    return (
        <View
            className={`rounded-[32px] border p-7 ${isPro
                ? 'bg-[#0F0F15] border-purple-500/30'
                : 'bg-[#0B0B0F] border-white/10'
                }`}
        >
            <View className="flex-row justify-between items-start mb-5">
                <View className="flex-1 pr-4">
                    <View className="flex-row items-center gap-2 mb-2 flex-wrap">
                        <Text weight="extrabold" className={`${isPro ? 'text-white' : 'text-zinc-200'} text-xl tracking-tight`}>
                            {plan.title}
                        </Text>
                    </View>
                    <View className="flex-row items-baseline">
                        <Text weight="extrabold" className={`${isPro ? 'text-[#8B5CF6]' : 'text-zinc-200'} text-xl tracking-tight`}>
                            {plan.price}
                        </Text>
                        <Text weight="bold" className="text-[12px] text-zinc-500 ml-1">
                            {plan.interval}
                        </Text>
                    </View>
                </View>

                {plan.isCurrent && (
                    <View className={`${isPro ? 'bg-purple-500/15 border-purple-500/30' : 'bg-zinc-900 border-zinc-700'} px-3 py-1.5 rounded-full border`}>
                        <Text variant="micro" className={`${isPro ? 'text-purple-200' : 'text-zinc-400'} text-[8px] uppercase tracking-[0.15em]`}>
                            Current plan
                        </Text>
                    </View>
                )}
            </View>

            <View className="gap-3 mb-5">
                {plan.features.map((feature) => (
                    <View key={feature} className="flex-row items-center gap-3">
                        <Check size={15} color={isPro ? '#8B5CF6' : '#71717a'} />
                        <Text weight={isPro ? 'bold' : 'medium'} className={`${isPro ? 'text-white' : 'text-zinc-400'} text-[12px] tracking-tight flex-1`}>
                            {feature}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
