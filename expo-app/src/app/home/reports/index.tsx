import { FlatList, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Divider,
  Text,
} from "react-native-paper";
import DropDownMenu, { DropDownMenu_t } from "../../../components/DropDownMenu";
import AnimatedRoute from "../../../components/AnimatedRoute";
import { useEffect, useState } from "react";
import { useExpensesData } from "../../../models/expense";
import { useTagsData } from "../../../models/tags";

export default function Reports() {
  const menus: DropDownMenu_t[] = [
    {
      name: "Category",
      anchorIcon: "chevron-down",
      items: [{ name: "Item 1" }, { name: "Item 2" }, { name: "Item 3" }],
      extraNode: <Text>Calendar</Text>,
    },
  ];

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const expenseData = useExpensesData();
  const tagsData = useTagsData();

  return (
    <AnimatedRoute className="flex flex-col flex-1 p-6 gap-y-2">
      <Button
        className="absolute top-2 right-2"
        icon={"reload"}
        onPress={() => expenseData.refetch()}
        children={<></>}
      />
      <View>
        <FlatList
          data={menus}
          renderItem={({ item }) => (
            <View
              className="flex flex-row items-center self-start"
              key={item.name}
            >
              <DropDownMenu key={item.name} {...item} multiSelect />
              {item.extraNode}
            </View>
          )}
          horizontal
          keyExtractor={(item) => item.name}
        />
      </View>
      <Divider />
      {!tagsData.isLoading && tagsData.data && tagsData.data.length > 0 && (
        <>
          <View className="flex flex-row flex-wrap -mx-6">
            <FlatList
              data={tagsData.data}
              renderItem={({ item, index }) => (
                <>
                  {index === 0 && <View className="px-3" />}
                  <Chip
                    className="m-1 self-start"
                    mode={
                      selectedTags.includes(item.name) ? "flat" : "outlined"
                    }
                    selected={selectedTags.includes(item.name)}
                    onPress={() => {
                      if (selectedTags.includes(item.name)) {
                        setSelectedTags((prev) =>
                          prev.filter((tag) => tag !== item.name)
                        );
                      } else {
                        setSelectedTags((prev) => [...prev, item.name]);
                      }
                    }}
                  >
                    {item.name}
                  </Chip>
                </>
              )}
              keyExtractor={(item) => item.name}
              horizontal
            />
          </View>
          <Divider />
        </>
      )}
      <View className="flex-1">
        {expenseData.isLoading || expenseData.isRefetching ? (
          <ActivityIndicator className="my-4" />
        ) : (
          <>
            <FlatList
              data={expenseData.data}
              renderItem={({ item }) => (
                <Card className="my-1">
                  <Card.Content>
                    <View className="flex flex-row justify-between items-center">
                      <View className="flex-1">
                        <Text variant="bodyMedium">
                          {item.title ?? "Not Set Yet"}
                        </Text>
                        <Text variant="bodySmall" className="p-0 m-0">
                          {item.category}
                        </Text>
                      </View>
                      <Text variant="bodyMedium">
                        {item.type === "Debit" ? "-" : "+"}${item.amount}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              )}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={() => (
                <Text className="text-center" variant="bodyMedium">
                  No Expenses Found
                </Text>
              )}
            />
          </>
        )}
      </View>
    </AnimatedRoute>
  );
}
