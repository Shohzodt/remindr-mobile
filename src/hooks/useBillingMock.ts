import { useState } from 'react';
import { SubscriptionMetadata, Plan } from '@/types';

// Extended Types for Billing (Web Parity)
export interface AICreditPack {
    id: string;
    credits: number;
    price: number;
    popular?: boolean;
}

export interface AIState {
    plan: {
        usedThisMonth: number;
        monthlyLimit: number;
    };
    addOns: {
        balance: number;
    };
}

const MOCK_SUB_METADATA: SubscriptionMetadata = {
    isCancelled: false,
    billingPeriodEnd: 'Nov 12, 2026'
};

export const useBillingMock = () => {
    // State
    const [userPlan, setUserPlan] = useState<Plan>('Free');
    const [subMetadata, setSubMetadata] = useState<SubscriptionMetadata>(MOCK_SUB_METADATA);

    // AI State (Advanced mocking)
    const [aiState, setAiState] = useState<AIState>({
        plan: {
            usedThisMonth: 8,
            monthlyLimit: 10
        },
        addOns: {
            balance: 0
        }
    });

    // Actions
    const handlePlanChange = (plan: Plan) => {
        // Simulate API call
        setTimeout(() => {
            setUserPlan(plan);
        }, 500);
    };

    const handleCancelSubscription = () => {
        setSubMetadata(prev => ({ ...prev, isCancelled: true }));
    };

    const purchaseCredits = (amount: number) => {
        setAiState(prev => ({
            ...prev,
            addOns: {
                balance: prev.addOns.balance + amount
            }
        }));
    };

    return {
        userPlan,
        subMetadata,
        aiState,
        handlePlanChange,
        handleCancelSubscription,
        purchaseCredits
    };
};
