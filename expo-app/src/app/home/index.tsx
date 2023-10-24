import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import {
  Avatar,
  MD3Colors,
  Text,
  MD3DarkTheme,
  MD3LightTheme,
  Card,
  Button,
} from "react-native-paper";
import BubbleChart from "../../components/BubbleChart";
import { pie } from "d3";

export default function Home() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  const pieData = [
    {
      name: "Excellent",
      value: 40,
      color: "#009FFF",
    },
    {
      name: "Good",
      value: 20,
      color: "#FFBF00",
    },
    {
      name: "Average",
      value: 10,
      color: "#FF7F50",
    },
    {
      name: "Poor",
      value: 10,
      color: "#FF0000",
    },
  ];

  // default - largest in piedata programmatically
  const [focusedData, setFocusedData] = useState(null);

  return (
    <View className="flex flex-col px-8 pt-4 w-full">
      <View className="flex flex-row pb-4 justify-between items-center"></View>
      <View className="w-full flex flex-row items-center">
        <View className=" w-[50%]">
          {/* <BubbleChart
            width={Dimensions.get("window").width / 2.2}
            height={Dimensions.get("window").width / 2}
            data={pieData}
          /> */}
          <PieChart
            data={pieData}
            donut
            focusOnPress
            radius={90}
            innerRadius={60}
            innerCircleColor={paperTheme.colors.background}
            centerLabelComponent={() => {
              return (
                // <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View className="justify-between items-center">
                  <Text className="text-2xl font-bold text-white">
                    {focusedData?.value ?? 40}%
                  </Text>
                  <Text className="text-xs text-white">
                    {focusedData?.name ?? "$40/$100"}
                  </Text>
                </View>
              );
            }}
            onPress={(value) => {
              setFocusedData(value);
            }}
          />
        </View>
        <View className="flex flex-col gap-2 flex-1">
          <Card>
            <Card.Content className="items-center">
              <Text variant="titleLarge">$1000</Text>
              <Text variant="bodyMedium">Total Balance</Text>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="relative flex flex-row items-center">
              <View
                className="w-[50%] items-center border-r border-solid"
                style={{
                  borderColor: paperTheme.colors.onPrimaryContainer,
                }}
              >
                <Text variant="titleLarge">$180</Text>
                <Text variant="bodyMedium">Spent</Text>
              </View>
              <View className="w-[50%] items-center">
                <Text variant="titleLarge">$780</Text>
                <Text variant="bodyMedium">Budget</Text>
              </View>
              <Text className="absolute bottom-px right-1" variant="labelSmall">
                This Month
              </Text>
            </Card.Content>
          </Card>
        </View>
      </View>
    </View>
  );
}
