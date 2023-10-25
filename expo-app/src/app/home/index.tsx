import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useState } from "react";
import { Dimensions, FlatList, View, useColorScheme } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Text, MD3DarkTheme, MD3LightTheme, Card } from "react-native-paper";

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
  const [focusedData, setFocusedData] = useState<{
    name: string;
    value: number;
    color: string;
  } | null>(null);

  return (
    <View className="flex flex-col w-full gap-y-4">
      <View className="flex flex-row pb-4 justify-between items-center"></View>
      <View className="px-8 w-full flex flex-row items-center">
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
              if (focusedData?.name === value.name) {
                setFocusedData(null);
                return;
              }
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
      <View className="w-full">
        <Text className="px-8 pb-2" variant="titleMedium">
          Recent Spends
        </Text>
        <View className="relative">
          <FlatList
            data={[1, 2, 3]}
            horizontal
            renderItem={({ item, index }) => (
              <>
                {index === 0 ? <View className="w-8" /> : <></>}
                <Card
                  className="mr-2 mb-2"
                  style={{
                    width: Dimensions.get("window").width / 2,
                  }}
                >
                  <Card.Content className="flex flex-row justify-between items-center">
                    <View className="flex flex-col">
                      <Text variant="bodyMedium">Title</Text>
                      <Text variant="bodySmall">Date Time</Text>
                    </View>
                    <Text variant="bodyMedium">$100</Text>
                  </Card.Content>
                </Card>
              </>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
}
