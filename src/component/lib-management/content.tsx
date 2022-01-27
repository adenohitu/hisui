import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Card, CardActions, CardContent, Divider } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { snippetInfomationinArrey } from "./lib-management-hooks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
interface Props {
  snippetChildren: snippetInfomationinArrey;
  language: string;
}
export const SnippetCard = ({ snippetChildren, language }: Props) => {
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
                {snippetChildren.title}
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
            <SyntaxHighlighter
              children={String(snippetChildren.body.join("\n")).replace(
                /\n$/,
                ""
              )}
              style={dark}
              language={language}
              PreTag="div"
            />
          </Box>
          {snippetChildren.documentation !== undefined && (
            <ReactMarkdown>
              {String(snippetChildren.documentation?.value)}
            </ReactMarkdown>
          )}
        </CardContent>
        <CardActions>
          {/* <Button>入力</Button> */}
          <Button sx={{ marginLeft: "auto" }}>編集</Button>
        </CardActions>
      </Card>
    </Box>
  );
};
