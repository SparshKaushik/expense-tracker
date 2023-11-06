import { useState } from "react";
import { View, ViewProps } from "react-native";
import {
  Checkbox,
  Icon,
  Menu,
  Text,
  TouchableRipple,
} from "react-native-paper";

export interface DropDownMenu_t {
  name: string;
  anchorIcon: string;
  items: {
    name: string;
    checked?: boolean;
    onPress?: () => void;
  }[];
  extraNode?: JSX.Element;
}

interface DropDownMenuProps extends DropDownMenu_t {
  anchor?: JSX.Element;
  DropdownMenuProps?: ViewProps;
  onSelectItem?: (item: string) => void;
  multiSelect?: boolean;
}

export default function DropDownMenu(props: DropDownMenuProps) {
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false);
  const closeMenu = () => setVisibleMenu(false);

  return (
    <Menu
      key={props.name}
      visible={visibleMenu}
      onDismiss={() => closeMenu()}
      anchor={
        props.anchor ?? (
          <TouchableRipple
            onPress={() => {
              setVisibleMenu(true);
            }}
            className="self-start rounded-md py-2"
          >
            <View className="flex flex-row items-center self-start">
              <Text className="mr-1" variant="titleSmall">
                {props.name}
              </Text>
              <Icon source={props.anchorIcon ?? "chevron-down"} size={20} />
            </View>
          </TouchableRipple>
        )
      }
      anchorPosition="bottom"
    >
      {props.items.map((item, index) => (
        <TouchableRipple
          onPress={() => {
            props.onSelectItem?.(item.name);
            item.onPress?.();
            !props.multiSelect && closeMenu();
          }}
          key={item.name}
        >
          <View
            className="flex flex-row items-center justify-between pr-4"
            {...props.DropdownMenuProps}
          >
            <Menu.Item key={index} title={item.name} />
            {props.multiSelect && (
              <Checkbox status={item.checked ? "checked" : "unchecked"} />
            )}
          </View>
        </TouchableRipple>
      ))}
    </Menu>
  );
}
