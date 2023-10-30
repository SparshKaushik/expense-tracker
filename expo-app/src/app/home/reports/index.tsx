import { FlatList, View } from "react-native";
import { Card, Chip, Divider, Text } from "react-native-paper";
import DropDownMenu, { DropDownMenu_t } from "../../../components/DropDownMenu";
import AnimatedRoute from "../../../components/AnimatedRoute";
import { useState } from "react";

export default function Reports() {
  const menus: DropDownMenu_t[] = [
    {
      name: "Category",
      anchorIcon: "chevron-down",
      items: [{ name: "Item 1" }, { name: "Item 2" }, { name: "Item 3" }],
      extraNode: <Text>Calendar</Text>,
    },
  ];

  const [tagChips, setTagChips] = useState<
    {
      name: string;
      selected: boolean;
    }[]
  >([
    {
      name: "Tag 1",
      selected: true,
    },
    {
      name: "Tag 2",
      selected: true,
    },
    {
      name: "Tag 3",
      selected: true,
    },
    {
      name: "Tag 4",
      selected: true,
    },
    {
      name: "Tag 5",
      selected: true,
    },
  ]);

  return (
    <AnimatedRoute className="flex flex-col flex-1 p-6 gap-y-2">
      <View>
        <FlatList
          data={menus}
          renderItem={({ item }) => (
            <View
              className="flex flex-row items-center self-start"
              key={item.name}
            >
              <DropDownMenu
                key={item.name}
                anchorText={item.name}
                anchorIcon={item.anchorIcon}
                items={item.items}
              />
              {item.extraNode}
            </View>
          )}
          horizontal
          keyExtractor={(item) => item.name}
        />
      </View>
      <Divider />
      <View className="flex flex-row flex-wrap -mx-6">
        <FlatList
          data={tagChips}
          renderItem={({ item, index }) => (
            <>
              {index === 0 && <View className="px-3" />}
              <Chip
                className="m-1 self-start"
                mode={item.selected ? "flat" : "outlined"}
                selected={item.selected}
                onPress={() => {
                  setTagChips(
                    tagChips.map((tag) =>
                      tag.name === item.name
                        ? { ...tag, selected: !tag.selected }
                        : tag
                    )
                  );
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
      <View className="flex-1">
        <Card className="my-1">
          <Card.Content>
            <View className="flex flex-row justify-between items-center">
              <View className="flex-1">
                <Text variant="bodyMedium">Title</Text>
                <Text variant="bodySmall" className="p-0 m-0">
                  bruh
                </Text>
              </View>
              <Text variant="bodyMedium">$00</Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </AnimatedRoute>
  );
}