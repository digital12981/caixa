import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export default function StateSelection() {
  const [cep, setCep] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const formatCep = (value: string) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '');
    // Limita a 8 dígitos
    const limitedValue = numericValue.substring(0, 8);
    // Aplica a máscara XXXXX-XXX
    if (limitedValue.length > 5) {
      return `${limitedValue.substring(0, 5)}-${limitedValue.substring(5)}`;
    }
    return limitedValue;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCep(e.target.value);
    setCep(formattedCep);
  };

  const searchCep = async (cepValue: string): Promise<CepResponse | null> => {
    try {
      const cleanCep = cepValue.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return null;
    }
  };

  const handleFormSubmit = async () => {
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      toast({
        title: "CEP inválido",
        description: "Por favor, digite um CEP válido com 8 dígitos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const cepData = await searchCep(cep);
      
      if (!cepData) {
        toast({
          title: "CEP não encontrado",
          description: "O CEP digitado não foi encontrado. Verifique e tente novamente.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Navegar para a página de propriedades com os dados da localização
      const searchParams = new URLSearchParams({
        city: cepData.localidade,
        state: cepData.uf,
        cep: cep
      });
      
      setLocation(`/properties?${searchParams.toString()}`);
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar o CEP. Tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Digite seu CEP</h2>
            <p className="text-lg text-gray-600">
              Informe seu CEP para encontrarmos imóveis disponíveis em leilão na sua região
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg pt-[36px] pb-[36px] mt-[60px] mb-[60px] ml-[1px] mr-[1px]">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CEP:
              </label>
              <Input
                type="text"
                placeholder="00000-000"
                value={cep}
                onChange={handleCepChange}
                className="w-full text-lg p-4"
                maxLength={9}
              />
              <p className="text-sm text-gray-500 mt-1">
                Digite o CEP no formato 00000-000
              </p>
            </div>

            <div className="text-center">
              <Button
                onClick={handleFormSubmit}
                disabled={isLoading}
                className="btn mr-4"
              >
                {isLoading ? "Buscando..." : "Buscar Imóveis"}
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
        </div>
      </section>
      
      <Footer />
    </div>
  );
}