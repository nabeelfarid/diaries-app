import { TextField, TextFieldProps } from "@material-ui/core";
import { useField } from "formik";

type FormikMuiTextFieldProps = {
  name: string;
} & TextFieldProps;

const FormikMuiTextField: React.FC<FormikMuiTextFieldProps> = (props) => {
  const [field, meta] = useField(props.name);

  return (
    <TextField
      {...props}
      {...field}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};

export default FormikMuiTextField;
