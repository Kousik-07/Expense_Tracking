import React from 'react'
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
function ChartLine({ transectionchart,dataKey1,dataKey2 }) {


  return (
    <div className="h-full w-full ml-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={transectionchart}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis width={50} tickCount={5} stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey1}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey={dataKey2} stroke="#82ca9d" />
          {/* <Line type="monotone" dataKey="expense" stroke="#82ca9d" /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartLine
