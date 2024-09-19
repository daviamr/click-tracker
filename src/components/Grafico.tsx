import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DatePickerWithRange } from "./DataPicker";
import { customerData, DataProps } from "@/interface/auth";
import { api } from "@/services/Api";
import { useAuth } from "@/hook/Auth";
import { AxiosError } from "axios";
import { AlertMessage } from "./alert_message";
import React, { useEffect, useState } from "react";

export const description = "An interactive bar chart";
const chartData = [
  { date: "2024-04-02", CC: 233, EspacoLaser: 197, teste4: 987, Avon: 234, desktop: 97, mobile: 180, pageview: 268 },
  { date: "2024-04-03", desktop: 167, mobile: 120, pageview: 123 },
  { date: "2024-04-04", desktop: 242, mobile: 260, pageview: 78 },
  { date: "2024-04-05", desktop: 373, mobile: 290, pageview: 462 },
  { date: "2024-04-06", desktop: 301, mobile: 340, pageview: 961 },
  { date: "2024-04-07", desktop: 245, mobile: 180, pageview: 231 },
  { date: "2024-04-08", desktop: 409, mobile: 320, pageview: 432 },
  { date: "2024-04-09", desktop: 59, mobile: 110, pageview: 534 },
  { date: "2024-04-10", desktop: 261, mobile: 190, pageview: 654 },
  { date: "2024-04-11", desktop: 327, mobile: 350, pageview: 234 },
  { date: "2024-04-12", desktop: 292, mobile: 210, pageview: 765 },
  { date: "2024-04-13", desktop: 342, mobile: 380, pageview: 233 },
  { date: "2024-04-14", desktop: 137, mobile: 220, pageview: 123 },
  { date: "2024-04-15", desktop: 120, mobile: 170, pageview: 432 },
  { date: "2024-04-16", desktop: 138, mobile: 190, pageview: 432 },
  { date: "2024-04-17", desktop: 446, mobile: 360, pageview: 545 },
  { date: "2024-04-18", desktop: 364, mobile: 410, pageview: 654 },
  { date: "2024-04-19", desktop: 243, mobile: 180, pageview: 123 },
  { date: "2024-04-20", desktop: 89, mobile: 150, pageview: 432 },
  { date: "2024-04-21", desktop: 137, mobile: 200, pageview: 268 },
  { date: "2024-04-22", desktop: 224, mobile: 170, pageview: 512 },
  { date: "2024-04-23", desktop: 138, mobile: 230, pageview: 234 },
  { date: "2024-04-24", desktop: 387, mobile: 290, pageview: 323 },
  { date: "2024-04-25", desktop: 215, mobile: 250, pageview: 123 },
  { date: "2024-04-26", desktop: 75, mobile: 130, pageview: 132 },
  { date: "2024-04-27", desktop: 383, mobile: 420, pageview: 321 },
  { date: "2024-04-28", desktop: 122, mobile: 180, pageview: 143 },
  { date: "2024-04-29", desktop: 315, mobile: 240, pageview: 231 },
  { date: "2024-04-30", desktop: 454, mobile: 380, pageview: 432 },
  { date: "2024-05-01", desktop: 165, mobile: 220, pageview: 223 },
];
const chartConfig = {
  views: {
    label: "Cliques",
  },
  CC: {
    label: "CC",
    color: "hsl(var(--chart-1))",
  },
  EspacoLaser: {
    label: "Espaço Laser",
    color: "hsl(var(--chart-2))",
  },
  teste4: {
    label: "teste4",
    color: "hsl(var(--chart-3))",
  },
  Avon: {
    label: "Avon",
    color: "hsl(var(--chart-4))",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  pageview: {
    label: "PageView",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type graphicProps = {
  cliente: string;
};
type dataProps = { data: DataProps };

export function Grafico({ cliente }: graphicProps) {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>(cliente ? (cliente as keyof typeof chartConfig) : "desktop");
  const total = React.useMemo(
    () => ({
      CC: chartData.reduce((acc, curr) => acc + (curr.CC?? 0), 0),
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
      pageview: chartData.reduce((acc, curr) => acc + curr.pageview, 0),
    }),
    []
  );
  const [customer, setCustomer] = useState<customerData[]>([]);
  const { data } = useAuth() as dataProps;
  console.log(customer)

  const handleGetCustomer = async () => {
    try {
      const response = await api.get(`/clients`, {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setCustomer(response.data);
      console.log(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar os clientes, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };
  useEffect(() => {
    handleGetCustomer();
  }, [data.jwtToken]);

  useEffect(() => {
    if (cliente) {
      setActiveChart(cliente as keyof typeof chartConfig);
    }
  }, [cliente])

  return (
    <>
      <div className="flex justify-end mb-2">
        <DatePickerWithRange />
      </div>
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Lorem ipsum, dolor sit amet</CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </CardDescription>
          </div>
          <div className="flex">
            {["desktop", "mobile"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {total[key as keyof typeof total].toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
              {/* <Bar dataKey="pageview" fill={`var(--color-pageview)`} /> */}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
