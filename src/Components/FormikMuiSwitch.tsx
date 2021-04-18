import { Switch, SwitchProps, FormControlLabel } from "@material-ui/core";
import { useField } from "formik";

interface FormikMuiSwitchProps extends SwitchProps {
  name: string;
  label: string;
}

const FormikMuiSwitch: React.FC<FormikMuiSwitchProps> = (props) => {
  const [field] = useField({
    name: props.name,
    type: "checkbox",
  });

  return (
    <FormControlLabel
      label={props.label}
      control={<Switch {...props} {...field} />}
    />
  );
};

export default FormikMuiSwitch;
