import { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { useOAuth, useUser } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function App() {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/home");
    }
  }, [isSignedIn]);

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  return (
    <View
      className="w-full h-full justify-center items-center"
      onLayout={() => {
        if (isSignedIn) {
          router.replace("/home");
        }
      }}
    >
      {isLoaded && !isSignedIn ? (
        <Button icon={"google"} mode="contained" onPress={onPress}>
          Sign in with Google
        </Button>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
}
