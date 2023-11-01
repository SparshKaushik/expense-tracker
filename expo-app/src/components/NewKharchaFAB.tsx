import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import {
  AnimatedFAB,
  Button,
  Card,
  FAB,
  HelperText,
  Icon,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";

interface NewKharchaFABProps {
  isExtendedFAB: boolean;
}

export default function NewKharchaFAB(props: NewKharchaFABProps) {
  const [newKharchaModalVisible, setNewKharchaModalVisible] = useState(false);
  const [isFABLoading, setIsFABLoading] = useState(false);
  const { control, handleSubmit, formState, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      amount: 0,
    },
    criteriaMode: "all",
  });

  return (
    <>
      <FAB
        // extended={props.isExtendedFAB}
        className="absolute right-2 bottom-2 z-10"
        icon={"plus"}
        onPress={() => {
          !props.isExtendedFAB ? setNewKharchaModalVisible(true) : null;
        }}
        label={props.isExtendedFAB ? "Add Kharcha" : ""}
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
          <Card className="w-full absolute bottom-0">
            <Card.Title
              title="Add Kharcha"
              right={(props) => (
                <Button
                  icon={"restart"}
                  children
                  onPress={() => {
                    reset();
                  }}
                />
              )}
            />
            <Card.Content className="gap-y-2">
              <View>
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
              </View>
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
              {/* <RNDateTimePicker mode="time" value={new Date()} /> */}
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
                  setIsFABLoading(true);
                  setNewKharchaModalVisible(false);
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
