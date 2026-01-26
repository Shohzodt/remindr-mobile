import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Theme } from "@/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

export default function SettingsScreen() {
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
  },
  title: {
    color: Theme.colors.text,
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: "bold",
    marginBottom: Theme.spacing.xl,
  },
  section: {
    marginTop: Theme.spacing.md,
  },
  logoutButton: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.md,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.secondary, // Making it distinct
  },
  logoutText: {
    color: Theme.colors.secondary,
    fontSize: Theme.typography.sizes.md,
    fontWeight: "600",
  },
});
