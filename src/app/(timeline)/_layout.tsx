import { Stack } from "expo-router";
import { Theme } from "@/theme";

export default function TimelineLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: Theme.colors.surface },
                headerTintColor: Theme.colors.text,
                headerTitleStyle: { fontWeight: "bold", fontFamily: 'PlusJakartaSans_700Bold' },
                contentStyle: { backgroundColor: Theme.colors.background },
                headerShown: false,
                animation: 'default',
                gestureEnabled: true,
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="reminders/index" options={{ headerShown: false }} />
        </Stack>
    );
}
