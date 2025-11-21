import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

const defaultData = [
  { monat: "Jan", online: 4000, laden: 2400, telefon: 2400 },
  { monat: "Feb", online: 3000, laden: 1398, telefon: 2210 },
  { monat: "Mär", online: 2000, laden: 9800, telefon: 2290 },
  { monat: "Apr", online: 2780, laden: 3908, telefon: 2000 },
  { monat: "Mai", online: 1890, laden: 4800, telefon: 2181 },
  { monat: "Jun", online: 2390, laden: 3800, telefon: 2500 },
];

const q1Data = [
  { monat: "Jan", umsatz: 35000 },
  { monat: "Feb", umsatz: 45000 },
  { monat: "Mär", umsatz: 65000 },
];

const yearData = [
  { monat: "Jan", umsatz: 35000 },
  { monat: "Feb", umsatz: 45000 },
  { monat: "Mär", umsatz: 65000 },
  { monat: "Apr", umsatz: 55000 },
  { monat: "Mai", umsatz: 52000 },
  { monat: "Jun", umsatz: 68000 },
  { monat: "Jul", umsatz: 58000 },
  { monat: "Aug", umsatz: 51000 },
  { monat: "Sep", umsatz: 61000 },
  { monat: "Okt", umsatz: 59000 },
  { monat: "Nov", umsatz: 63000 },
  { monat: "Dez", umsatz: 72000 },
];

interface ChartDisplayProps {
  query?: string;
}

export function ChartDisplay({ query = "" }: ChartDisplayProps) {
  const { data, title, dataKey } = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("quartal 1") || lowerQuery.includes("q1")) {
      return {
        data: q1Data,
        title: "Umsatz - Quartal 1 2025",
        dataKey: "umsatz"
      };
    }
    
    if (lowerQuery.includes("2025") && !lowerQuery.includes("quartal")) {
      return {
        data: yearData,
        title: "Jahresumsatz 2025",
        dataKey: "umsatz"
      };
    }
    
    return {
      data: defaultData,
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