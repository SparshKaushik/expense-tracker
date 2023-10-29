import { View } from "moti";
import { ViewProps } from "react-native";

export default function AnimatedRoute(props: ViewProps) {
  return (
    <View
      from={{
        opacity: 0,
        scale: 0.9,
        translateX: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        translateX: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
      }}
      transition={{
        type: "timing",
        duration: 500,
      }}
      {...props}
    >
      {props.children}
    </View>
  );
}
