// import React from "react";
// import { Counter } from "../counter/Counter";
import { useSelector } from "react-redux";
import {
  selectMyrank,
  // selectTotal,
} from "../../app/Slice/standings";
// import store from "../app/store";
// import { useEffect } from "react";
export function Home() {
  const Myrank = useSelector(selectMyrank);
  // const total = useSelector(selectTotal);
  // const dispatch = useDispatch();
  return (
    <div>
      <h1>Home</h1>
      <button
        onClick={() => {
          // console.log();
        }}
      >
        get
      </button>
      <button
        onClick={() => {
          window.api.getRank_send_render();
        }}
      >
        ipctest
      </button>
      <button
        onClick={() => {
          window.api.logout_render();
        }}
      >
        logout
      </button>
      {/* <Counter /> */}
      <p>{Myrank !== undefined && Myrank}</p>
      {/* <p>{total !== undefined && total[0].allsubmission}</p> */}
    </div>
  );
}
