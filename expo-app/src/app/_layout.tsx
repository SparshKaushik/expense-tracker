import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaView
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: paperTheme.colors.background,
        }}
      >
        <Slot />
      </SafeAreaView>
    </PaperProvider>
  );
}
