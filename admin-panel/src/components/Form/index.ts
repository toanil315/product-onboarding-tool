import Input from './Input';
import Select from './Select';


interface FormInterface {
  Input: typeof Input;
  Select: typeof Select;
}

const Form = {} as FormInterface;
Form.Input = Input;
Form.Select = Select;

export default Form;
