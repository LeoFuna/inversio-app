import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, CalendarIcon, Search, Trash2, Upload } from "lucide-react";
import type React from "react";
import { useState } from "react";
// import { useToast } from "@/hooks/use-toast"
import { AppLayout } from "@/components/app-layout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TradingOperation {
  id: string;
  asset: string;
  date: string;
  strategy: string;
  entryTime: string;
  exitTime: string;
  quantity: number;
  result: number;
  men: number;
  mep: number;
  isPending?: boolean;
}
const mockOperations = [
  {
    id: "1",
    asset: "AÇÕES",
    date: "02/04/2023",
    strategy: "Inversão de Fluxo",
    entryTime: "14:02:30",
    exitTime: "14:03:40",
    quantity: 2,
    result: 30.0,
    men: 1,
    mep: 4,
    isPending: false,
  },
  {
    id: "2",
    asset: "AÇÕES",
    date: "02/04/2023",
    strategy: "Inversão de Fluxo",
    entryTime: "14:02:30",
    exitTime: "14:03:40",
    quantity: 1,
    result: -50.0,
    men: 3,
    mep: 1,
    isPending: true,
  },
];
export default function TradingPage() {
  //   const { toast } = useToast()
  const toast = (teste: object) => console.log(teste);
  const [operations, setOperations] =
    useState<TradingOperation[]>(mockOperations);

  const [formData, setFormData] = useState({
    asset: "",
    date: undefined as Date | undefined,
    entryTime: "14:02:30",
    exitTime: "14:02:30",
    quantity: "2.000",
    result: "25,00",
    men: "7",
    mep: "3",
    strategy: "",
  });

  const [showPending, setShowPending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (
    field: string,
    value: string | Date | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.asset || !formData.date || !formData.strategy) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newOperation: TradingOperation = {
      id: Date.now().toString(),
      asset: formData.asset,
      date: format(formData.date, "dd/MM/yyyy"),
      strategy: formData.strategy,
      entryTime: formData.entryTime,
      exitTime: formData.exitTime,
      quantity: Number.parseFloat(
        formData.quantity.replace(".", "").replace(",", ".")
      ),
      result: Number.parseFloat(formData.result.replace(",", ".")),
      men: Number.parseInt(formData.men),
      mep: Number.parseInt(formData.mep),
    };

    setOperations((prev) => [newOperation, ...prev]);

    toast({
      title: "Sucesso",
      description: "Operação adicionada com sucesso",
    });
  };

  const handleDelete = (id: string) => {
    setOperations((prev) => prev.filter((op) => op.id !== id));
    toast({
      title: "Removido",
      description: "Operação removida com sucesso",
    });
  };

  const filteredOperations = operations.filter((op) => {
    const matchesSearch =
      op.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.strategy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPending = showPending ? op.isPending : true;
    return matchesSearch && matchesPending;
  });

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Add Operation Form */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Adicionar Operação</CardTitle>
              <div className="relative">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  Importar Operações
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete os detalhes abaixo
            </p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <div className="space-y-2">
                <Label htmlFor="asset">Ativo</Label>
                <Select
                  value={formData.asset}
                  onValueChange={(value) => handleInputChange("asset", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AÇÕES">AÇÕES</SelectItem>
                    <SelectItem value="OPÇÕES">OPÇÕES</SelectItem>
                    <SelectItem value="FUTUROS">FUTUROS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date
                        ? format(formData.date, "dd/MM/yyyy")
                        : "dd/mm/aaaa"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => handleInputChange("date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryTime">Hora da Entrada</Label>
                <Input
                  id="entryTime"
                  type="time"
                  value={formData.entryTime}
                  onChange={(e) =>
                    handleInputChange("entryTime", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  placeholder="2.000"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exitTime">Hora da Saída</Label>
                <Input
                  id="exitTime"
                  type="time"
                  value={formData.exitTime}
                  onChange={(e) =>
                    handleInputChange("exitTime", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="result">Resultado Líquido (R$)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="result"
                    placeholder="25,00"
                    className="pl-8"
                    value={formData.result}
                    onChange={(e) =>
                      handleInputChange("result", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="men">MEN</Label>
                <Input
                  id="men"
                  placeholder="7"
                  value={formData.men}
                  onChange={(e) => handleInputChange("men", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mep">MEP</Label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="mep"
                    placeholder="3"
                    className="pr-8"
                    value={formData.mep}
                    onChange={(e) => handleInputChange("mep", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="strategy">Estratégia</Label>
                <Select
                  value={formData.strategy}
                  onValueChange={(value) =>
                    handleInputChange("strategy", value)
                  }
                >
                  <SelectTrigger className="w-96">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inversão de Fluxo">
                      Inversão de Fluxo
                    </SelectItem>
                    <SelectItem value="Leilão">Leilão</SelectItem>
                    <SelectItem value="Rompimento">Rompimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 lg:col-span-4 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Adicionar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar"
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="show-pending" className="text-sm">
              Mostrar pendentes
            </Label>
            <Switch
              id="show-pending"
              checked={showPending}
              onCheckedChange={setShowPending}
            />
          </div>
        </div>

        {/* Operations Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Ativo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="relative">Estratégia</TableHead>
                  <TableHead>Hora da Entrada</TableHead>
                  <TableHead>Hora da Saída</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>MEN</TableHead>
                  <TableHead>MEP</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOperations.map((operation) => (
                  <TableRow key={operation.id}>
                    <TableCell className="font-medium">
                      {operation.asset}
                    </TableCell>
                    <TableCell>{operation.date}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-600 bg-transparent"
                      >
                        + Estratégia
                      </Button>
                    </TableCell>
                    <TableCell>{operation.entryTime}</TableCell>
                    <TableCell>{operation.exitTime}</TableCell>
                    <TableCell>{operation.quantity}</TableCell>
                    <TableCell
                      className={`font-medium ${
                        operation.result >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      R$ {operation.result.toFixed(2).replace(".", ",")}
                    </TableCell>
                    <TableCell>{operation.men}</TableCell>
                    <TableCell>{operation.mep}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(operation.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm">
              {"<"}
            </Button>
            <span>1 de 10</span>
            <Button variant="ghost" size="sm">
              {">"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
