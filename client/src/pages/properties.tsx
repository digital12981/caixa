import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@shared/schema";

export default function Properties() {
  const [location, setLocation] = useLocation();
  
  // Usar window.location.search para capturar os parâmetros corretamente
  const urlParams = new URLSearchParams(window.location.search);
  const city = urlParams.get('city') || '';
  const state = urlParams.get('state') || '';
  const cep = urlParams.get('cep') || '';

  // Buscar todas as propriedades disponíveis independente do estado
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    enabled: true,
  });

  if (!city || !state) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Dados de localização não encontrados</h2>
            <p className="text-gray-600 mb-6">É necessário informar um CEP válido para visualizar os imóveis.</p>
            <Button onClick={() => setLocation('/state-selection')}>
              Voltar e Informar CEP
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Imóveis Disponíveis
              </h2>
              <p className="text-lg text-gray-600">
                {isLoading ? 'Carregando...' : `${properties.length} imóveis disponíveis em leilão`}
              </p>
              <p className="text-sm text-gray-500">
                Leilões disponíveis em todo o Brasil • Localização pesquisada: {city}, {state}
              </p>
            </div>
            <Button 
              onClick={() => setLocation('/state-selection')}
              variant="outline"
            >
              Buscar em Outra Localização
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">
                Nenhum leilão disponível no momento
              </h3>
              <p className="text-gray-500 mb-6">
                Não há leilões ativos disponíveis. Tente novamente mais tarde.
              </p>
              <Button onClick={() => setLocation('/')}>
                Voltar ao Início
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property: Property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}