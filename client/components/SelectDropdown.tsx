import React, { useEffect, useState } from 'react';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';
import usePrevious from 'react-use/lib/usePrevious';

interface ISelectDropdownProps<T> {
  options: { label: string; value: T }[];
  initialValue: T | null;
  onChangeValue: (value: T | null) => void;
}

export function SelectDropdown<T extends ValueType>({
  options,
  initialValue,
  onChangeValue,
}: ISelectDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    Number.isInteger(initialValue) || initialValue ? initialValue : null
  );
  const prevInitialValue = usePrevious(initialValue);

  useEffect(() => {
    if (prevInitialValue !== initialValue) {
      setValue(initialValue);
    }
  }, [initialValue, prevInitialValue]);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={options}
      setOpen={setOpen}
      setValue={setValue}
      dropDownDirection="BOTTOM"
      containerStyle={{ height: 40 }}
      style={{ backgroundColor: '#fafafa' }}
      textStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
      labelStyle={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}
      dropDownContainerStyle={{
        backgroundColor: '#fafafa',
      }}
      selectedItemContainerStyle={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      selectedItemLabelStyle={{
        flex: 0,
      }}
      onChangeValue={onChangeValue}
    />
  );
}
