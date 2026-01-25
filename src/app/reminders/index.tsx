import { View, Text, StyleSheet } from "react-native";
import { Theme } from "@/theme";

export default function RemindersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Reminders List</Text>
    </View>
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
