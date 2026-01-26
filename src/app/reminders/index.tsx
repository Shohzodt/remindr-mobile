import { View, Text, StyleSheet, Image } from "react-native";
import { Theme } from "@/theme";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RemindersScreen() {
  const { user } = useAuth();
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Reminders List</Text>
      {user && (
        <View style={styles.userInfo}>
           {user.avatarUrl && (
             <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
           )}
           <Text style={styles.welcome}>Welcome, {user.displayName || 'User'}!</Text>
        </View>
      )}
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
    marginBottom: Theme.spacing.lg,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: Theme.spacing.sm,
  },
  welcome: {
    color: Theme.colors.muted,
    fontSize: Theme.typography.sizes.lg,
  },
});
