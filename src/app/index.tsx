import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Theme } from "@/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Remindr</Text>
        <Text style={styles.subtitle}>Stay organized, effortlessly.</Text>
        
        <View style={styles.buttonContainer}>
          <Link href="/reminders" asChild>
            <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
              <Text style={styles.primaryButtonText}>My Reminders</Text>
            </Pressable>
          </Link>
          
          <Link href="/settings" asChild>
            <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
              <Text style={styles.secondaryButtonText}>Settings</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: "bold",
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xl,
    opacity: 0.8,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 380,
    gap: Theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: Theme.colors.primary,
    width: "100%",
    paddingVertical: Theme.spacing.md,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: Theme.typography.sizes.lg,
  },
  secondaryButton: {
    backgroundColor: Theme.colors.surface,
    width: "100%",
    paddingVertical: Theme.spacing.md,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  secondaryButtonText: {
    color: Theme.colors.muted,
    fontWeight: "500",
    fontSize: Theme.typography.sizes.lg,
  },
  buttonPressed: {
    opacity: 0.9,
  },
});
