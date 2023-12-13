import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useState } from "react";
import { Dimensions, FlatList, View, useColorScheme } from "react-native";
import { Text, MD3DarkTheme, MD3LightTheme, Card } from "react-native-paper";
import AnimatedRoute from "../../components/AnimatedRoute";
import NewKharchaFAB from "../../components/NewKharchaFAB";
import BubbleChart from "../../components/BubbleChart";
import { useUserData } from "../../models/user";
import { useExpensesData } from "../../models/expense";

export default function Home() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  const pieData = [
    {
      name: `Excellent`,
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

  const [isExtendedFAB, setIsExtendedFAB] = useState(false);

  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  });

  const userData = useUserData();
  const recentExpenseData = useExpensesData({
    limit: 5,
    offset: 0,
    sortBy: "dateTime",
  });

  return (
    <AnimatedRoute className="flex flex-col w-full gap-y-4 flex-1 relative pt-2">
      <View className="px-8 w-full flex flex-row items-center">
        <View
          className="w-[50%]"
          onLayout={(e) => {
            setChartDimensions({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            });
          }}
        >
          <BubbleChart
            width={chartDimensions.width - 10}
            height={chartDimensions.height}
            data={pieData}
            key={pieData.map((d) => d.name).join("")}
          />
        </View>
        <View className="flex flex-col gap-2 flex-1">
          <Card>
            <Card.Content className="items-center">
              <Text variant="titleLarge">{userData.data?.funds ?? 0}</Text>
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
              <View className="w-[50%] items-center relative">
                <Text variant="titleLarge">$780</Text>
                <Text variant="bodyMedium">Budget</Text>
                <Text className="absolute -bottom-3.5 text-xs p-0">
                  (Monthly)
                </Text>
              </View>
              {/* <Text className="absolute bottom-px right-1" variant="labelSmall">
                This Month
              </Text> */}
            </Card.Content>
          </Card>
        </View>
      </View>
      <View className="w-full">
        <Text className="px-8 pb-2" variant="titleMedium">
          Recent Transactions
        </Text>
        <FlatList
          data={recentExpenseData.data}
          horizontal
          renderItem={({ item, index }) => (
            <>
              {index === 0 ? <View className="w-8" /> : <></>}
              <Card
                className="mr-2"
                style={{
                  width: Dimensions.get("window").width / 2,
                }}
              >
                <Card.Content className="flex flex-row justify-between items-center">
                  <View className="flex flex-col">
                    <Text variant="bodyMedium">
                      {item.title ?? item.category}
                    </Text>
                    <Text variant="bodySmall">
                      {new Date(item.dateTime).toLocaleString()}
                    </Text>
                  </View>
                  <Text variant="bodyMedium">
                    {item.type === "Debit" ? "-" : "+"}${item.amount}
                  </Text>
                </Card.Content>
              </Card>
            </>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View className="w-full px-8 flex-1">
        <Text className="mb-2" variant="titleMedium">
          Budget Warnings
        </Text>
        <FlatList
          onScroll={(e) => {
            const currentScrollPosition =
              Math.floor(e.nativeEvent?.contentOffset?.y) ?? 0;
            setIsExtendedFAB(currentScrollPosition <= 0);
          }}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          renderItem={({ item }) => (
            <Card className="mb-2 relative">
              <Card.Content>
                <View className="flex flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text variant="bodyMedium">Title {item}</Text>
                    <Text variant="bodySmall" className="p-0 m-0">
                      bruh {item}
                    </Text>
                  </View>
                  <Text variant="bodyMedium">${item}00 left</Text>
                </View>
                <View
                  className="absolute bottom-0 left-0 right-0 h-10 border-b-2 w-1/2 rounded-l-2xl"
                  style={{
                    borderColor: paperTheme.colors.primary,
                  }}
                />
              </Card.Content>
            </Card>
          )}
        />
      </View>
      <NewKharchaFAB />
    </AnimatedRoute>
  );
}
