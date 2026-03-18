import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { AnalysisChartOption } from "@/types";

interface ChartDisplayProps {
  selectedChart: AnalysisChartOption | null;
}

function toSeriesData(option: AnalysisChartOption) {
  if (option.chartType === "HISTOGRAM") {
    const labels = option.data.binLabels || [];
    const values = option.data.frequencies || [];
    return labels.map((label, index) => ({ label, value: values[index] ?? 0 }));
  }

  const labels = option.data.labels || [];
  const values = option.data.values || [];
  return labels.map((label, index) => ({ label, value: values[index] ?? 0 }));
}

export function ChartDisplay({ selectedChart }: ChartDisplayProps) {
  if (!selectedChart) {
    return (
      <Card className="w-full p-6">
        <h2 className="mb-2 text-gray-700">Diagramm</h2>
        <p className="text-sm text-gray-500">Kein Diagramm ausgewählt.</p>
      </Card>
    );
  }

  const seriesData = toSeriesData(selectedChart);

  const renderChart = () => {
    if (!seriesData.length) {
      return <div className="text-sm text-gray-500">Keine Daten für dieses Diagramm vorhanden.</div>;
    }

    if (selectedChart.chartType === "PIE") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={seriesData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={120} label>
              {seriesData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${(index * 360) / Math.max(seriesData.length, 1)}, 70%, 55%)`} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={seriesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" label={selectedChart.xAxisLabel ? { value: selectedChart.xAxisLabel, position: "insideBottom", offset: -5 } : undefined} />
          <YAxis label={selectedChart.yAxisLabel ? { value: selectedChart.yAxisLabel, angle: -90, position: "insideLeft" } : undefined} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3b82f6" name={selectedChart.title} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="w-full p-6">
      <h2 className="mb-1 text-gray-700">{selectedChart.title}</h2>
      {selectedChart.reason && <p className="mb-4 text-sm text-gray-500">{selectedChart.reason}</p>}
      <div className="w-full h-96">
        {renderChart()}
      </div>
    </Card>
  );
}

