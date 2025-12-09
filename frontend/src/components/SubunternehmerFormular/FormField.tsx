import { Box, TextField } from "@mui/material";
import React, { useMemo } from "react";
import Subunternehmer from "../../Models/Subunternehmer";

type FormErrors = Partial<Record<keyof Subunternehmer, string>>;

interface FormFieldProps {
  label: string;
  name: keyof Subunternehmer;
  formData: Subunternehmer;
  errors: FormErrors;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isHalfWidth?: boolean;
  type?: string;
  rows?: number;
  isMobile: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  formData,
  errors,
  handleChange,
  isHalfWidth = false,
  type = "text",
  rows,
  isMobile,
}) => {
  // Hilfs-Stil für die Box-Elemente
  const itemStyle = useMemo(
    () => ({
      flexBasis: isHalfWidth ? (isMobile ? "100%" : "50%") : "100%",
      p: 1.5,
      boxSizing: "border-box",
    }),
    [isHalfWidth, isMobile]
  );

  return (
    <Box sx={itemStyle}>
      <TextField
        required
        fullWidth
        label={label}
        name={name}
        type={type}
        multiline={!!rows}
        rows={rows}
        InputLabelProps={type === "date" ? { shrink: true } : {}} // Shrink Label for type="date"
        inputProps={type === "number" ? { min: 0 } : undefined}
        // Value must be compatible with the input type
        value={
          (formData[name] as string | number | string[]) ||
          (type === "number" ? 0 : "")
        }
        onChange={handleChange}
        error={!!errors[name]}
        helperText={errors[name]}
      />
    </Box>
  );
};

export default FormField;
