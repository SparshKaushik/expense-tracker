import { Slot } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, BottomNavigation, Icon } from "react-native-paper";

export default function LoggedInLayout() {
  const routes = [
    { key: "home", title: "Home", icon: "home" },
    { key: "profile", title: "Profile", icon: "account" },
  ];

  return (
    <View style={styles.container}>
      <Slot />
      <BottomNavigation.Bar
        navigationState={{ index: 0, routes }}
        onTabPress={({ route }) => {
          console.log("onTabPress", route);
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
