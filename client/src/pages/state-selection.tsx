import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BRAZILIAN_STATES } from "@/lib/constants";

export default function StateSelection() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [, setLocation] = useLocation();

  const handleStateSelection = (state: string) => {
    setSelectedState(state);
    setLocation(`/properties?state=${state}`);
  };

  const handleFormSubmit = () => {
    if (!selectedState) {
      alert('Por favor, selecione um estado primeiro.');
      return;
    }
    setLocation(`/properties?state=${selectedState}`);
  };

  const popularStates = [
    { code: "SP", name: "São Paulo" },
    { code: "RJ", name: "Rio de Janeiro" },
    { code: "MG", name: "Minas Gerais" },
    { code: "RS", name: "Rio Grande do Sul" },
    { code: "PR", name: "Paraná" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Selecione seu Estado</h2>
            <p className="text-lg text-gray-600">
              Escolha o estado onde deseja buscar imóveis disponíveis em leilão
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado:
              </label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-center">
              <Button
                onClick={handleFormSubmit}
                className="btn mr-4"
              >
                Buscar Imóveis
              </Button>
              <Button
                variant="secondary"
                onClick={() => setLocation("/")}
                className="bg-gray-500 text-white hover:bg-gray-600"
              >
                Voltar
              </Button>
            </div>
          </div>

          {/* Quick State Selection */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-center mb-6" style={{ fontFamily: "'CAIXA Std Bold', 'Inter', sans-serif" }}>
              Ou escolha diretamente:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
              {popularStates.map((state) => (
                <button
                  key={state.code}
                  onClick={() => handleStateSelection(state.code)}
                  className="p-3 md:p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-caixa-blue hover:bg-blue-50 transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  <div className="text-center">
                    <div className="font-bold text-caixa-blue text-lg">{state.code}</div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">{state.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
