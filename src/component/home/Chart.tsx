import React from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";

// Generate Sales Data
function createData(rating: any, day: any) {
  return { rating, day };
}

const data = [
  createData(0, 2020),
  createData(100, 2021),
  createData(250, 2022),
  createData(500, 2023),
];

export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="day" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: "middle", fill: theme.palette.text.primary }}
            >
              rating
            </Label>
          </YAxis>
          <Line
            type="monotone"
            dataKey="rating"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
