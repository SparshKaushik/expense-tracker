import { FlatList, View } from "react-native";
import { Divider } from "react-native-paper";
import DropDownMenu, { DropDownMenu_t } from "../../../components/DropDownMenu";

export default function Reports() {
  const menus: DropDownMenu_t[] = [
    {
      name: "Category",
      anchorIcon: "chevron-down",
      items: [{ name: "Item 1" }, { name: "Item 2" }, { name: "Item 3" }],
    },
  ];

  return (
    <View className="flex flex-col flex-1 p-6">
      <FlatList
        data={menus}
        renderItem={({ item }) => (
          <DropDownMenu
            key={item.name}
            anchorText={item.name}
            anchorIcon={item.anchorIcon}
            items={item.items}
          />
        )}
        horizontal
        keyExtractor={(item) => item.name}
      />
      <Divider />
    </View>
  );
}
