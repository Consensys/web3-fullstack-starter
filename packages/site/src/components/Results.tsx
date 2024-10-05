import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useVoting } from "@/hooks/useVoting";

export const Results = ({
  id,
  title,
  choices,
}: {
  id: number;
  title: string;
  choices: readonly string[];
}) => {
  const [open, setOpen] = useState(false);

  const { results } = useVoting(id);

  const chartData = useMemo(() => {
    if (!results) return [];
    return choices.map((choice, index) => ({
      name: choice,
      votes: Number(results[index]),
    }));
  }, [choices, results]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          Reveal results
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-sm">
            Here are the number of votes that each choice has received
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow my-4">
          <div className="flex flex-col gap-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="votes" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
