import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { Text } from '@/components/ui/Text';

interface LinkTelegramModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (payload: { email: string; code: string }) => Promise<boolean>;
    isLinking: boolean;
    error: string | null;
}

export const LinkTelegramModal: React.FC<LinkTelegramModalProps> = ({ visible, onClose, onSubmit, isLinking, error }) => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'email' | 'code'>('email');

    const handleContinue = () => {
        if (!email.trim()) return;
        setStep('code');
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
        onClose();
    };

    const handleBack = () => {
        setCode('');
        setStep('email');
    };

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
                            Link Telegram
                        </Text>
                        <Text className="text-zinc-500 text-xs text-center font-sans-medium mb-6">
                            {step === 'email'
                                ? 'Enter your email to link with Telegram'
                                : 'Enter the code from @remindruz_bot'
                            }
                        </Text>

                        {step === 'email' ? (
                            <>
                                {/* Email Input */}
                                <View className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 mb-4 justify-center">
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Email address"
                                        placeholderTextColor="#52525b"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoFocus
                                        className="font-sans-bold text-white"
                                        style={{ paddingVertical: 0, fontSize: 16 }}
                                    />
                                </View>

                                {/* Actions */}
                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        onPress={handleClose}
                                        className="flex-1 h-12 bg-white/5 rounded-2xl items-center justify-center"
                                    >
                                        <Text className="text-zinc-400 font-sans-bold text-sm">Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleContinue}
                                        disabled={!email.trim()}
                                        className={`flex-1 h-12 bg-[#2AABEE] rounded-2xl items-center justify-center ${!email.trim() ? 'opacity-50' : ''}`}
                                    >
                                        <Text className="text-white font-sans-bold text-sm">Continue</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                {/* Open Bot Link */}
                                <TouchableOpacity
                                    onPress={() => Linking.openURL('https://t.me/remindruz_bot')}
                                    className="w-full h-12 bg-[#2AABEE]/10 border border-[#2AABEE]/20 rounded-2xl items-center justify-center mb-3"
                                >
                                    <Text className="text-[#2AABEE] font-sans-bold text-sm">Open @remindruz_bot</Text>
                                </TouchableOpacity>

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
                                        className="font-sans-bold text-white"
                                        style={{ paddingVertical: 0, fontSize: 16, letterSpacing: 4 }}
                                    />
                                </View>

                                {/* Error */}
                                {error && (
                                    <Text className="text-red-400 text-xs text-center mb-3 font-sans-medium">{error}</Text>
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
                                        className={`flex-1 h-12 bg-[#2AABEE] rounded-2xl items-center justify-center ${isLinking || !code.trim() ? 'opacity-50' : ''}`}
                                    >
                                        {isLinking ? (
                                            <ActivityIndicator color="white" size="small" />
                                        ) : (
                                            <Text className="text-white font-sans-bold text-sm">Link Telegram</Text>
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
