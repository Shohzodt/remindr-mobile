import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

export default function SettingsScreen() {
  const { logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-bg-primary px-4 pt-4">
      <Text className="text-text-primary text-3xl font-bold mb-8">Settings</Text>
      
      <View className="mt-4">
        <TouchableOpacity 
          className="bg-bg-surface p-4 rounded-xl items-center border border-accent-purple" 
          onPress={logout}
        >
          <Text className="text-accent-purple text-base font-semibold">Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
