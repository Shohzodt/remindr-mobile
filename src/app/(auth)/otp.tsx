import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '@/services/auth';
import { AuthInputScreen } from '@/components/auth/AuthInputScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

export default function OtpScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ email?: string }>();
    const { loginWithOtp } = useAuth();

    const [email, setEmail] = useState(params.email || '');
    const [step, setStep] = useState<'email' | 'otp'>(params.email ? 'otp' : 'email');

    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Resend Timer State
    const [timer, setTimer] = useState(30);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Focus
    const otpInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (timer > 0) {
            timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
        } else {
            if (timerRef.current) clearTimeout(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [timer]);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleEmailSubmit = async () => {
        setError('');
        if (!email) {
            setError('Please enter your email address');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setIsLoading(true);
            await AuthService.requestOtp(email);
            setStep('otp');
            setTimer(30); // 30s cooldown
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to send verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async () => {
        setError('');
        if (otp.length !== 6) {
            setError('Please enter the full 6-digit code');
            return;
        }

        try {
            setIsLoading(true);
            if (!email) throw new Error('Email is missing');
            await loginWithOtp(email, otp);
            // Success handled by AuthContext
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Invalid code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        try {
            setError('');
            if (!email) return;
            await AuthService.requestOtp(email);
            setTimer(30);
            Alert.alert('Code Sent', 'A new code has been sent to your email.');
        } catch (err: any) {
            setError('Failed to resend code.');
        }
    };

    const handleBack = () => {
        if (step === 'otp') {
            setStep('email');
            setOtp('');
            setError('');
        } else {
            router.back();
        }
    };

    return (
        <View className="flex-1 bg-bg-primary overflow-hidden min-h-screen">
            {/* Background Glow */}
            <View className="absolute -top-[20%] -left-[40%] w-[500px] h-[500px] pointer-events-none">
                <Svg height="100%" width="100%">
                    <Defs>
                        <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
                            <Stop offset="0" stopColor="#8B5CF6" stopOpacity="0.2" />
                            <Stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx="50%" cy="50%" r="50%" fill="url(#grad)" />
                </Svg>
            </View>

            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <View className="flex-1 px-8 pt-10 pb-8">
                        {step === 'email' ? (
                            <AuthInputScreen
                                onBack={handleBack}
                                title="Enter your email"
                                error={error}
                                isLoading={isLoading}
                                onContinue={handleEmailSubmit}
                            >
                                <View className="flex-row items-center bg-logo-container px-4 h-14 rounded-2xl border border-white/5 focus:border-accent-purple/50">
                                    <Ionicons name="mail-outline" size={20} color="#71717a" />
                                    <TextInput
                                        className="flex-1 ml-3 text-white"
                                        placeholder="name@example.com"
                                        placeholderTextColor="#71717a"
                                        value={email}
                                        onChangeText={(t) => {
                                            setEmail(t);
                                            setError('');
                                        }}
                                        style={{
                                            fontSize: 16,
                                            lineHeight: 20,
                                        }}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        returnKeyType="done"
                                        autoFocus
                                    />
                                </View>
                            </AuthInputScreen>
                        ) : (
                            <AuthInputScreen
                                onBack={handleBack}
                                title="Verify your email"
                                error={error}
                                isLoading={isLoading}
                                onContinue={handleOtpSubmit}
                                continueText="Verify Code"
                                continueDisabled={otp.length < 6}
                                secondaryAction={
                                    <TouchableOpacity
                                        disabled={timer > 0}
                                        onPress={handleResendOtp}
                                        className="items-center py-2"
                                    >
                                        {timer > 0 ? (
                                            <Text className="text-zinc-500 text-sm">Resend code in {timer}s</Text>
                                        ) : (
                                            <Text className="text-accent-fuchsia text-sm font-semibold">Resend Code</Text>
                                        )}
                                    </TouchableOpacity>
                                }
                            >
                                <View className="mb-2">
                                    <Text className="text-text-secondary text-base mb-4">
                                        We sent a code to <Text className="text-white font-semibold">{email}</Text>
                                    </Text>
                                    <View className="px-4 h-14 flex-row items-center bg-logo-container rounded-2xl border border-white/5 focus:border-accent-purple/50">
                                        <Ionicons name="lock-closed-outline" size={20} color="#71717a" style={{ marginRight: 10 }} />
                                        <TextInput
                                            ref={otpInputRef}
                                            className="h-full flex-1 text-white tracking-[4px] font-bold"
                                            placeholder="000000"
                                            placeholderTextColor="#71717a"
                                            value={otp}
                                            onChangeText={(t) => {
                                                const numeric = t.replace(/[^0-9]/g, '');
                                                if (numeric.length <= 6) setOtp(numeric);
                                                setError('');
                                            }}
                                            style={{
                                                fontSize: 16,
                                                lineHeight: 20,
                                            }}
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            autoFocus
                                        />
                                    </View>
                                </View>
                            </AuthInputScreen>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
