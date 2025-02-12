import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const initialData = [
  {
    name: "Brian Armstrong",
    handle: "@brian_a",
    current: 0.82,
    d7: 33,
    d30: 40,
    m3: 31,
    m6: 35,
  },
  {
    name: "Jill Gunter",
    handle: "@jillrgu",
    current: 0.48,
    d7: 48,
    d30: 35,
    m3: 39,
    m6: 40,
  },
  {
    name: "Georgios Konstantopoulos",
    handle: "@g",
    current: 0.63,
    d7: 55,
    d30: 35,
    m3: 40,
    m6: 39,
  },
  {
    name: "Matt Huang",
    handle: "@matthu",
    current: 0.48,
    d7: 42,
    d30: 34,
    m3: 40,
    m6: 42,
  },
  {
    name: "Erik Voorhees",
    handle: "@ErikVo",
    current: 0.63,
    d7: 15,
    d30: 29,
    m3: 46,
    m6: 49,
  },
];

const TopGainer = () => {
  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({
    key: "current",
    direction: "asc",
  });
  const [isAbsolute, setIsAbsolute] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const sortedData = [...initialData].sort((a, b) => {
        const modifier = sortConfig.direction === "asc" ? 1 : -1;
        return a[sortConfig.key] > b[sortConfig.key] ? modifier : -modifier;
      });
      setData(sortedData);
    }
  }, [sortConfig, mounted]);

  const calculateRelative = (value) => ((value / 100) * 100).toFixed(2);

  const renderValue = (value, isPercentage = false) => {
    if (typeof value === "number") {
      if (isPercentage) {
        const displayValue = isAbsolute ? value : calculateRelative(value);
        return (
          <span
            className={`flex items-center ${
              value >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {value >= 0 ? "↑" : "↓"}
            {Math.abs(displayValue)}
            {isAbsolute ? "bps" : "%"}
          </span>
        );
      }
      return value.toFixed(2);
    }
    return value;
  };

  const sortData = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (!mounted) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Top Gainer</CardTitle>
          <Button variant="outline">Δ Absolute (bps)</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[100px]">Current</TableHead>
                {["Δ7D", "Δ30D", "Δ3M", "Δ6M"].map((header) => (
                  <TableHead key={header} className="w-[80px]">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.map((row) => (
                <TableRow key={row.handle}>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div className="font-semibold">{row.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {row.handle}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{renderValue(row.current)}</TableCell>
                  <TableCell>{renderValue(row.d7, true)}</TableCell>
                  <TableCell>{renderValue(row.d30, true)}</TableCell>
                  <TableCell>{renderValue(row.m3, true)}</TableCell>
                  <TableCell>{renderValue(row.m6, true)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Top Gainer</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {isAbsolute ? "Δ Absolute (bps)" : "Δ Relative (%)"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsAbsolute(true)}>
              Δ Absolute (bps)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsAbsolute(false)}>
              Δ Relative (%)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => sortData("current")}>
                  Current
                </Button>
              </TableHead>
              {["Δ7D", "Δ30D", "Δ3M", "Δ6M"].map((header) => (
                <TableHead key={header} className="w-[80px]">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.handle}>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <div className="font-semibold">{row.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {row.handle}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{renderValue(row.current)}</TableCell>
                <TableCell>{renderValue(row.d7, true)}</TableCell>
                <TableCell>{renderValue(row.d30, true)}</TableCell>
                <TableCell>{renderValue(row.m3, true)}</TableCell>
                <TableCell>{renderValue(row.m6, true)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopGainer;
