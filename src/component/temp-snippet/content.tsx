import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Card, CardActions, CardContent, Divider } from "@mui/material";
import Editor from "@monaco-editor/react";
import { snippetInfomation } from "../editor/monaco/sample";
import ReactMarkdown from "react-markdown";
interface Props {
  title: string;
  snippetChildren: snippetInfomation;
  language: string;
}
export const SnippetCard = ({ title, snippetChildren, language }: Props) => {
  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography
                aria-label="snippet-name"
                variant="h4"
                component="div"
              >
                {title}
              </Typography>
            </Grid>
            <Grid item>
              <Typography aria-label="language" variant="h6" component="div">
                {language}
              </Typography>
            </Grid>
          </Grid>
          <Typography color="text.secondary" variant="subtitle2">
            {snippetChildren.description}
          </Typography>
          <Box sx={{ m: 2 }}>
            <Typography variant="h5">予測候補文字</Typography>
            <Typography variant="h6">{snippetChildren.prefix}</Typography>
            <Divider>補完コード</Divider>
            <Editor
              height="200px"
              defaultLanguage="python"
              defaultValue={snippetChildren.body.join("\n")}
              theme="vs-dark"
              options={{
                domReadOnly: true,
                readOnly: true,
                renderControlCharacters: true,
              }}
            />
          </Box>
          <ReactMarkdown>
            {String(snippetChildren.documentation?.value)}
          </ReactMarkdown>
        </CardContent>
        <CardActions>
          <Button>入力</Button>
          <Button sx={{ marginLeft: "100%" }}>編集</Button>
        </CardActions>
      </Card>
    </Box>
  );
};
