import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useState } from "react";
import { Dimensions, FlatList, View, useColorScheme } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import {
  Text,
  MD3DarkTheme,
  MD3LightTheme,
  Card,
  Portal,
  Modal,
  Button,
  AnimatedFAB,
  TextInput,
} from "react-native-paper";
import AnimatedRoute from "../../components/AnimatedRoute";
import RNDateTimePicker from "@react-native-community/datetimepicker";

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

  const [isExtendedFAB, setIsExtendedFAB] = useState(false);
  const [newKharchaModalVisible, setNewKharchaModalVisible] = useState(false);

  return (
    <AnimatedRoute className="flex flex-col w-full gap-y-4 flex-1 relative">
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
            radius={Dimensions.get("window").width / 4 - 25}
            innerRadius={Dimensions.get("window").width / 4 - 50}
            innerCircleColor={paperTheme.colors.background}
            centerLabelComponent={() => {
              return (
                // <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View className="justify-between items-center">
                  <Text className="text-2xl font-bold">
                    {focusedData?.value ?? 40}%
                  </Text>
                  <Text className="text-xs">
                    {focusedData?.name ?? "$40/$100"}
                  </Text>
                </View>
              );
            }}
            onPress={(value: any) => {
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
          Recent Spends
        </Text>
        <FlatList
          data={[1, 2, 3]}
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
      <AnimatedFAB
        extended={isExtendedFAB}
        className="absolute right-2 bottom-2 z-10"
        icon={"plus"}
        onPress={() => {
          setNewKharchaModalVisible(true);
        }}
        label="Add Kharcha"
      />
      <Portal>
        <Modal
          style={{
            position: "relative",
          }}
          visible={newKharchaModalVisible}
          onDismiss={() => {
            setNewKharchaModalVisible(false);
          }}
        >
          <Card className="w-full absolute bottom-0">
            <Card.Title title="Add Kharcha" />
            <Card.Content className="gap-y-2">
              <TextInput label={"Title"} />
              <View className="flex flex-row justify-between items-center">
                <Button className="w-1/3" mode="text">
                  -100
                </Button>
                <TextInput
                  className="flex-1"
                  label={"Amount"}
                  mode="outlined"
                  value="0"
                />
                <Button className="w-1/3" mode="text">
                  +100
                </Button>
              </View>
              {/* <RNDateTimePicker mode="time" value={new Date()} /> */}
            </Card.Content>
            <Card.Actions className="justify-between mt-2">
              <Button
                className="flex-1"
                onPress={() => {
                  setNewKharchaModalVisible(false);
                }}
              >
                Cancel
              </Button>
              <Button className="flex-1" mode="contained-tonal">
                Finish Later
              </Button>
              <Button className="flex-1">Next</Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </AnimatedRoute>
  );
}
