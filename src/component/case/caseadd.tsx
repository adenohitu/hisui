import {
  TextField,
  MenuItem,
  createStyles,
  makeStyles,
  Theme,
  Button,
} from "@material-ui/core";
import React, { useState } from "react";
export function CaseAddMain() {
  return <CaseType />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
    constraints: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "10ch",
        align: "center",
      },
    },
    button: {
      margin: theme.spacing(1),
    },
  })
);
export function CaseType() {
  const useInput = (initialValue: any) => {
    const [value, set] = useState(initialValue);
    return { value, onChange: (e: any) => set(e.target.value) };
  };

  const classes = useStyles();
  const type = useInput("int");
  const variable = useInput("N");
  const min = useInput(0);
  const leftsign = useInput("<=");
  const rightsign = useInput("<=");
  const max = useInput(10);

  const intstr = [
    { id: 0, type: "数値", value: "int" },
    { id: 1, type: "文字", value: "str" },
  ];
  const sign = [
    { id: 0, value: "<=", sign: "≤" },
    { id: 1, value: "<", sign: "<" },
  ];
  return (
    <>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          id="case-select"
          select
          label="型"
          {...type}
          helperText="変数の型を選択"
        >
          {intstr.map((option) => (
            <MenuItem key={option.id} value={option.value}>
              {option.type}
            </MenuItem>
          ))}
        </TextField>
      </form>
      <form className={classes.constraints} noValidate autoComplete="off">
        <TextField id="min-input" label="Min" helperText="最小値" {...min} />
        <TextField
          id="sign-select"
          select
          label="不等号"
          {...leftsign}
          helperText="不等号を選択"
        >
          {sign.map((option) => (
            <MenuItem key={option.id} value={option.value}>
              {option.sign}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="variable-input"
          label="変数名"
          helperText="変数名を入力"
          {...variable}
        />
        <TextField
          id="sign-select"
          select
          label="不等号"
          {...rightsign}
          helperText="不等号を選択"
        >
          {sign.map((option) => (
            <MenuItem key={option.id} value={option.value}>
              {option.sign}
            </MenuItem>
          ))}
        </TextField>
        <TextField id="max-input" label="Max" helperText="最大値" {...max} />
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
        >
          追加
        </Button>
      </form>
    </>
  );
}
