import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BRAZILIAN_STATES } from "@/lib/constants";
import type { Property } from "@shared/schema";

export default function Properties() {
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const selectedState = urlParams.get('state') || '';

  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['/api/properties/state', selectedState],
    enabled: !!selectedState,
  });

  const stateName = BRAZILIAN_STATES.find(s => s.code === selectedState)?.name || selectedState;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar imóveis</h2>
            <p className="text-gray-600 mb-6">Não foi possível carregar os imóveis disponíveis.</p>
            <Button onClick={() => setLocation('/state-selection')}>
              Tentar Novamente
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
              <p className="text-gray-600">
                Estado: <span className="font-semibold">{stateName}</span>
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setLocation('/state-selection')}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Alterar Estado
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg shadow-md">
                  <Skeleton className="w-full h-48 rounded-t-lg" />
                  <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Não há imóveis disponíveis para leilão no estado selecionado no momento.
              </p>
              <Button onClick={() => setLocation('/state-selection')}>
                Escolher Outro Estado
              </Button>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
