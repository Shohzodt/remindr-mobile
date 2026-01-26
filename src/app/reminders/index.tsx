import { View, Text, Image } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RemindersScreen() {
  const { user } = useAuth();
  
  return (
    <SafeAreaView className="flex-1 bg-bg-primary px-4 pt-4">
      <Text className="text-text-primary text-2xl mb-6 font-bold">Reminders List</Text>
      {user && (
        <View className="items-center mt-8">
           {user.avatarUrl && (
             <Image 
               source={{ uri: user.avatarUrl }} 
               className="w-16 h-16 rounded-full mb-2" 
               resizeMode="cover"
             />
           )}
           <Text className="text-text-secondary text-lg">Welcome, {user.displayName || 'User'}!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
