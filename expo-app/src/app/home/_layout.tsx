import { Slot, router, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Avatar, BottomNavigation, Icon } from "react-native-paper";

export default function LoggedInLayout() {
  const routes: {
    key: string;
    title: string;
    icon: string;
    url: string;
  }[] = [
    { key: "home", title: "Home", icon: "home", url: "/home" },
    {
      key: "reports",
      title: "Reports",
      icon: "chart-bar",
      url: "/home/reports",
    },

    { key: "profile", title: "Profile", icon: "account", url: "/home/profile" },
  ];

  const path = usePathname();

  return (
    <View style={styles.container}>
      <Slot />
      <BottomNavigation.Bar
        navigationState={{
          index: routes.findIndex((r) => r.url === path),
          routes,
        }}
        onTabPress={({ route }) => {
          router.replace(route.url);
        }}
        renderIcon={({ route, focused, color }) => {
          if (route.key === "profile") {
            return <Avatar.Text size={24} label="SK" />;
          }
          return <Icon source={route.icon} size={24} color={color} />;
        }}
        getLabelText={({ route }) => {
          return route.title;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
