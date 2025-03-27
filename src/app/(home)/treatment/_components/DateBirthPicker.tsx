import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateOfBirthPickerProps {
  field: {
    value: Date | null;
    onChange: (date: Date | null) => void;
  };
  className?: string;
}

export function DateOfBirthPicker({ field, className }: DateOfBirthPickerProps) {
  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Date of Birth
      </label>
      <DatePicker
        selected={field.value}
        onChange={field.onChange}
        dateFormat="dd/MM/yyyy"
        className="w-full border rounded-md p-2 cursor-pointer"
        placeholderText="Select date"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        maxDate={new Date()}
        minDate={new Date(new Date().getFullYear() - 120, 0, 1)}
      />
    </div>
  );
}

export default DateOfBirthPicker;
