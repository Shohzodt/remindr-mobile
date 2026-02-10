import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/Text';
import { AuthService } from '@/services/auth';

interface LinkEmailModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (payload: { email: string; code: string }) => Promise<boolean>;
    isLinking: boolean;
    error: string | null;
}

export const LinkEmailModal: React.FC<LinkEmailModalProps> = ({ visible, onClose, onSubmit, isLinking, error }) => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'email' | 'code'>('email');
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [otpError, setOtpError] = useState<string | null>(null);

    const handleSendOtp = async () => {
        if (!email.trim()) return;
        setOtpError(null);
        setIsSendingOtp(true);
        try {
            await AuthService.requestOtp(email.trim());
            setStep('code');
        } catch (err: any) {
            setOtpError(err.response?.data?.message || 'Failed to send verification code');
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleSubmit = async () => {
        if (!email.trim() || !code.trim()) return;
        const success = await onSubmit({ email: email.trim(), code: code.trim() });
        if (success) {
            setEmail('');
            setCode('');
            setStep('email');
        }
    };

    const handleClose = () => {
        setEmail('');
        setCode('');
        setStep('email');
        setOtpError(null);
        onClose();
    };

    const handleBack = () => {
        setCode('');
        setOtpError(null);
        setStep('email');
    };

    const displayError = step === 'email' ? otpError : error;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleClose}
                    className="flex-1 bg-black/60 justify-center items-center px-6"
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { }}
                        className="w-full bg-[#121217] rounded-[32px] border border-white/10 p-6"
                    >
                        {/* Title */}
                        <Text variant="h3" weight="extrabold" className="text-white text-center mb-2">
                            Link Email
                        </Text>
                        <Text className="text-zinc-500 text-xs text-center font-sans-medium mb-6">
                            {step === 'email'
                                ? 'Enter your email to receive a verification code'
                                : `Code sent to ${email}`
                            }
                        </Text>

                        {step === 'email' ? (
                            <>
                                {/* Email Input */}
                                <View className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 mb-4 justify-center">
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Email"
                                        placeholderTextColor="#52525b"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoFocus
                                        className="font-sans-medium text-white"
                                        style={{ fontSize: 16, letterSpacing: 0.5 }}
                                    />
                                </View>

                                {/* Error */}
                                {displayError && (
                                    <Text className="text-red-400 text-xs text-center mb-3 font-sans-medium">{displayError}</Text>
                                )}

                                {/* Actions */}
                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        onPress={handleClose}
                                        className="flex-1 h-12 bg-white/5 rounded-2xl items-center justify-center"
                                    >
                                        <Text className="text-zinc-400 font-sans-bold text-sm">Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleSendOtp}
                                        disabled={isSendingOtp || !email.trim()}
                                        className={`flex-1 h-12 bg-[#8B5CF6] rounded-2xl items-center justify-center ${isSendingOtp || !email.trim() ? 'opacity-50' : ''}`}
                                    >
                                        {isSendingOtp ? (
                                            <ActivityIndicator color="white" size="small" />
                                        ) : (
                                            <Text className="text-white font-sans-bold text-sm">Send Code</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                {/* Code Input */}
                                <View className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 mb-4 justify-center">
                                    <TextInput
                                        value={code}
                                        onChangeText={setCode}
                                        placeholder="Verification code"
                                        placeholderTextColor="#52525b"
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        autoFocus
                                        className="font-sans-medium text-white"
                                        style={{ fontSize: 16, letterSpacing: 2 }}
                                    />
                                </View>

                                {/* Error */}
                                {displayError && (
                                    <Text className="text-red-400 text-xs text-center mb-3 font-sans-medium">{displayError}</Text>
                                )}

                                {/* Actions */}
                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        onPress={handleBack}
                                        className="flex-1 h-12 bg-white/5 rounded-2xl items-center justify-center"
                                    >
                                        <Text className="text-zinc-400 font-sans-bold text-sm">Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        disabled={isLinking || !code.trim()}
                                        className={`flex-1 h-12 bg-[#8B5CF6] rounded-2xl items-center justify-center ${isLinking || !code.trim() ? 'opacity-50' : ''}`}
                                    >
                                        {isLinking ? (
                                            <ActivityIndicator color="white" size="small" />
                                        ) : (
                                            <Text className="text-white font-sans-bold text-sm">Link Email</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </Modal>
    );
};
