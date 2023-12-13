import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, ToastAndroid, View } from "react-native";
import {
  Button,
  Card,
  FAB,
  HelperText,
  IconButton,
  Modal,
  Portal,
  SegmentedButtons,
  TextInput,
} from "react-native-paper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DropDownMenu from "./DropDownMenu";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { createLazyExpense_t, useCreateLazyExpense } from "../models/expense";

export default function NewKharchaFAB() {
  const [newKharchaModalVisible, setNewKharchaModalVisible] = useState(false);
  const [isFABLoading, setIsFABLoading] = useState(false);
  const { control, handleSubmit, formState, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      type: "Debit",
      amount: 0,
      category: "",
      dateTime: new Date(),
    },
    criteriaMode: "all",
    resolver: yupResolver(
      yup.object().shape({
        title: yup.string().test({
          name: "title",
          message: "Title is required",
          test: (value) => {
            if (lazyKharcha) return true;
            return value !== "";
          },
        }),
        type: yup.string().required(),
        amount: yup.number().required(),
        category: yup.string().required(),
        dateTime: yup.date().required(),
        tags: yup
          .array()
          .of(yup.string())
          .test({
            name: "tags",
            message: "Tags is required",
            test: (value) => {
              if (lazyKharcha) return true;
              return (value?.length ?? -1) > 0;
            },
          }),
      })
    ),
  });

  const createLazyExpense = useCreateLazyExpense();

  const [lazyKharcha, setLazyKharcha] = useState(true);
  const [searchCategory, setSearchCategory] = useState<string>("");
  const categories = [{ name: "Food" }, { name: "Travel" }];

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  return (
    <>
      <FAB
        // extended={props.isExtendedFAB}
        className="absolute right-2 bottom-2 z-10"
        icon={"plus"}
        onPress={() => {
          setNewKharchaModalVisible(true);
        }}
        // label={props.isExtendedFAB ? "Add Kharcha" : ""}
        loading={isFABLoading}
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
          <Card className="w-full absolute bottom-0 rounded-t-2xl">
            <Card.Title
              title="Add Kharcha"
              right={(props) => (
                <IconButton
                  mode="contained"
                  icon={"restart"}
                  onPress={() => {
                    reset();
                  }}
                />
              )}
            />
            <Card.Content className="gap-y-2">
              <View className="py-2">
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <SegmentedButtons
                      buttons={[
                        { value: "Debit", label: "Debit", icon: "cash-minus" },
                        { value: "Credit", label: "Credit", icon: "cash-plus" },
                      ]}
                      onValueChange={(value) => {
                        onChange(value);
                      }}
                      value={value}
                    />
                  )}
                  name="type"
                />
                {formState.errors.type && (
                  <HelperText type="error">Type is required</HelperText>
                )}
              </View>
              {/* <View>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={"Title"}
                      mode="outlined"
                      error={formState.errors.title ? true : false}
                      onChange={(e) => {
                        onChange(e.nativeEvent.text);
                      }}
                      onBlur={onBlur}
                      value={value}
                    />
                  )}
                  name="title"
                />
                {formState.errors.title && (
                  <HelperText type="error">Title is required</HelperText>
                )}
              </View> */}
              <View className="flex flex-row justify-between items-center">
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <Button
                        className="w-1/3"
                        mode="text"
                        disabled={value <= 100}
                        onPress={() => {
                          onChange(value - 100);
                        }}
                      >
                        -100
                      </Button>
                      <View>
                        <TextInput
                          className="flex-1"
                          label={"Amount"}
                          mode="outlined"
                          error={formState.errors.amount ? true : false}
                          onChange={(e) => {
                            onChange(parseInt(e.nativeEvent.text));
                          }}
                          onBlur={onBlur}
                          value={value.toString()}
                          keyboardType="number-pad"
                          inputMode="numeric"
                        />
                        {formState.errors.amount && (
                          <HelperText type="error">
                            Amount is required
                          </HelperText>
                        )}
                      </View>
                      <Button
                        className="w-1/3"
                        mode="text"
                        onPress={() => {
                          onChange(value + 100);
                        }}
                      >
                        +100
                      </Button>
                    </>
                  )}
                  name="amount"
                />
              </View>
              <View className="relative">
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DropDownMenu
                      items={categories.filter((item) =>
                        item.name
                          .toLowerCase()
                          .includes(searchCategory.toLowerCase())
                      )}
                      anchor={(setVisibleMenu, setMenuHeight) => (
                        <TextInput
                          className="flex-1"
                          label={"Category"}
                          mode="outlined"
                          error={formState.errors.category ? true : false}
                          onChange={(e) => {
                            setVisibleMenu(true);
                            onChange("");
                            setSearchCategory(e.nativeEvent.text);
                          }}
                          onBlur={onBlur}
                          value={value || searchCategory}
                          right={
                            <TextInput.Icon
                              icon={
                                categories.find(
                                  (item) => item.name === searchCategory
                                )
                                  ? "chevron-down"
                                  : "plus"
                              }
                              onPress={() => {
                                if (
                                  categories.find(
                                    (item) => item.name === searchCategory
                                  )
                                ) {
                                  onChange(searchCategory);
                                  setSearchCategory("");
                                  setVisibleMenu(false);
                                  return;
                                }
                                setVisibleMenu(true);
                              }}
                            />
                          }
                          onLayout={(e) =>
                            setMenuHeight(e.nativeEvent.layout.height + 10)
                          }
                        />
                      )}
                      name="category"
                      DropdownMenuProps={{
                        style: {
                          width: Dimensions.get("window").width - 32,
                        },
                      }}
                      aboveAnchor
                      onSelectItem={(item) => {
                        onChange(item);
                      }}
                    />
                  )}
                  name="category"
                />
                {formState.errors.category && (
                  <HelperText type="error">Category is required</HelperText>
                )}
              </View>
              <View>
                <Controller
                  control={control}
                  rules={{
                    required: false,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        label={"Date & Time"}
                        mode="outlined"
                        error={formState.errors.dateTime ? true : false}
                        onChange={(e) => {
                          onChange(e.nativeEvent.text);
                        }}
                        onBlur={onBlur}
                        value={new Date(value).toLocaleString()}
                        right={
                          <TextInput.Icon
                            icon={"calendar"}
                            onPress={() => {
                              setDatePickerVisible(true);
                            }}
                          />
                        }
                      />
                      {datePickerVisible && (
                        <RNDateTimePicker
                          mode="date"
                          value={new Date(value)}
                          onChange={(e) => {
                            e.nativeEvent.timestamp &&
                              onChange(new Date(e.nativeEvent.timestamp));
                            setTimePickerVisible(true);
                            setDatePickerVisible(false);
                          }}
                        />
                      )}
                      {timePickerVisible && (
                        <RNDateTimePicker
                          mode="time"
                          value={new Date(value)}
                          onChange={(e) => {
                            e.nativeEvent.timestamp &&
                              onChange(new Date(e.nativeEvent.timestamp));
                            setTimePickerVisible(false);
                          }}
                        />
                      )}
                    </>
                  )}
                  name="dateTime"
                />
              </View>
            </Card.Content>
            <Card.Actions className="justify-between mt-4">
              <Button
                className="flex-1"
                onPress={() => {
                  setNewKharchaModalVisible(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                mode="contained-tonal"
                onPress={() => {
                  handleSubmit(
                    (data) => {
                      ToastAndroid.show(
                        "Adding kharcha, please wait...",
                        ToastAndroid.SHORT
                      );
                      setIsFABLoading(true);
                      setNewKharchaModalVisible(false);
                      try {
                        delete data.tags;
                        delete data.title;
                        createLazyExpense
                          .mutateAsync({
                            ...data,
                            final_amount: data.amount,
                            dateTime: data.dateTime.getTime(),
                          } as createLazyExpense_t)
                          .then(() => {
                            ToastAndroid.show(
                              "Kharcha added successfully",
                              ToastAndroid.SHORT
                            );
                            reset();
                            setIsFABLoading(false);
                          });
                      } catch (error) {
                        ToastAndroid.show(
                          JSON.stringify(error),
                          ToastAndroid.SHORT
                        );
                        setIsFABLoading(false);
                      }
                    },
                    (e) => {
                      ToastAndroid.show(JSON.stringify(e), ToastAndroid.SHORT);
                    }
                  )();
                  // setNewKharchaModalVisible(false);
                }}
              >
                Finish Later
              </Button>
              <Button className="flex-1">Next</Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </>
  );
}
