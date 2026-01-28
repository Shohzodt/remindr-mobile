import { Tabs, Stack, useRouter, useSegments } from "expo-router";
import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { Theme } from "@/theme";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold, PlusJakartaSans_400Regular_Italic, PlusJakartaSans_500Medium_Italic, PlusJakartaSans_600SemiBold_Italic, PlusJakartaSans_700Bold_Italic, PlusJakartaSans_800ExtraBold_Italic } from "@expo-google-fonts/plus-jakarta-sans";
import * as SplashScreen from 'expo-splash-screen';
import { TabBar } from "@/components/navigation/TabBar";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the login page if not authenticated
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect back to the home page if authenticated
      router.replace('/');
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return <View style={styles.container} />;
  }

  // If not authenticated, show Auth Stack
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
        </Stack>
      </View>
    );
  }

  // Authenticated: Show Main Stack (Tabs + Modal)
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main Tabs Group */}
        <Stack.Screen name="(tabs)" />

        {/* Create Modal - Covers Tabs */}
        <Stack.Screen
          name="create"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom', // Explicit animation
            gestureEnabled: true,
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="reminders/[id]"
          options={{
            presentation: 'modal',
            animation: 'default',
            headerShown: false,
            sheetAllowedDetents: [0.9],
            sheetGrabberVisible: true,
            sheetCornerRadius: 24,
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    PlusJakartaSans_400Regular_Italic,
    PlusJakartaSans_500Medium_Italic,
    PlusJakartaSans_600SemiBold_Italic,
    PlusJakartaSans_700Bold_Italic,
    PlusJakartaSans_800ExtraBold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#050505',
  },
});
