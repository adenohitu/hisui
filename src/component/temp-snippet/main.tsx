/*!
 *======================================================================
 *Project Name : Hisui
 *Copyright © 2021-2022 adenohitu. All rights reserved.
 *======================================================================
 */
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { languagetype } from "../../../src_main/file/extension";
import { SnippetAssistantAppBar } from "./appbar";
import { SnippetCard } from "./content";

export function SnippetAssistant() {
  const [language, setLanguage] = useState<languagetype>("cpp");
  const handleChangeLang = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as languagetype);
  };
  return (
    <>
      <SnippetAssistantAppBar />
      <Box pt={3}>
        <Container>
          <Box width="60px">
            <FormControl sx={{ width: "100px" }}>
              <InputLabel>言語</InputLabel>
              <Select
                value={language}
                label="language"
                onChange={handleChangeLang}
              >
                <MenuItem value={"cpp"}>C++</MenuItem>
                <MenuItem value={"python"}>Python</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box pt={4}>
            <SnippetCard
              title="input_ini"
              snippetChildren={{
                prefix: "ini",
                body: ["= int(input())"],
                description: "標準入力(int)",
                documentation: { value: "### 入力を補完するSnippet" },
              }}
              language={"Python"}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}
