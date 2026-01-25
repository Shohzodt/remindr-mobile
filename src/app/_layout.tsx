import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { Theme } from "@/theme";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Theme.colors.surface },
            headerTintColor: Theme.colors.text,
            headerTitleStyle: { fontWeight: "bold" },
            contentStyle: { backgroundColor: Theme.colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
          <Stack.Screen name="reminders/index" options={{ title: "Reminders" }} />
          <Stack.Screen name="settings/index" options={{ title: "Settings" }} />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
});
