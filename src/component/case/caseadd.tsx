import {
  TextField,
  MenuItem,
  createStyles,
  makeStyles,
  Theme,
  Button,
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addElement } from "../../app/Slice/casecont";

export function CaseN1Main() {
  return (
    <div>
      <SelectType />
      <CaseIntN1 />
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "10ch",
      },
    },
    constraints: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "8ch",
        align: "center",
      },
    },
    button: {
      margin: theme.spacing(1),
    },
  })
);
// eslint-disable-next-line
const useInputNum = (initialValue: number) => {
  const [value, set] = useState(initialValue);
  return { value, onChange: (e: any) => set(e.target.value) };
};
const useInputStr = (initialValue: string) => {
  const [value, set] = useState(initialValue);
  return { value, onChange: (e: any) => set(e.target.value) };
};
/**
 * 型を指定
 */
export function SelectType() {
  const classes = useStyles();
  const type = useInputStr("int");

  const intstr = [
    { id: 0, type: "整数", value: "int" },
    // { id: 1, type: "文字", value: "str" },
  ];
  return (
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
  );
}
/**
 * 整数の時の範囲を指定
 */
export function CaseIntN1() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const variable = useInputStr("N");
  const min = useInputStr("0");
  const leftsign = useInputStr("<=");
  const rightsign = useInputStr("<=");
  const max = useInputStr("10");

  const sign = [
    { id: 0, value: "<=", sign: "≤" },
    { id: 1, value: "<", sign: "<" },
  ];
  function add() {
    console.log(
      dispatch(
        addElement(variable.value, 1, {
          min: min.value,
          leftsign: leftsign.value,
          rightsign: rightsign.value,
          max: max.value,
        })
      )
    );
  }
  return (
    <>
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
          onClick={() => {
            add();
          }}
        >
          追加
        </Button>
      </form>
    </>
  );
}
