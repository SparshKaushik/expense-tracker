import { useState } from "react";
import { View } from "react-native";
import { Divider, Icon, Menu, Text, TouchableRipple } from "react-native-paper";

export interface DropDownMenu_t {
  name: string;
  anchorIcon: string;
  items: {
    name: string;
    onPress?: () => void;
  }[];
}

interface DropDownMenuProps {
  anchorText: string;
  anchorIcon: string;
  items: {
    name: string;
    onPress?: () => void;
  }[];
  onSelectItem?: (item: string) => void;
}

export default function DropDownMenu(props: DropDownMenuProps) {
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false);
  const closeMenu = () => setVisibleMenu(false);

  return (
    <Menu
      visible={visibleMenu}
      onDismiss={() => closeMenu()}
      anchor={
        <TouchableRipple
          onPress={() => {
            console.log("pressed");
            setVisibleMenu(true);
          }}
          className="self-start rounded-md p-2"
        >
          <View className="flex flex-row items-center self-start">
            <Text className="mr-1" variant="titleSmall">
              {props.anchorText}
            </Text>
            <Icon source={props.anchorIcon ?? "chevron-down"} size={20} />
          </View>
        </TouchableRipple>
      }
    >
      {props.items.map((item, index) => (
        <>
          <Menu.Item
            key={index}
            onPress={() => {
              props.onSelectItem?.(item.name);
              item.onPress?.();
              closeMenu();
            }}
            title={item.name}
          />
        </>
      ))}
    </Menu>
  );
}
