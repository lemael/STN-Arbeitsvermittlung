import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

type Subcontractor = {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  description: string;
};

const categories = ["Malerarbeiten", "Elektroinstallationen", "Bauplanung"];

export default function SubcontractorForm() {
  const [data, setData] = useState<Subcontractor>({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    category: "",
    description: "",
  });

  const handleSelectChange1 = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = e.target.name as string;
    setData({ ...data, [name]: e.target.value as string });
  };
  const handleSelectChange = (e: SelectChangeEvent) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const downloadJson = () => {
    const file = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${"subunternehmer"}.json`;
    a.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    downloadJson();
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "white",
      }}
    >
      <Typography variant="h5" mb={2}>
        Formular – Subunternehmer
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Name vollständig"
            name="name"
            value={data.name}
            onChange={handleSelectChange1}
            required
            fullWidth
          />

          <TextField
            label="Unternehmensname"
            name="company"
            value={data.company}
            onChange={handleSelectChange1}
            fullWidth
          />

          <TextField
            label="Email"
            type="email"
            name="email"
            value={data.email}
            onChange={handleSelectChange1}
            required
            fullWidth
          />

          <TextField
            label="Telefon"
            name="phone"
            value={data.phone}
            onChange={handleSelectChange1}
            required
            fullWidth
          />

          <TextField
            label="Adresse"
            name="address"
            value={data.address}
            onChange={handleSelectChange1}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Auftrag Kategorie</InputLabel>
            <Select
              name="category"
              label="Auftrag Kategorie"
              value={data.category}
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em>Choisir…</em>
              </MenuItem>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Beschreibung"
            name="description"
            multiline
            rows={4}
            value={data.description}
            onChange={handleSelectChange1}
            fullWidth
          />

          <Button variant="contained" type="submit">
            Speichern
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
