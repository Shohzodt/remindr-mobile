import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Check,
} from 'lucide-react-native';

import { Layout } from "@/constants/layout";
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext';
import { getPlanDisplayName } from '@/utils/plan';

type PlanId = 'free' | 'pro';

interface PlanFeature {
    title: string;
}

interface PlanConfig {
    id: PlanId;
    title: string;
    price: string;
    interval: string;
    recommended?: boolean;
    isCurrent: boolean;
    features: PlanFeature[];
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
                { title: 'Manual reminders' },
                { title: 'Calendar view' },
                { title: 'Categories' },
                { title: 'Basic notifications' },
                { title: 'Up to 10 reminders' },
                { title: 'View Discover events' },
            ],
        },
        {
            id: 'pro',
            title: 'Pro',
            price: '$4.99',
            interval: '/mo',
            recommended: true,
            isCurrent: currentPlan === 'Pro',
            features: [
                { title: 'Unlimited reminders' },
                { title: 'Reminder Guardian protection' },
                { title: 'Risk Monitoring' },
                { title: 'Smart Timing Assistant' },
                { title: 'AI document analysis' },
                { title: 'Add reminders from Discover' },
                { title: 'Recurring reminders' },
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
                    paddingBottom: 160,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="flex-row items-center gap-6 mb-10">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95"
                    >
                        <ArrowLeft size={20} color="white" />
                    </TouchableOpacity>
                    <Text variant="h2" weight="extrabold" className="text-white tracking-tighter">
                        Plans & Billing
                    </Text>
                </View>

                {/* Available Plans */}
                <View className="gap-6">
                    <Text variant="micro" className="text-zinc-600 uppercase tracking-[0.2em] px-2 text-[10px]">Available Plans</Text>

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

function PlanCard({ plan }: { plan: PlanConfig }) {
    const isPro = plan.id === 'pro';

    return (
        <View
            className={`rounded-[32px] border p-7 ${isPro
                ? 'bg-[#0F0F15] border-purple-500/30'
                : 'bg-[#0B0B0F] border-white/10'
                } ${plan.isCurrent ? 'opacity-100' : ''}`}
        >
            <View className="flex-row justify-between items-start mb-5">
                <View>
                    <View className="flex-row items-center gap-2 mb-2">
                        <Text weight="extrabold" className={`${isPro ? 'text-2xl text-white' : 'text-xl text-zinc-200'} tracking-tight`}>
                            {plan.title}
                        </Text>
                        {plan.recommended && !plan.isCurrent && (
                            <View className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30">
                                <Text variant="micro" className="text-purple-300 text-[8px] uppercase tracking-[0.15em]">Recommended</Text>
                            </View>
                        )}
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

            <View className="gap-3 mb-6">
                {plan.features.map((feature) => (
                    <View key={feature.title} className="flex-row items-center gap-3">
                        <Check size={15} color={isPro ? '#8B5CF6' : '#71717a'} />
                        <Text weight={isPro ? 'bold' : 'medium'} className={`${isPro ? 'text-white' : 'text-zinc-400'} text-[12px] tracking-tight`}>
                            {feature.title}
                        </Text>
                    </View>
                ))}
            </View>

        </View>
    );
}
