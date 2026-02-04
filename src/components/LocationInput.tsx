import React, { useMemo } from 'react';
import { View, TextInput, TextInputProps, TouchableOpacity, Linking } from 'react-native';
import { MapPin, Video, ExternalLink } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { parseLocation, LocationProvider, PROVIDER_CONFIG } from '@/utils/locationParser';
import { Theme } from '@/theme';

interface LocationInputProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
}

export const LocationInput = ({ value, onChangeText, ...props }: LocationInputProps) => {
    const parsed = useMemo(() => parseLocation(value), [value]);
    const hasProvider = (parsed.type === 'meeting' || parsed.type === 'location') && parsed.provider;

    const handleOpenLink = () => {
        if (parsed.url) {
            Linking.openURL(parsed.url).catch(err => console.error("Couldn't open URL:", err));
        }
    };

    return (
        <View>
            <View className="h-14 bg-[#151518] border border-white/10 rounded-2xl flex-row items-center px-4 py-4 gap-3">
                <MapPin size={20} color="#71717a" />
                <TextInput
                    placeholder="Where is it?"
                    placeholderTextColor="#71717a"
                    className="h-full flex-1 text-white font-sans-medium text-md"
                    selectionColor={Theme.colors.accentPurple}
                    value={value}
                    onChangeText={onChangeText}
                    textAlignVertical="center"
                    style={{
                        paddingRight: hasProvider ? 142 : 0, // Prevent text overlap with badge
                        paddingVertical: 0,
                        textAlignVertical: 'center',
                    }}
                    {...props}
                />
            </View>

            {/* Smart Badge */}
            {hasProvider && parsed.provider && (() => {
                const config = PROVIDER_CONFIG[parsed.provider];
                const IconComponent = config.icon === 'video' ? Video : MapPin;
                return (
                    <TouchableOpacity
                        onPress={handleOpenLink}
                        className="absolute right-4 top-3.5 flex-row items-center px-2.5 py-1.5 rounded-lg border"
                        style={{
                            backgroundColor: config.bg,
                            borderColor: config.color,
                        }}
                    >
                        <IconComponent size={12} color={config.color} style={{ marginRight: 6 }} />
                        <Text
                            className="text-xs font-sans-bold"
                            style={{ color: config.color }}
                        >
                            {config.label}
                        </Text>
                        <View className="w-[1px] h-3 mx-2 bg-white/20" />
                        <ExternalLink size={10} color={config.color} />
                    </TouchableOpacity>
                );
            })()}
        </View>
    );
};

