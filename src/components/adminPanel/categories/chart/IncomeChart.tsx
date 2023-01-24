import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface GraphData {
  value: number;
  name: string;
}

interface Props {
  data: GraphData[];
  colors: string[];
}

export const IncomeChart: React.FC<Props> = ({ data, colors }) => {

  return (
    <div>
      {
        data.length ?
          <ResponsiveContainer width={'100%'} height={200}>
            <PieChart >
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
              <Pie data={data} dataKey='value' name="name" fill="#8884d8" label>
                {data.map((entry, index) => {
                  return <Cell key={`cell-${index}`} fill={colors[index]}>
                  </Cell>;
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer> :
          <div>No results</div>
      }
    </div >
  );
};