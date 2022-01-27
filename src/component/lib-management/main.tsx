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
} from "@mui/material";
import { Box } from "@mui/system";
import { SnippetAssistantAppBar } from "./appbar";
import { SnippetCard } from "./content";
import { useLibManagement } from "./lib-management-hooks";

export function LibManagement() {
  const libManagimentState = useLibManagement();
  return (
    <>
      <SnippetAssistantAppBar />
      <Box pt={3}>
        <Container>
          <Box width="60px">
            <FormControl sx={{ width: "100px" }}>
              <InputLabel>言語</InputLabel>
              <Select
                value={libManagimentState.language}
                label="language"
                onChange={libManagimentState.handleChangeLang}
              >
                <MenuItem value={"cpp"}>C++</MenuItem>
                <MenuItem value={"python"}>Python</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box pt={4}>
            {libManagimentState.value.map((arg, indexNum) => {
              return (
                <Box py={3} key={indexNum}>
                  <SnippetCard
                    snippetChildren={arg}
                    language={libManagimentState.language}
                  />
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>
    </>
  );
}
