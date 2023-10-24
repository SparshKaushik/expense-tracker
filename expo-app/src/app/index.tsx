import { Link } from "expo-router";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function App() {
  return (
    <View>
      <Link href="/home">
        <Button icon="home" mode="contained-tonal">
          Go to Home
        </Button>
      </Link>
    </View>
  );
}
