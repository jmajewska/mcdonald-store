import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, } from "recharts";

interface GraphData {
  value: number;
  name: string;
}

interface Props {
  data: GraphData[];
  colors: string[];
}

export const CategoriesChart: React.FC<Props> = ({ data }) => {
  return (
    <div>
      {data.length ?
        <ResponsiveContainer width={"100%"} height={300} >
          <BarChart data={data} >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill='#ff5c77' name="orders count" barSize={20} label={{ fill: 'white' }} onMouseOver={() => {}} />
          </BarChart>
        </ResponsiveContainer> :
        <div>No results</div>
      }
    </div>
  );
};