import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    CreditCard,
    Plus,
    Check,
    Sparkles,
    AlertTriangle,
    Zap
} from 'lucide-react-native';

import { Theme } from "@/theme";
import { Layout } from "@/constants/layout";
import { Text } from '@/components/ui/Text';
import { useBillingMock, AICreditPack } from '@/hooks/useBillingMock';
import { Plan } from '@/types';

export default function PlansBillingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const {
        userPlan,
        paymentMethod,
        subMetadata,
        aiState,
        handlePlanChange,
        handleCancelSubscription,
        handleAddPayment,
        handleRemovePayment,
        purchaseCredits
    } = useBillingMock();

    // Modal States
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);
    const [showConfirmRemoveCard, setShowConfirmRemoveCard] = useState(false);
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [selectedPack, setSelectedPack] = useState<AICreditPack | null>(null);

    const isFree = userPlan === 'Free';
    const hasCard = !!paymentMethod;
    const canRemoveCard = isFree && hasCard;

    const starterPlanFeatures = ['Manual reminders', 'Calendar view', 'Up to 5 deadlines', 'Basic notifications'];
    const proPlanFeatures = ['Unlimited reminders', 'Consequence-aware logic', 'Protected deadlines', 'Smart scheduling'];
    const premiumPlanFeatures = ['10 AI scans/mo', 'Shared deadlines', 'Responsibility assignment', 'Advanced insights'];

    const CREDIT_PACKS: AICreditPack[] = [
        { id: 'pack_10', credits: 10, price: 2.99 },
        { id: 'pack_50', credits: 50, price: 9.99, popular: true },
        { id: 'pack_100', credits: 100, price: 15.99 },
    ];

    const handlePurchase = (pack: AICreditPack) => {
        purchaseCredits(pack.credits);
        setShowTopUpModal(false);
        setSelectedPack(null);
    };

    return (
        <View className="flex-1 bg-bg-primary">
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    ...Layout.tabBarAwareContent,
                    paddingTop: insets.top + 20,
                    paddingHorizontal: 24,
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

                {/* Subscription Status Bar */}
                {!isFree && (
                    <View className="mb-8">
                        <View className={`bg-[#121217] p-5 rounded-[28px] border ${subMetadata.isCancelled ? 'border-amber-500/20 bg-amber-500/5' : 'border-white/5'}`}>
                            <View className="flex-row justify-between items-center mb-1">
                                <Text variant="micro" className="text-zinc-500 uppercase tracking-widest text-[10px]">Status</Text>
                                <Text variant="micro" className={`uppercase tracking-widest text-[10px] ${subMetadata.isCancelled ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {subMetadata.isCancelled ? 'Ending Soon' : 'Active'}
                                </Text>
                            </View>
                            <Text weight="bold" className="text-white text-sm tracking-tight mt-1">
                                {subMetadata.isCancelled
                                    ? `Subscription ends on ${subMetadata.billingPeriodEnd}`
                                    : `Next billing date: ${subMetadata.billingPeriodEnd}`}
                            </Text>
                        </View>
                    </View>
                )}

                {/* AI Usage Stats */}
                {!isFree && (
                    <View className="mb-12">
                        <View className="flex-row justify-between items-end mb-4 px-2">
                            <Text variant="micro" className="text-zinc-600 uppercase tracking-[0.2em] text-[10px]">AI Credits</Text>
                            <TouchableOpacity onPress={() => setShowTopUpModal(true)}>
                                <Text variant="micro" className="text-purple-400 uppercase tracking-widest text-[10px]">Add Credits</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="bg-[#121217] p-6 rounded-[28px] border border-white/5">
                            {/* Monthly Plan Usage */}
                            <View className="mb-6">
                                <View className="flex-row justify-between items-end mb-2">
                                    <View>
                                        <Text variant="micro" className="text-zinc-500 uppercase tracking-widest mb-1 text-[10px]">Monthly Plan</Text>
                                        <Text weight="bold" className="text-white text-sm">
                                            {aiState.plan.usedThisMonth} <Text className="text-zinc-500">/ {aiState.plan.monthlyLimit} scans</Text>
                                        </Text>
                                    </View>
                                    <Text weight="bold" className="text-[10px] text-zinc-600">Resets Nov 1</Text>
                                </View>

                                {/* Progress Bar */}
                                <View className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <View
                                        className={`h-full rounded-full ${(aiState.plan.usedThisMonth / aiState.plan.monthlyLimit) >= 1
                                            ? 'bg-red-500'
                                            : 'bg-purple-600' // NativeWind gradient support on simple views is tricky, solid color is safer for progress bar
                                            }`}
                                        style={{ width: `${Math.min((aiState.plan.usedThisMonth / aiState.plan.monthlyLimit) * 100, 100)}%` }}
                                    />
                                </View>
                                {(aiState.plan.usedThisMonth >= aiState.plan.monthlyLimit) && (
                                    <View className="mt-2 flex-row items-center gap-1.5">
                                        <AlertTriangle size={12} color="#ef4444" />
                                        <Text weight="bold" className="text-red-500 text-[10px]">Monthly limit reached</Text>
                                    </View>
                                )}
                            </View>

                            {/* Add-on Credits */}
                            <View className="pt-6 border-t border-white/5 flex-row items-center justify-between">
                                <View>
                                    <Text variant="micro" className="text-zinc-500 uppercase tracking-widest mb-1 text-[10px]">Add-on Balance</Text>
                                    <Text weight="bold" className="text-white text-sm">
                                        {aiState.addOns.balance > 0 ? `+${aiState.addOns.balance} extra scans` : '0 extra scans'}
                                    </Text>
                                </View>
                                {aiState.addOns.balance > 0 && (
                                    <View className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                        <Text variant="micro" className="text-emerald-500 uppercase tracking-widest text-[10px]">Available</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                )}

                {/* Payment Method */}
                <View className="mb-12">
                    <Text variant="micro" className="text-zinc-600 uppercase tracking-[0.2em] px-2 mb-4 text-[10px]">Payment Method</Text>

                    {hasCard ? (
                        <View className="gap-4">
                            <View className="bg-[#121217] rounded-[28px] border border-white/5 p-6 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-4">
                                    <View className="w-12 h-10 bg-white/5 rounded-xl items-center justify-center">
                                        <CreditCard size={20} color="#a1a1aa" />
                                    </View>
                                    <View>
                                        <Text weight="bold" className="text-white text-sm">•••• {paymentMethod?.last4}</Text>
                                        <Text variant="micro" className="text-zinc-500 uppercase tracking-widest mt-0.5 text-[10px]">Expires {paymentMethod?.expiry}</Text>
                                    </View>
                                </View>
                                <View className="bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-white/5">
                                    <Text variant="micro" className="text-zinc-600 uppercase tracking-widest text-[9px]">Primary</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => canRemoveCard ? setShowConfirmRemoveCard(true) : null}
                                activeOpacity={canRemoveCard ? 0.7 : 1}
                                className={`w-full py-4 rounded-2xl border border-dashed items-center ${canRemoveCard
                                    ? 'border-white/10 active:scale-95'
                                    : 'border-transparent opacity-50'
                                    }`}
                            >
                                <Text variant="micro" className={`uppercase tracking-widest text-[10px] ${canRemoveCard ? 'text-zinc-500' : 'text-zinc-800'}`}>
                                    {canRemoveCard ? 'Remove card' : 'Cannot remove card while active'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={handleAddPayment}
                            className="w-full bg-[#121217] border border-dashed border-white/10 rounded-[28px] p-8 items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <View className="w-12 h-12 rounded-full bg-white/5 items-center justify-center">
                                <Plus size={24} color="#52525b" />
                            </View>
                            <View className="items-center">
                                <Text variant="micro" className="text-zinc-500 uppercase tracking-widest mb-1 text-[11px]">Add payment method</Text>
                                <Text variant="micro" className="text-zinc-700 font-bold uppercase tracking-widest text-[9px]">Provider-hosted secure flow</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Available Plans */}
                <View className="mb-16 gap-8">
                    <Text variant="micro" className="text-zinc-600 uppercase tracking-[0.2em] px-2 text-[10px]">Available Plans</Text>

                    {/* Starter Plan */}
                    <View className={`bg-[#0B0B0F] rounded-[32px] p-7 border ${userPlan === 'Free' ? 'border-zinc-400' : 'border-zinc-800 opacity-60'}`}>
                        <View className="flex-row justify-between items-center mb-4">
                            <Text weight="bold" className="text-xl text-zinc-200 tracking-tight">Starter</Text>
                            {userPlan === 'Free' && (
                                <View className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-700">
                                    <Text variant="micro" className="text-zinc-400 text-[8px] uppercase tracking-[0.15em]">Current</Text>
                                </View>
                            )}
                        </View>
                        <View className="gap-2.5">
                            {starterPlanFeatures.map((f, i) => (
                                <View key={i} className="flex-row items-center gap-2.5">
                                    <View className="w-1 h-1 rounded-full bg-zinc-700" />
                                    <Text weight="medium" className="text-zinc-400 text-[12px]">{f}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Pro Plan */}
                    <View className={`bg-[#0F0F15] rounded-[32px] border p-7 ${userPlan === 'Pro' ? 'border-purple-500/50' : 'border-white/10'}`}>
                        <View className="flex-row justify-between items-start mb-2">
                            <View>
                                <Text weight="extrabold" className="text-2xl text-white tracking-tight">Pro</Text>
                                <View className="flex-row items-baseline">
                                    <Text weight="extrabold" className="text-[#8B5CF6] text-xl tracking-tight">$4.99</Text>
                                    <Text weight="bold" className="text-[12px] text-zinc-500 ml-1">/mo</Text>
                                </View>
                            </View>
                            {userPlan === 'Pro' && (
                                <View className="px-3 py-1.5 rounded-full bg-zinc-700">
                                    <Text variant="micro" className="text-white text-[8px] uppercase tracking-[0.15em]">ACTIVE</Text>
                                </View>
                            )}
                        </View>
                        <View className="gap-3 my-6">
                            {proPlanFeatures.map((f, i) => (
                                <View key={i} className="flex-row items-center gap-3">
                                    <Check size={16} color="#8B5CF6" />
                                    <Text weight="bold" className="text-white text-[12px] tracking-tight">{f}</Text>
                                </View>
                            ))}
                        </View>
                        {userPlan !== 'Pro' && (
                            <TouchableOpacity
                                onPress={() => handlePlanChange('Pro')}
                                activeOpacity={0.9}
                                className="w-full h-14 bg-white rounded-2xl shadow-lg items-center justify-center active:scale-[0.98]"
                            >
                                <Text weight="extrabold" className="text-black text-sm">
                                    {userPlan === 'Free' ? 'Upgrade to Pro' : 'Switch to Pro'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Premium Plan */}
                    <View className={`bg-[#08080A] rounded-[32px] border p-7 ${userPlan === 'Premium' ? 'border-white/40' : 'border-white/10'}`}>
                        <View className="flex-row justify-between items-start mb-2">
                            <View>
                                <Text weight="extrabold" className="text-2xl text-white tracking-tight">Premium</Text>
                                <View className="flex-row items-baseline">
                                    <Text weight="extrabold" className="text-zinc-200 text-xl tracking-tight">$9.99</Text>
                                    <Text weight="bold" className="text-[12px] text-zinc-500 ml-1">/mo</Text>
                                </View>
                            </View>
                            {userPlan === 'Premium' && (
                                <View className="px-3 py-1.5 rounded-full bg-zinc-500">
                                    <Text variant="micro" className="text-black text-[8px] uppercase tracking-[0.15em]">ACTIVE</Text>
                                </View>
                            )}
                        </View>
                        <View className="gap-3 my-6">
                            {premiumPlanFeatures.map((f, i) => (
                                <View key={i} className="flex-row items-center gap-3">
                                    <Check size={16} color="white" />
                                    <Text weight="bold" className="text-white text-[12px] tracking-tight">{f}</Text>
                                </View>
                            ))}
                        </View>
                        {userPlan !== 'Premium' && (
                            <TouchableOpacity
                                onPress={() => handlePlanChange('Premium')}
                                activeOpacity={0.9}
                                className="w-full h-14 bg-white rounded-2xl shadow-lg items-center justify-center active:scale-[0.98]"
                            >
                                <Text weight="extrabold" className="text-black text-sm">
                                    {userPlan === 'Free' || userPlan === 'Pro' ? 'Upgrade to Premium' : 'Switch to Premium'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Cancellation Block */}
                {!isFree && !subMetadata.isCancelled && (
                    <View className="mt-8 pt-8 border-t border-white/5 pb-10 items-center">
                        <TouchableOpacity onPress={() => setShowConfirmCancel(true)}>
                            <Text variant="micro" className="text-zinc-600 uppercase tracking-[0.2em] text-[11px]">Cancel Subscription</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Modals */}
            <ConfirmationModal
                visible={showConfirmCancel}
                title="Cancel Subscription?"
                message={`Your benefits remain active until ${subMetadata.billingPeriodEnd}. No further charges will be processed.`}
                confirmText="Confirm Cancellation"
                cancelText="Keep Plan"
                onConfirm={() => { handleCancelSubscription(); setShowConfirmCancel(false); }}
                onCancel={() => setShowConfirmCancel(false)}
                isDestructive
            />

            <ConfirmationModal
                visible={showConfirmRemoveCard}
                title="Remove Card?"
                message="Are you sure you want to remove this payment method? This action is permanent."
                confirmText="Remove Card"
                cancelText="Keep Card"
                onConfirm={() => { handleRemovePayment(); setShowConfirmRemoveCard(false); }}
                onCancel={() => setShowConfirmRemoveCard(false)}
                isDestructive
            />

            <TopUpModal
                visible={showTopUpModal}
                packs={CREDIT_PACKS}
                onSelect={(pack) => handlePurchase(pack)}
                onClose={() => setShowTopUpModal(false)}
            />
        </View>
    );
}

// Sub-components for Modals (Inline for single file convenience like Web)

function ConfirmationModal({
    visible, title, message, confirmText, cancelText, onConfirm, onCancel, isDestructive
}: {
    visible: boolean; title: string; message: string; confirmText: string; cancelText: string;
    onConfirm: () => void; onCancel: () => void; isDestructive?: boolean;
}) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 justify-end bg-black/60">
                <View className="bg-[#0B0B0F] rounded-t-[48px] border-t border-white/10 p-8 pb-12">
                    <View className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8 opacity-50" />
                    <View className="items-center text-center mb-6">
                        <Text weight="extrabold" className="text-2xl text-white tracking-tighter mb-4">{title}</Text>
                        <Text weight="medium" className="text-zinc-500 text-sm leading-relaxed text-center px-4">{message}</Text>
                    </View>
                    <View className="gap-3">
                        <TouchableOpacity
                            onPress={onConfirm}
                            className={`w-full h-16 rounded-[24px] items-center justify-center ${isDestructive ? 'bg-red-500/10 border border-red-500/20' : 'bg-white'}`}
                        >
                            <Text weight="extrabold" className={`uppercase tracking-[0.15em] text-[11px] ${isDestructive ? 'text-red-500' : 'text-black'}`}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onCancel}
                            className="w-full h-16 bg-white/5 rounded-[24px] items-center justify-center"
                        >
                            <Text weight="bold" className="text-zinc-400 text-sm">{cancelText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function TopUpModal({ visible, packs, onSelect, onClose }: { visible: boolean; packs: AICreditPack[]; onSelect: (p: AICreditPack) => void; onClose: () => void }) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 justify-end bg-black/60">
                <View className="bg-[#0B0B0F] rounded-t-[48px] border-t border-white/10 p-8 pb-12">
                    <View className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8 opacity-50" />
                    <View className="items-center mb-8">
                        <Sparkles size={32} color="#c084fc" />
                        <Text weight="extrabold" className="text-2xl text-white tracking-tighter mt-4">Top Up Credits</Text>
                    </View>

                    <View className="gap-4 mb-4">
                        {packs.map(pack => (
                            <TouchableOpacity
                                key={pack.id}
                                onPress={() => onSelect(pack)}
                                className={`w-full p-4 rounded-2xl border flex-row items-center justify-between ${pack.popular ? 'bg-purple-500/10 border-purple-500/50' : 'bg-white/5 border-white/10'}`}
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className={`w-10 h-10 rounded-full items-center justify-center ${pack.popular ? 'bg-purple-500/20' : 'bg-white/10'}`}>
                                        <Zap size={18} color={pack.popular ? '#c084fc' : 'white'} fill={pack.popular ? '#c084fc' : 'none'} />
                                    </View>
                                    <View>
                                        <Text weight="bold" className="text-white text-lg">{pack.credits} Credits</Text>
                                        {pack.popular && <Text weight="extrabold" className="text-purple-400 text-[10px] uppercase tracking-widest">Most Popular</Text>}
                                    </View>
                                </View>
                                <Text weight="extrabold" className="text-white text-lg">${pack.price}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity onPress={onClose} className="w-full h-14 items-center justify-center">
                        <Text weight="bold" className="text-zinc-500">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
