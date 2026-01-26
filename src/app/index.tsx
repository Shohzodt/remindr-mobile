import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-accent-purple text-4xl font-bold mb-2">Remindr</Text>
        <Text className="text-text-secondary text-lg mb-8 opacity-80">Stay organized, effortlessly.</Text>
        
        <View className="w-full max-w-sm gap-4">
          <Link href="/reminders" asChild>
            <Pressable className="bg-accent-purple w-full py-4 rounded-2xl items-center active:opacity-90">
              <Text className="text-white font-bold text-lg">My Reminders</Text>
            </Pressable>
          </Link>
          
          <Link href="/settings" asChild>
            <Pressable className="bg-bg-surface w-full py-4 rounded-2xl items-center border border-bg-surface active:opacity-90">
              <Text className="text-text-secondary font-medium text-lg">Settings</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
