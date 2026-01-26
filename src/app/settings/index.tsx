import { View, Text, StyleSheet } from "react-native";
import { Theme } from "@/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Settings</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
  },
  text: {
    color: Theme.colors.text,
    fontSize: Theme.typography.sizes.xl,
  },
});
