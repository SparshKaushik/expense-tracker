import { useState } from "react";
import { View, ViewProps } from "react-native";
import {
  Checkbox,
  Divider,
  Icon,
  Menu,
  Text,
  TouchableRipple,
} from "react-native-paper";

export interface DropDownMenu_t {
  name: string;
  anchorIcon?: string;
  items: {
    name: string;
    checked?: boolean;
    onPress?: () => void;
  }[];
  extraNode?: JSX.Element;
}

interface DropDownMenuProps extends DropDownMenu_t {
  anchor?: (
    setVisibleMenu: (visible: boolean) => void,
    setMenuHeight: (height: number) => void
  ) => JSX.Element;
  DropdownMenuProps?: ViewProps;
  onSelectItem?: (item: string) => void;
  multiSelect?: boolean;
  aboveAnchor?: boolean;
}

export default function DropDownMenu(props: DropDownMenuProps) {
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false);
  const closeMenu = () => setVisibleMenu(false);
  const [menuHeight, setMenuHeight] = useState<number>(0);

  return (
    <Menu
      key={props.name}
      visible={visibleMenu}
      onDismiss={() => closeMenu()}
      anchor={
        (props.anchor && props.anchor(setVisibleMenu, setMenuHeight)) ?? (
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
      anchorPosition={props.aboveAnchor ? "top" : "bottom"}
      contentStyle={{
        transform: [
          {
            translateY: props.aboveAnchor ? -menuHeight : 0,
          },
        ],
      }}
    >
      {props.items.map((item, index) => (
        <>
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
          {index !== props.items.length - 1 && <Divider />}
        </>
      ))}
      {props.items.length === 0 && (
        <View
          className="flex flex-row items-center justify-between pr-4"
          {...props.DropdownMenuProps}
        >
          <Menu.Item key={0} title={"No items"} />
        </View>
      )}
    </Menu>
  );
}
