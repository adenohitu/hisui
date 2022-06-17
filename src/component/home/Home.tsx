// import React from "react";
// import { Counter } from "../counter/Counter";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ipcRendererManager } from "../../ipc";
import SelectContest from "../setting/select_contestlist";
export function colorRating(rating: number | null) {
  if (rating == null) return "gray";
  else if (rating >= 2800) return "red";
  else if (rating >= 2400) return "#FF8C00";
  else if (rating >= 2000) return "#a0a";
  else if (rating >= 1600) return "blue";
  else if (rating >= 1200) return "#03A89E";
  else if (rating >= 800) return "green";
  else if (rating >= 400) return "#795548";
  else if (rating >= 0) return "gray";
}

export function Home() {
  const [loginstatus, setstatus] = useState(false);
  const [userdata, setuserdata] = useState({
    UserScreenName: null,
    Rating: null,
    AtCoderRank: null,
    Country: null,
    Affiliation: null,
  });
  useEffect(() => {
    const run = async () => {
      setstatus(await ipcRendererManager.invoke("GET_LOGIN_STATUS"));
      setuserdata(await ipcRendererManager.invoke("GET_USER_DATA"));
    };
    run();
  }, []);
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        height: "100%",
        width: "100%",
        overflowY: "scroll",
      }}
    >
      <Container
        sx={{
          backgroundColor: "#ffffff",
          height: "100%",
        }}
      >
        <Box pb={3}>
          <Box py={3}>
            {(loginstatus === true && (
              <div style={{ display: "flex" }}>
                <Typography variant="h3">ようこそ</Typography>
                <Typography
                  variant="h3"
                  style={{ color: colorRating(userdata.Rating) }}
                >
                  {userdata.UserScreenName}
                </Typography>
                <Typography variant="h3">さん</Typography>
              </div>
            )) || <Typography variant="h2">ログインしてください</Typography>}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        ユーザー情報
                      </Typography>
                      <Typography variant="h5" component="div">
                        {userdata.UserScreenName}
                      </Typography>
                      <Typography
                        sx={{ mb: 1.5 }}
                        style={{ color: colorRating(userdata.Rating) }}
                      >
                        Rating:{userdata.Rating}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={8}>
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        Hisuiについて
                      </Typography>
                      <Typography
                        sx={{ mb: 1.5 }}
                        style={{ color: colorRating(userdata.Rating) }}
                      >
                        使い方についてはドキュメントを確認してください
                      </Typography>
                    </CardContent>
                    {/* <CardActions>
                      <Button onClick={() => {
                        
                      }} size="small">
                        ドキュメントを開く
                      </Button>
                    </CardActions> */}
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {loginstatus === false && (
                <Button
                  sx={{ mx: 1 }}
                  variant="contained"
                  color="info"
                  onClick={() => {
                    ipcRendererManager.send("OPEN_LOGIN_DIALOG");
                  }}
                >
                  ログインする
                </Button>
              )}
              {loginstatus === true && (
                <Button
                  sx={{ mx: 1 }}
                  variant="contained"
                  color="info"
                  onClick={() => {
                    ipcRendererManager.send("OPEN_SELECT_CONTEST_DIALOG");
                  }}
                >
                  コンテストを選択する
                </Button>
              )}
              <Button
                sx={{ mx: 1 }}
                variant="contained"
                color="primary"
                onClick={() => {
                  ipcRendererManager.send("RUN_SET_WINDOW_SPLIT");
                }}
              >
                Windowを左右分割してに並べる
              </Button>
            </Grid>
            <Grid item xs={12}>
              <SelectContest select={false} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
