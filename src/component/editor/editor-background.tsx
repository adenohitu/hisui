import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { Stack } from "@mui/material";
export function Backgroundeditor() {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <p></p>

      <Stack direction="row" spacing={1}>
        <p>
          左の問題一覧から問題を選択するか
          <br />
          問題ビューの上部にある
          <ManageSearchIcon sx={{ fontSize: 16 }} />
          からAtCoderPloblemを開いて問題を選択してください。
        </p>
      </Stack>
    </div>
  );
}
