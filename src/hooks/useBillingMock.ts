import { useState } from 'react';
import { PaymentMethod, SubscriptionMetadata, Plan } from '@/types';

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

// Mock Data
const MOCK_PAYMENT_METHOD: PaymentMethod = {
    last4: '4242',
    expiry: '12/28',
    brand: 'visa'
};

const MOCK_SUB_METADATA: SubscriptionMetadata = {
    isCancelled: false,
    billingPeriodEnd: 'Nov 12, 2026'
};

export const useBillingMock = () => {
    // State
    const [userPlan, setUserPlan] = useState<Plan>('Free');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(MOCK_PAYMENT_METHOD);
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

    const handleAddPayment = () => {
        setPaymentMethod(MOCK_PAYMENT_METHOD);
    };

    const handleRemovePayment = () => {
        setPaymentMethod(null);
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
        paymentMethod,
        subMetadata,
        aiState,
        handlePlanChange,
        handleCancelSubscription,
        handleAddPayment,
        handleRemovePayment,
        purchaseCredits
    };
};
