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
    name: "vitalik.eth",
    handle: "@VitalikBu...",
    current: 0.33,
    d7: -361,
    d30: -130,
    m3: -42,
    m6: -64,
  },
  {
    name: "aixbt",
    handle: "@aixbt_agent",
    current: 1.09,
    d7: 14,
    d30: -45,
    m3: -55,
    m6: 10,
  },
  {
    name: "jesse.ba...",
    handle: "@jesse...",
    current: 0.16,
    d7: -28,
    d30: -45,
    m3: -42,
    m6: -50,
  },
  {
    name: "Eric Con...",
    handle: "@econ...",
    current: 0.14,
    d7: -81,
    d30: -41,
    m3: -20,
    m6: -11,
  },
  {
    name: "DCinv...",
    handle: "@IamDCinv...",
    current: 0.13,
    d7: -92,
    d30: -38,
    m3: -36,
    m6: -30,
  },
  {
    name: "Gammi...",
    handle: "@gammi...",
    current: 0.18,
    d7: -39,
    d30: -30,
    m3: -17,
    m6: -6,
  },
  {
    name: "Dan Smi...",
    handle: "@smyyg...",
    current: 0.15,
    d7: -25,
    d30: -25,
    m3: -10,
    m6: -7,
  },
  {
    name: "Senator Cy...",
    handle: "@Se...",
    current: 0.08,
    d7: -79,
    d30: -24,
    m3: -6,
    m6: -1,
  },
  {
    name: "mert | heli...",
    handle: "@0x...",
    current: 0.69,
    d7: -49,
    d30: -24,
    m3: -16,
    m6: -23,
  },
  {
    name: "threadg...",
    handle: "@notthre...",
    current: 0.13,
    d7: -38,
    d30: -23,
    m3: -10,
    m6: -7,
  },
];

const TopLoser = () => {
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
      return value.toFixed(2) + "%";
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
          <CardTitle className="text-2xl font-bold text-white">
            Top Loser
          </CardTitle>
          <Button variant="outline">Δ Absolute (bps)</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-zinc-800">
                <TableHead className="w-[200px] text-gray-400">Name</TableHead>
                <TableHead className="w-[100px] text-gray-400">
                  Current
                </TableHead>
                <TableHead className="w-[80px] text-gray-400">Δ7D</TableHead>
                <TableHead className="w-[80px] text-gray-400">Δ30D</TableHead>
                <TableHead className="w-[80px] text-gray-400">Δ3M</TableHead>
                <TableHead className="w-[80px] text-gray-400">Δ6M</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.map((row) => (
                <TableRow key={row.handle} className="border-b border-zinc-800">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-semibold text-white">
                          {row.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {row.handle}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    {renderValue(row.current)}
                  </TableCell>
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
        <CardTitle className="text-2xl font-bold text-white">
          Top Loser
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {isAbsolute ? "Δ Absolute (bps)" : "Δ Relative (%)"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-800 text-white">
            <DropdownMenuItem
              onClick={() => setIsAbsolute(true)}
              className="hover:bg-zinc-700"
            >
              Δ Absolute (bps)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsAbsolute(false)}
              className="hover:bg-zinc-700"
            >
              Δ Relative (%)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-800">
              <TableHead className="w-[200px] text-gray-400">Name</TableHead>
              <TableHead className="w-[100px] text-gray-400">
                <Button
                  variant="ghost"
                  onClick={() => sortData("current")}
                  className="text-gray-400 hover:text-white p-0"
                >
                  Current
                </Button>
              </TableHead>
              <TableHead className="w-[80px] text-gray-400">Δ7D</TableHead>
              <TableHead className="w-[80px] text-gray-400">Δ30D</TableHead>
              <TableHead className="w-[80px] text-gray-400">Δ3M</TableHead>
              <TableHead className="w-[80px] text-gray-400">Δ6M</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.handle} className="border-b border-zinc-800">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-semibold text-white">{row.name}</div>
                      <div className="text-sm text-gray-400">{row.handle}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  {renderValue(row.current)}
                </TableCell>
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

export default TopLoser;
