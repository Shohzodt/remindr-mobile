import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { Theme } from "@/theme";

export default function DiscoverScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: Theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
            <Text variant="h2" weight="bold" style={{ color: Theme.colors.text }}>Discover</Text>
        </View>
    );
}
