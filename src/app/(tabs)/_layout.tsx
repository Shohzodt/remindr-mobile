import { Tabs, Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { TabBar } from "@/components/navigation/TabBar";
import * as Haptics from 'expo-haptics';

export default function TabLayout() {
    const router = useRouter();

    // Create Button Handler for the TabBar
    // Note: We need to pass this or handle it inside TabBar. 
    // The TabBar component likely handles the create button itself OR we can intercept here?
    // Checking TabBar.tsx, it uses 'handleCreate'. 
    // It handles navigation inside TabBar.tsx. 
    // So we just need to ensure the route exists.
    // BUT now 'create' is NOT in the Tabs. It is in the Root Stack.
    // The TabBar needs to push to '/create'. 
    // Since 'create' is a global route '/create', router.push('/create') works from anywhere.

    return (
        <Tabs
            tabBar={props => <TabBar {...props} />}
            screenOptions={{
                headerShown: false,
                sceneStyle: { backgroundColor: '#050505' }
            }}
        >
            <Tabs.Screen name="(timeline)" options={{ title: "Timeline" }} />
            <Tabs.Screen name="discover/index" options={{ title: "Discover" }} />
            <Tabs.Screen name="calendar/index" options={{ title: "Calendar" }} />
            <Tabs.Screen name="settings" options={{ title: "Settings" }} />
        </Tabs>
    );
}
