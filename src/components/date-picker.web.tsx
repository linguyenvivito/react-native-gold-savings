import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { StyleSheet, View } from "react-native";

type DatePickerProps = {
  value: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  display?: string;
};

export default function DatePicker({
  value,
  onChange,
  maximumDate,
  minimumDate,
}: DatePickerProps) {
  const toInputValue = (date: Date) => date.toISOString().slice(0, 10);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    const syntheticEvent = {
      type: "set",
      nativeEvent: { timestamp: date?.getTime() ?? 0, utcOffset: 0 },
    } as DateTimePickerEvent;
    onChange(syntheticEvent, date);
  };

  return (
    <View style={styles.wrapper}>
      <input
        type="date"
        value={toInputValue(value)}
        max={maximumDate ? toInputValue(maximumDate) : undefined}
        min={minimumDate ? toInputValue(minimumDate) : undefined}
        onChange={handleChange}
        style={inputStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
  },
});

const inputStyle: React.CSSProperties = {
  fontSize: 15,
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  backgroundColor: "#f9fafb",
  color: "#d4af37",
  width: "100%",
  boxSizing: "border-box",
};
