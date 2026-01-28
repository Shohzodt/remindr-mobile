import { Stack } from "expo-router";
import { Theme } from "@/theme";

export default function SettingsLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: Theme.colors.surface },
                headerTintColor: Theme.colors.text,
                headerTitleStyle: { fontWeight: "bold", fontFamily: 'PlusJakartaSans_700Bold' },
                contentStyle: { backgroundColor: Theme.colors.background },
                headerShown: false,
                animation: 'default', // Ensure animations are enabled
                gestureEnabled: true, // Ensure gestures are enabled
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
            <Stack.Screen name="security" options={{ headerShown: false }} />
            <Stack.Screen name="plans-billing" options={{ headerShown: false }} />
        </Stack>
    );
}
