import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DockerStatusContext } from "./docker-status-hooks";

export function VmStatusTable() {
  const dockerStatusHooks = React.useContext(DockerStatusContext);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Names</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dockerStatusHooks.dockerVmStatusObject && (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {dockerStatusHooks.dockerVmStatusObject.ID}
              </TableCell>
              <TableCell>
                {dockerStatusHooks.dockerVmStatusObject.Image}
              </TableCell>
              <TableCell>
                {dockerStatusHooks.dockerVmStatusObject.Names}
              </TableCell>
              <TableCell>
                {dockerStatusHooks.dockerVmStatusObject.Status}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
