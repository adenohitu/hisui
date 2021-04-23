import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@material-ui/core";
import { useState } from "react";
export const Judgetool = () => {
  const [age, setAge] = useState("");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAge(event.target.value as string);
  };
  return (
    <Container>
      <Grid spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <FormControl style={{ width: "100%" }}>
            <InputLabel id="case-select">サンプルケース</InputLabel>
            <Select
              labelId="case-select-label"
              id="case-select"
              value={age}
              onChange={handleChange}
            >
              <MenuItem value={1}>入力例 1</MenuItem>
              <MenuItem value={2}>入力例 2</MenuItem>
              <MenuItem value={3}>入力例 3</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Box pt={1}>
            <Button variant="contained" color="primary">
              実行
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
