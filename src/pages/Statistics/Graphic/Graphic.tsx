import './Graphic.pcss';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
};

export const defaultData = {
  labels: [''],
  datasets: [
    {
      fill: true,
      label: 'Dataset 2',
      data: [0],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export interface GraphData {
  labels: string[];
  datasets: {
    fill: boolean;
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

interface GraphProps  {
  heading: string;
  subheading?: string;
  labels: string[];
  values: number[];
  label: string;
}

export const Graph = ({ subheading, heading, labels, values, label }: GraphProps): JSX.Element => {

  const data = {
    labels: [''],
    datasets: [
      {
        fill: true,
        label: 'Dataset 2',
        data: [0],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  data.labels = labels;
  data.datasets[0].label = label;
  data.datasets[0].data = values;

  return (
    <div className="stats_card">
      <div className="stats_header">
        <div className="stats_heading">
          <h3 className="stats_title">{heading}</h3>
          {subheading && (
            <p className="stats_subtitle">{subheading}</p>
          )}
        </div>
      </div>
      <div className="chart_container">
        <div className="chart_wrapper">
          <Line options={options} data={data} />
        </div>
      </div>

    </div>

  );};
