import { Button } from "react-native-paper";
import AnimatedRoute from "../../../components/AnimatedRoute";
import { useAuth } from "@clerk/clerk-expo";

export default function Profile() {
  const { getToken, signOut } = useAuth();

  return (
    <AnimatedRoute className="p-6">
      <Button onPress={() => getToken().then(console.log)}>Log token</Button>
      <Button onPress={() => signOut()}>Log out</Button>
    </AnimatedRoute>
  );
}
