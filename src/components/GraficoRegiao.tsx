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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
export const description = "A stacked bar chart with a legend";
const chartData = [
  { regiao: "AC", desktop: 523, mobile: 199 },
  { regiao: "AL", desktop: 873, mobile: 47 },
  { regiao: "AP", desktop: 365, mobile: 652 },
  { regiao: "AM", desktop: 788, mobile: 931 },
  { regiao: "BA", desktop: 162, mobile: 400 },
  { regiao: "CE", desktop: 416, mobile: 779 },
  { regiao: "DF", desktop: 284, mobile: 180 },
  { regiao: "ES", desktop: 619, mobile: 245 },
  { regiao: "GO", desktop: 472, mobile: 723 },
  { regiao: "MA", desktop: 981, mobile: 615 },
  { regiao: "MT", desktop: 559, mobile: 889 },
  { regiao: "MS", desktop: 137, mobile: 556 },
  { regiao: "MG", desktop: 748, mobile: 831 },
  { regiao: "PA", desktop: 904, mobile: 107 },
  { regiao: "PB", desktop: 300, mobile: 618 },
  { regiao: "PR", desktop: 416, mobile: 739 },
  { regiao: "PE", desktop: 527, mobile: 152 },
  { regiao: "PI", desktop: 891, mobile: 83 },
  { regiao: "RJ", desktop: 753, mobile: 678 },
  { regiao: "RN", desktop: 65, mobile: 902 },
  { regiao: "RS", desktop: 122, mobile: 457 },
  { regiao: "RO", desktop: 541, mobile: 216 },
  { regiao: "RR", desktop: 188, mobile: 398 },
  { regiao: "SC", desktop: 294, mobile: 872 },
  { regiao: "SP", desktop: 674, mobile: 358 },
  { regiao: "SE", desktop: 432, mobile: 505 },
  { regiao: "TO", desktop: 840, mobile: 143 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
export function GraficoRegiao() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitantes Filtrados por UF</CardTitle>
        <CardDescription className="max-w-[600px]">Gráfico representando o número de visitantes por Unidade Federativa, categorizado por dispositivos desktop e mobile, com base em dados recentes de acessos.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="regiao"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="desktop"
              stackId="a"
              fill="var(--color-desktop)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="mobile"
              stackId="a"
              fill="var(--color-mobile)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Tendência de alta de 5.2% este mês <TrendingUp className="h-4 w-4" />{" "}
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando o total de leads dos últimos 6 meses
        </div>
      </CardFooter> */}
    </Card>
  );
}
