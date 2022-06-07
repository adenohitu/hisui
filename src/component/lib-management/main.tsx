/*!
 *======================================================================
 *Project Name : Hisui
 *Copyright © 2021-2022 adenohitu. All rights reserved.
 *======================================================================
 */
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Box } from "@mui/system";
import { SetSnippetDialog } from "./add-dialog";
import { SnippetAssistantAppBar } from "./appbar";
import { SnippetCard } from "./content";
import { useLibManagement } from "./lib-management-hooks";

export function LibManagement() {
  const libManagimentState = useLibManagement();
  return (
    <Box sx={{ backgroundColor: "#ffffff", height: "100%" }}>
      <SnippetAssistantAppBar />
      <SetSnippetDialog libManagementHookProp={libManagimentState} />
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
          <Button
            onClick={() => {
              libManagimentState.openNewDataSettingDialog();
            }}
          >
            新規作成
          </Button>
          <Box pt={4}>
            {libManagimentState.values.map((arg, indexNum) => {
              return (
                <Box py={3} key={indexNum}>
                  <SnippetCard
                    indexNum={indexNum}
                    snippetChildren={arg}
                    language={libManagimentState.language}
                    libManagementHookProp={libManagimentState}
                  />
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
