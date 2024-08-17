import Label from '../Input/Label';
import { ColorPicker as AntdColorPicker, ColorPickerProps as AntdColorPickerProps } from 'antd';
import { StyledColorPicker } from './styled';

interface ColorPickerProps extends Omit<AntdColorPickerProps, 'onChange'> {
  label: string;
  value: string;
  showText: boolean;
  onChange: (value: string) => void;
}

const ColorPicker = ({ label, value, onChange, ...restProps }: ColorPickerProps) => {
  return (
    <StyledColorPicker>
      <Label label={label} />
      <AntdColorPicker
        value={value}
        onChange={(_, hex) => onChange(hex)}
        {...restProps}
      />
    </StyledColorPicker>
  );
};

export default ColorPicker;
