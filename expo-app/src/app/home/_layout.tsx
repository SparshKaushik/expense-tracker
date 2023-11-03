import { useAuth, useUser } from "@clerk/clerk-expo";
import { Slot, router, usePathname } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, BottomNavigation, Icon } from "react-native-paper";
import { axiosClient } from "../../lib/axios";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function LoggedInLayout() {
  const { isSignedIn, isLoaded, getToken } = useAuth();

  axiosClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  useEffect(() => {
    if (!isSignedIn && isLoaded) {
      router.replace("/");
    }
  }, [isSignedIn]);

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

  const { user } = useUser();

  return (
    <View style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
      <BottomNavigation.Bar
        navigationState={{
          index: routes.findIndex((r) => r.url === path),
          routes,
        }}
        onTabPress={({ route }) => {
          if (path === route.url) return;
          router.replace(route.url);
        }}
        renderIcon={({ route, focused, color }) => {
          if (route.key === "profile" && user?.firstName && user?.lastName) {
            return (
              <Avatar.Text
                size={24}
                label={(
                  user?.firstName?.slice(0, 1) + user?.lastName?.slice(0, 1)
                ).toUpperCase()}
              />
            );
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
