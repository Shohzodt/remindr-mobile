import { ViewStyle } from "react-native";

export const Layout = {
    /**
     * Standard padding for ScrollViews to avoid content being hidden behind the absolute TabBar.
     * TabBar height is ~100px.
     */
    tabBarAwareContent: {
        paddingBottom: 110, // 100 + 10 extra buffer
    } as ViewStyle,

    screenContainer: {
        flex: 1,
        paddingHorizontal: 16,
    } as ViewStyle,
};
