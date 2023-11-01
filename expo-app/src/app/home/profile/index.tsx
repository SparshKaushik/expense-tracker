import { Button, Text } from "react-native-paper";
import AnimatedRoute from "../../../components/AnimatedRoute";
import { useAuth } from "@clerk/clerk-expo";

export default function Profile() {
  const { signOut } = useAuth();
  return (
    <AnimatedRoute className="p-6">
      <Button onPress={() => signOut()}>Log out</Button>
    </AnimatedRoute>
  );
}
