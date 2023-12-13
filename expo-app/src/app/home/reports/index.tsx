import { FlatList, View } from "react-native";
import {
  ActivityIndicator,
  Card,
  Chip,
  Divider,
  Icon,
  IconButton,
  Searchbar,
  Text,
  TouchableRipple,
} from "react-native-paper";
import DropDownMenu, { DropDownMenu_t } from "../../../components/DropDownMenu";
import AnimatedRoute from "../../../components/AnimatedRoute";
import { useState } from "react";
import { useExpensesData } from "../../../models/expense";
import { useTagsData } from "../../../models/tags";

export default function Reports() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<{
    type?: "Debit" | "Credit";
    category?: string;
    tags?: string;
    dateStart?: number;
    dateEnd?: number;
  }>({});

  const menus: DropDownMenu_t[] = [
    {
      name: `Type ${filterOptions.type ? `(${filterOptions.type})` : ""}`,
      anchorIcon: "chevron-down",
      items: [{ name: "Debit" }, { name: "Credit" }],
      onSelectItem: (item) =>
        setFilterOptions((prev) => ({
          ...prev,
          type: (item as "Debit" | "Credit") ?? undefined,
        })),
      selectedItems: filterOptions.type ? [filterOptions.type] : undefined,
      onClear: () =>
        setFilterOptions((prev) => ({
          ...prev,
          type: undefined,
        })),
    },
    {
      name: `Category ${
        filterOptions.category ? `(${filterOptions.category})` : ""
      }`,
      anchorIcon: "chevron-down",
      items: [
        { name: "Food" },
        { name: "Travel" },
        { name: "Shopping" },
        { name: "Bills" },
        { name: "Others" },
      ],
      onSelectItem: (item) =>
        setFilterOptions((prev) => ({
          ...prev,
          category: item ?? undefined,
        })),
      selectedItems: filterOptions.category
        ? [filterOptions.category]
        : undefined,
      onClear: () =>
        setFilterOptions((prev) => ({
          ...prev,
          category: undefined,
        })),
    },
    {
      name: `Date ${
        filterOptions.dateStart
          ? `(${new Date(
              filterOptions.dateStart
            ).toLocaleDateString()} - ${new Date(
              filterOptions.dateEnd ?? 0
            ).toLocaleDateString()})`
          : ""
      }`,
      anchorIcon: "chevron-down",
      items: [
        {
          name: "Today",
          onPress: () =>
            setFilterOptions((prev) => ({
              ...prev,
              dateStart: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
              dateEnd: new Date().getTime(),
            })),
        },
        {
          name: "This Week",
          onPress: () => {
            const date = new Date();
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1);
            setFilterOptions((prev) => ({
              ...prev,
              dateStart: new Date(date.setDate(diff)).getTime(),
              dateEnd: new Date().getTime(),
            }));
          },
        },
        {
          name: "Last 7 Days",
          onPress: () =>
            setFilterOptions((prev) => ({
              ...prev,
              dateStart: new Date(
                new Date().getTime() - 7 * 24 * 60 * 60 * 1000
              ).getTime(),
              dateEnd: new Date().getTime(),
            })),
        },
        {
          name: "Last 30 Days",
          onPress: () =>
            setFilterOptions((prev) => ({
              ...prev,
              dateStart: new Date(
                new Date().getTime() - 30 * 24 * 60 * 60 * 1000
              ).getTime(),
              dateEnd: new Date().getTime(),
            })),
        },
        {
          name: "This Month",
          onPress: () => {
            const date = new Date();
            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            const lastDay = new Date(
              date.getFullYear(),
              date.getMonth() + 1,
              0
            );
            setFilterOptions((prev) => ({
              ...prev,
              dateStart: firstDay.getTime(),
              dateEnd: lastDay.getTime(),
            }));
          },
        },
        {
          name: "This Year",
          onPress: () => {
            const date = new Date();
            const firstDay = new Date(date.getFullYear(), 0, 1);
            const lastDay = new Date(date.getFullYear(), 11, 31);
            setFilterOptions((prev) => ({
              ...prev,
              dateStart: firstDay.getTime(),
              dateEnd: lastDay.getTime(),
            }));
          },
        },
        { name: "Custom" },
      ],
      selectedItems: filterOptions.dateStart
        ? [filterOptions.dateStart.toString()]
        : [],
      onClear: () =>
        setFilterOptions((prev) => ({
          ...prev,
          dateStart: undefined,
        })),
    },
  ];
  const expenseData = useExpensesData(
    {
      limit: 10,
      offset: 0,
      filterByType: filterOptions.type,
      filterByCategory: filterOptions.category,
      filterByTag: filterOptions.tags,
      filterByDateStart: filterOptions.dateStart?.toString(),
      filterByDateEnd: filterOptions.dateEnd?.toString(),
    },
    [filterOptions]
  );
  const tagsData = useTagsData();

  return (
    <AnimatedRoute className="flex flex-col flex-1 p-6 gap-y-2">
      <View className="flex flex-row">
        <IconButton
          className="m-0"
          onPress={() => {}}
          icon={"magnify"}
          size={20}
        />
        <FlatList
          data={menus}
          renderItem={({ item, index }) => (
            <View className={"ml-2"} key={item.name}>
              <View
                className="flex flex-row items-center self-start"
                key={item.name}
              >
                <DropDownMenu
                  key={item.name}
                  {...item}
                  selectedItems={item.selectedItems}
                  multiSelect={item.multiSelect}
                  onSelectItem={item.onSelectItem}
                />
                {item.extraNode}
              </View>
              {(item.selectedItems?.length ?? 0) > 0 && (
                <TouchableRipple onPress={() => item.onClear?.()}>
                  <View
                    className="flex flex-row items-center self-start py-2"
                    key={item.name}
                  >
                    <Icon source={"close"} size={16} color="red" />
                    <Text className="ml-1" variant="bodySmall">
                      Clear
                    </Text>
                  </View>
                </TouchableRipple>
              )}
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
