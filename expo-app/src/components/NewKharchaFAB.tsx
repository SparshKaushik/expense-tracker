import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import {
  AnimatedFAB,
  Button,
  Card,
  FAB,
  HelperText,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";

interface NewKharchaFABProps {
  isExtendedFAB: boolean;
}

export default function NewKharchaFAB(props: NewKharchaFABProps) {
  const [newKharchaModalVisible, setNewKharchaModalVisible] = useState(false);
  const [isFABLoading, setIsFABLoading] = useState(true);
  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      title: "",
      amount: "",
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
            <Card.Title title="Add Kharcha" />
            <Card.Content className="gap-y-2">
              <View>
                <TextInput label={"Title"} mode="outlined" error />
                <HelperText type="error">Title is required</HelperText>
              </View>
              <View className="flex flex-row justify-between items-center">
                <Button className="w-1/3" mode="text">
                  -100
                </Button>
                <View>
                  <TextInput
                    className="flex-1"
                    label={"Amount"}
                    mode="outlined"
                    value="0"
                    error
                  />
                  <HelperText type="error">Amount is required</HelperText>
                </View>
                <Button className="w-1/3" mode="text">
                  +100
                </Button>
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
              <Button className="flex-1" mode="contained-tonal">
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
