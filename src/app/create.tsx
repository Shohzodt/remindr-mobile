import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Switch, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon, Clock, Mic, Info, MapPin, FileText, Lock } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Theme } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useReminders } from '@/hooks/useReminders';
import { Alert, ActivityIndicator } from 'react-native';
import { ReminderStatus, ReminderSource, ReminderPriority } from '@/types';

// Mock Categories
const CATEGORIES = [
    { id: 'work', label: 'Work', color: '#a855f7' },
    { id: 'personal', label: 'Personal', color: '#3b82f6' },
    { id: 'social', label: 'Social', color: '#10b981' },
    { id: 'other', label: 'Other', color: '#71717a' },
];

export default function CreateReminderScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
    const [isProtected, setIsProtected] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const [isFocused, setIsFocused] = useState(false);
    const notesRef = useRef<TextInput>(null);

    // Date & Time Logic
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
        setDate(currentDate);
    };

    const showMode = (currentMode: 'date' | 'time') => {
        if (showPicker && mode === currentMode) {
            setShowPicker(false);
            return;
        }
        setShowPicker(true);
        setMode(currentMode);
    };

    const { createReminder, isLoading } = useReminders();

    const handleCreate = async () => {
        if (!title.trim()) {
            Alert.alert('Missing Title', 'Please describe your reminder.');
            return;
        }

        // Format Date: YYYY-MM-DD
        const dateStr = date.toISOString().split('T')[0];

        // Format Time: HH:mm
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;

        // Default to LOW priority if not specified (could add priority picker later)
        // Default notifyBefore to 15 mins
        const success = await createReminder({
            title,
            note: notes,
            location,
            date: dateStr,
            time: timeStr,
            category: selectedCategory,
            isProtected,
            priority: ReminderPriority.MEDIUM,
            status: ReminderStatus.ACTIVE,
            source: ReminderSource.MANUAL,
            notifyBefore: 15
        });

        if (success) {
            // Haptics handled in hook
            router.back();
        }
        // Error alerts handled in hook or can be added here if needed
    };

    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1" style={{ backgroundColor: '#000000' }}>
            {/* Top draggable handle indicator (visual only) */}
            <View className="items-center pt-2">
                <View className="w-12 h-1 bg-white/20 rounded-full" />
            </View>

            <SafeAreaView className="flex-1" edges={['bottom']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <ScrollView style={{ paddingTop: insets.top }} className="flex-1 px-5" showsVerticalScrollIndicator={false}>

                        {/* Header */}
                        <View className="flex-column justify-between mb-8">
                            <View className="flex-row items-center gap-4">
                                <Text variant="h2" weight="extrabold" className="text-[32px] text-white" style={{ letterSpacing: -2, lineHeight: 34 }}>New Reminder</Text>
                                <TouchableOpacity
                                    className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl border border-accent-purple/30 bg-accent-purple/5 active:bg-accent-purple/10"
                                    onPress={() => console.log('Doc AI clicked')}
                                >
                                    <FileText size={12} color={Theme.colors.accentPurple} strokeWidth={2.5} />
                                    <Text className="text-xs font-sans-extrabold text-accent-purple uppercase tracking-widest">DOC AI</Text>
                                </TouchableOpacity>
                            </View>

                            <Text className="text-[#71717a] tracking-wider font-sans-medium text-sm">What should we remember?</Text>
                        </View>

                        {/* Main Input (Natural Language) */}
                        <View className={`bg-[#151518] border rounded-3xl mb-5 min-h-[150px] relative ${isFocused ? 'border-accent-purple' : 'border-white/10'}`}>
                            <TextInput
                                placeholder="e.g. Design review, Contract renewal, Rent payment"
                                placeholderTextColor="#71717b"
                                className="flex-1 text-xl font-sans-bold text-white"
                                multiline
                                textAlignVertical="top"
                                value={title}
                                selectionColor={Theme.colors.accentPurple}
                                onChangeText={setTitle}
                                style={{
                                    lineHeight: 24,
                                    paddingTop: 24,
                                    paddingBottom: 30,
                                    paddingLeft: 24,
                                    paddingRight: 76,
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                autoFocus
                            />
                            <TouchableOpacity className="absolute bottom-5 right-5 w-[48px] h-[48px] bg-[#202022] rounded-md items-center justify-center border border-white/5 active:bg-white/10">
                                <Mic size={24} color="#71717a" />
                            </TouchableOpacity>
                        </View>

                        {/* AI Tip */}
                        <LinearGradient
                            colors={['rgba(168, 85, 247, 0.1)', 'transparent']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 16,
                                padding: 16,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: 'rgba(168, 85, 247, 0.2)',
                                marginBottom: 32,
                            }}
                        >
                            <View className="w-10 h-10 bg-accent-purple/10 rounded-md items-center justify-center border border-accent-purple/10">
                                <Info size={20} color={Theme.colors.accentPurple} />
                            </View>
                            <View className="flex-1 flex-col leading-relaxed">
                                <Text className="text-accent-purple font-sans-bold text-xs uppercase">Tip: </Text>
                                <Text className="text-[#9f9fa9] text-xs font-sans-medium">
                                    Speak naturally in your native language. Remindr AI understands 50+ tongues and formats them perfectly.
                                </Text>
                            </View>
                        </LinearGradient>

                        {/* Date & Time */}
                        <View className="flex-row gap-3 mb-2">
                            <View className="flex-1">
                                <Text className="text-[#52525c] mb-2.5 px-1 text-xs font-sans-extrabold tracking-widest uppercase">DATE</Text>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => showMode('date')}
                                    className="bg-[#151518] border border-white/10 rounded-2xl h-14 flex-row items-center px-4 gap-3 active:bg-white/5"
                                >
                                    <CalendarIcon size={18} color="#71717a" />
                                    <Text className="text-white font-sans-bold text-[15px]">
                                        {date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-1">
                                <Text className="text-[#52525c] mb-2.5 px-1 text-xs font-sans-extrabold tracking-widest uppercase">TIME</Text>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => showMode('time')}
                                    className="bg-[#151518] border border-white/10 rounded-2xl h-14 flex-row items-center px-4 gap-3 active:bg-white/5"
                                >
                                    <Clock size={18} color="#71717a" />
                                    <Text className="text-[#71717a] font-sans-bold text-[15px]">
                                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {showPicker && (
                            <Animated.View
                                entering={FadeIn}
                                className="mb-4 bg-[#151518] rounded-2xl overflow-hidden border border-white/10"
                            >
                                <View className="flex-row justify-end px-4 pt-3 pb-1 border-b border-white/5 mx-1">
                                    <TouchableOpacity
                                        onPress={() => setShowPicker(false)}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Text className="text-accent-purple font-sans-bold text-sm">Done</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="items-center justify-center py-2">
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode={mode}
                                        is24Hour={true}
                                        display={Platform.OS === 'ios' ? (mode === 'date' ? 'inline' : 'spinner') : 'default'}
                                        onChange={onChange}
                                        themeVariant="dark"
                                        accentColor={Theme.colors.accentPurple}
                                        textColor="white"
                                        style={{ height: Platform.OS === 'ios' && mode === 'date' ? 320 : undefined }}
                                    />
                                </View>
                            </Animated.View>
                        )}

                        {/* Categories */}
                        <View className="my-5">
                            <Text className="text-[#52525c] mb-3 px-1 text-xs font-sans-extrabold tracking-widest uppercase">CATEGORY</Text>
                            <View className="flex-row gap-2 flex-wrap">
                                {CATEGORIES.map(cat => {
                                    const isSelected = selectedCategory === cat.id;
                                    return (
                                        <TouchableOpacity
                                            key={cat.id}
                                            onPress={() => setSelectedCategory(cat.id)}
                                            activeOpacity={0.8}
                                            className=''
                                        >
                                            <LinearGradient
                                                colors={isSelected ?
                                                    ['#e12afb', '#9810fa'] :
                                                    ['#27272a', '#27272a']}
                                                style={{
                                                    flex: 1,
                                                    borderRadius: 16,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 80,
                                                    height: 42,
                                                }}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                            >
                                                <Text
                                                    className={'text-xs font-sans-bold text-white'}
                                                >
                                                    {cat.label}
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Add More Details Section Label */}
                        <TouchableOpacity
                            onPress={() => setShowDetails(!showDetails)}
                            className="flex-row items-center gap-2 mt-2 mb-4 py-2"
                            activeOpacity={0.7}
                        >
                            <Text className="text-[#52525c] font-sans-bold text-xs uppercase tracking-wide">+ ADD MORE DETAILS</Text>
                        </TouchableOpacity>

                        {showDetails && (
                            <View>
                                {/* Location */}
                                <View className="mb-6">
                                    <Text className="text-[#52525c] mb-2.5 px-1 text-xs font-sans-extrabold tracking-widest uppercase">LOCATION</Text>
                                    <View className="bg-[#151518] border border-white/10 rounded-2xl flex-row items-center px-4 py-4 gap-3">
                                        <MapPin size={18} color="#71717a" />
                                        <TextInput
                                            selectionColor={Theme.colors.accentPurple}
                                            placeholder="Where is it?"
                                            className="flex-1 text-white font-sans-medium text-md"
                                            value={location}
                                            onChangeText={setLocation}
                                        />
                                    </View>
                                </View>

                                {/* Notes */}
                                <View className="mb-8">
                                    <Text className="text-[#52525c] mb-2.5 px-1 text-xs font-sans-extrabold tracking-widest uppercase">NOTES</Text>
                                    <Pressable
                                        onPress={() => notesRef.current?.focus()}
                                        className="flex items-start px-4 py-5 bg-[#151518] border border-white/10 rounded-2xl min-h-[100px] flex-row gap-3"
                                    >
                                        <FileText size={18} color="#71717a" />
                                        <TextInput
                                            ref={notesRef}
                                            placeholder="Add additional notes..."
                                            className="flex-1 text-white font-sans-medium text-md"
                                            style={{
                                                marginTop: -4
                                            }}
                                            selectionColor={Theme.colors.accentPurple}
                                            multiline
                                            textAlignVertical="top"
                                            value={notes}
                                            onChangeText={setNotes}
                                        />
                                    </Pressable>
                                </View>
                            </View>
                        )}

                        {/* Protect Deadline */}
                        <View className="bg-[#151518] border border-white/10 rounded-3xl p-4 flex-row items-center gap-4 mb-32">
                            <View className="w-10 h-10 bg-[#202022] rounded-xl items-center justify-center">
                                <Lock size={18} color="#71717a" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-sans-bold text-sm">Protect this deadline</Text>
                                <Text className="text-[#71717a] text-xs mt-1 font-sans-bold">If missed, escalation and notifications will occur.</Text>
                            </View>
                            <Switch
                                value={isProtected}
                                onValueChange={setIsProtected}
                                trackColor={{ false: '#27272a', true: '#9810fa' }}
                                thumbColor="white"
                            />
                        </View>

                    </ScrollView>

                    {/* Bottom Button Fixed */}
                    <View className="absolute bottom-8 left-0 right-0 px-6">
                        <TouchableOpacity
                            activeOpacity={0.9}
                            className="w-full h-16"
                            onPress={handleCreate}
                            disabled={isLoading}
                        >
                            <LinearGradient
                                colors={['#e12afb', '#9810fa']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    flex: 1,
                                    borderRadius: 24,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: isLoading ? 0.7 : 1
                                }}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-sans-extrabold text-base tracking-wide">
                                        Create Reminder
                                    </Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
