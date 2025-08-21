"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const [month, setMonth] = React.useState<Date>(new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
            }
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
            }
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Week of{" "}
            {month.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            month={month}
            onMonthChange={setMonth}
            numberOfMonths={1}
            className="mx-auto"
          />
        </CardContent>
      </Card>
    </div>
  );
}
