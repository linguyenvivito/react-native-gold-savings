import RNDateTimePicker, {
    AndroidNativeProps,
    DateTimePickerEvent,
    IOSNativeProps,
} from "@react-native-community/datetimepicker";
import { Platform, useColorScheme } from "react-native";

type DatePickerProps = {
  value: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  display?: IOSNativeProps["display"] | AndroidNativeProps["display"];
};

export default function DatePicker({
  value,
  onChange,
  maximumDate,
  minimumDate,
  display,
}: DatePickerProps) {
  const colorScheme = useColorScheme();

  return (
    <RNDateTimePicker
      value={value}
      mode="date"
      display={display ?? (Platform.OS === "ios" ? "inline" : "default")}
      themeVariant={colorScheme === "dark" ? "dark" : "light"}
      onChange={onChange}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
    />
  );
}
