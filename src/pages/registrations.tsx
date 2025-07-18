import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronsUpDown, Pencil, Search, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

interface Strategy {
  id: string;
  name: string;
  direction: "Contra Tendencia" | "Tendencia" | "Neutro";
  description: string;
}

const mockStrategies: Strategy[] = [
  {
    id: "1",
    name: "Estratégia de Reversão à Média",
    direction: "Contra Tendencia",
    description: "Opera buscando o retorno do preço à sua média histórica.",
  },
  {
    id: "2",
    name: "Seguidor de Tendência",
    direction: "Tendencia",
    description: "Opera a favor da tendência principal do mercado.",
  },
  {
    id: "3",
    name: "Operação Neutra",
    direction: "Neutro",
    description: "Não depende da direção do mercado.",
  },
];

const initialFormData = {
  name: "",
  direction: "Neutro" as const,
  description: "",
};

export default function RegistrationsPage() {
  const [strategies, setStrategies] = useState<Strategy[]>(mockStrategies);
  const [formData, setFormData] =
    useState<Omit<Strategy, "id">>(initialFormData);
  const [editingStrategyId, setEditingStrategyId] = useState<string | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancelEdit = () => {
    setEditingStrategyId(null);
    setFormData(initialFormData);
    setIsFormOpen(false);
  };

  const handleEdit = (strategy: Strategy) => {
    setEditingStrategyId(strategy.id);
    setFormData({
      name: strategy.name,
      direction: strategy.direction,
      description: strategy.description,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.direction) {
      toast.error("Nome e Direção são campos obrigatórios.");
      return;
    }

    if (editingStrategyId) {
      setStrategies((prev) =>
        prev.map((s) =>
          s.id === editingStrategyId ? { ...s, ...formData } : s
        )
      );
      toast.success("Estratégia atualizada com sucesso!");
    } else {
      const newStrategy: Strategy = {
        id: Date.now().toString(),
        ...formData,
      };
      setStrategies((prev) => [newStrategy, ...prev]);
      toast.success("Estratégia adicionada com sucesso!");
    }

    handleCancelEdit();
  };

  const handleDelete = (id: string) => {
    setStrategies((prev) => prev.filter((s) => s.id !== id));
    toast.success("Estratégia removida com sucesso.");
  };

  const filteredStrategies = strategies.filter(
    (strategy) =>
      strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.direction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
          <CollapsibleTrigger asChild>
            <div
              className="flex items-center justify-between w-full p-4 border rounded-lg cursor-pointer"
              onClick={() => {
                if (editingStrategyId) {
                  handleCancelEdit();
                }
                setIsFormOpen((prev) => !prev);
              }}
            >
              <h2 className="text-lg font-semibold">Adicionar Estratégia</h2>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingStrategyId
                    ? "Editar Estratégia"
                    : "Adicionar Nova Estratégia"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Nome da estratégia"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direction">Direção</Label>
                    <Select
                      value={formData.direction}
                      onValueChange={(
                        value: "Contra Tendencia" | "Tendencia" | "Neutro"
                      ) => handleInputChange("direction", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Contra Tendencia">
                          Contra Tendência
                        </SelectItem>
                        <SelectItem value="Tendencia">Tendência</SelectItem>
                        <SelectItem value="Neutro">Neutro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      placeholder="Descreva a estratégia"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 flex justify-end gap-2 pt-4">
                    {editingStrategyId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button type="submit" className="w-full md:w-auto">
                      {editingStrategyId
                        ? "Salvar Alterações"
                        : "Adicionar Estratégia"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, direção ou descrição..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-center">Nome</TableHead>
                    <TableHead className="text-center">Direção</TableHead>
                    <TableHead className="text-center">Descrição</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStrategies.map((strategy) => (
                    <TableRow key={strategy.id}>
                      <TableCell className="font-medium">
                        {strategy.name}
                      </TableCell>
                      <TableCell>{strategy.direction}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="w-64 truncate">
                                {strategy.description}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs break-words">
                                {strategy.description}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(strategy)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(strategy.id)}
                          className="h-8 w-8 p-0 px-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
