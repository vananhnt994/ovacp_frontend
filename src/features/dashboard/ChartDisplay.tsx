import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { DEFAULT_CHART_DATA, Q1_DATA, YEAR_DATA } from "@/constants/chartData";

interface ChartDisplayProps {
  query?: string;
}

export function ChartDisplay({ query = "" }: ChartDisplayProps) {
  const { data, title, dataKey } = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("quartal 1") || lowerQuery.includes("q1")) {
      return {
        data: Q1_DATA,
        title: "Umsatz - Quartal 1 2025",
        dataKey: "umsatz"
      };
    }
    
    if (lowerQuery.includes("2025") && !lowerQuery.includes("quartal")) {
      return {
        data: YEAR_DATA,
        title: "Jahresumsatz 2025",
        dataKey: "umsatz"
      };
    }
    
    return {
      data: DEFAULT_CHART_DATA,
      title: "Vertriebsanalyse - Omni-Channel",
      dataKey: null
    };
  }, [query]);

  return (
    <Card className="w-full p-6">
      <h2 className="mb-4 text-gray-700">{title}</h2>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monat" />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKey === "umsatz" ? (
              <Bar dataKey="umsatz" fill="#3b82f6" name="Umsatz (€)" />
            ) : (
              <>
                <Bar dataKey="online" fill="#3b82f6" name="Online" />
                <Bar dataKey="laden" fill="#10b981" name="Laden" />
                <Bar dataKey="telefon" fill="#f59e0b" name="Telefon" />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

