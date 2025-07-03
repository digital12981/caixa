import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@shared/schema";

// Função para gerar propriedades fake baseadas na localização
const generateFakeProperties = (city: string, state: string): Property[] => {
  const baseProperties = [
    // 3 Casas
    {
      id: 1,
      title: `Casa Residencial de 3 Quartos em ${city}`,
      description: `Excelente casa residencial localizada em ${city}, ${state}. Imóvel com 3 quartos, 2 banheiros, sala, cozinha, área de serviço e garagem para 2 carros.`,
      price: 280000,
      evaluation: 320000,
      location: `Rua das Flores, 123 - ${city}/${state}`,
      city: city,
      state: state,
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      type: "Casa",
      images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"],
      auctionDate: "2025-02-15T10:00:00Z",
      auctionNumber: "LLO001/2025",
      available: true,
    },
    {
      id: 2,
      title: `Casa de 4 Quartos com Quintal em ${city}`,
      description: `Ampla casa familiar em ${city}, ${state}. Propriedade com 4 quartos, 3 banheiros, cozinha americana, quintal e garagem coberta.`,
      price: 450000,
      evaluation: 520000,
      location: `Avenida Central, 456 - ${city}/${state}`,
      city: city,
      state: state,
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      type: "Casa",
      images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"],
      auctionDate: "2025-02-20T14:00:00Z",
      auctionNumber: "LLO002/2025",
      available: true,
    },
    {
      id: 3,
      title: `Casa Térrea com Piscina em ${city}`,
      description: `Bela casa térrea com piscina em ${city}, ${state}. 3 quartos sendo 1 suíte, sala ampla, cozinha planejada, área gourmet e piscina.`,
      price: 380000,
      evaluation: 450000,
      location: `Rua do Sol, 789 - ${city}/${state}`,
      city: city,
      state: state,
      bedrooms: 3,
      bathrooms: 2,
      parking: 3,
      type: "Casa",
      images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"],
      auctionDate: "2025-02-25T10:30:00Z",
      auctionNumber: "LLO003/2025",
      available: true,
    },
    // 2 Apartamentos
    {
      id: 4,
      title: `Apartamento de 2 Quartos no Centro de ${city}`,
      description: `Moderno apartamento no centro de ${city}, ${state}. 2 quartos, 1 banheiro, sala integrada, cozinha americana e vaga de garagem.`,
      price: 180000,
      evaluation: 220000,
      location: `Edifício Central, Apto 801 - ${city}/${state}`,
      city: city,
      state: state,
      bedrooms: 2,
      bathrooms: 1,
      parking: 1,
      type: "Apartamento",
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"],
      auctionDate: "2025-02-18T15:00:00Z",
      auctionNumber: "LLO004/2025",
      available: true,
    },
    {
      id: 5,
      title: `Apartamento de 3 Quartos com Vista para o Mar em ${city}`,
      description: `Apartamento com vista privilegiada em ${city}, ${state}. 3 quartos sendo 1 suíte, 2 banheiros, varanda gourmet e 2 vagas de garagem.`,
      price: 320000,
      evaluation: 380000,
      location: `Edifício Bela Vista, Apto 1205 - ${city}/${state}`,
      city: city,
      state: state,
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      type: "Apartamento",
      images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"],
      auctionDate: "2025-02-22T11:00:00Z",
      auctionNumber: "LLO005/2025",
      available: true,
    },
  ];

  return baseProperties;
};

export default function Properties() {
  const [location, setLocation] = useLocation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const city = urlParams.get('city') || '';
  const state = urlParams.get('state') || '';
  const cep = urlParams.get('cep') || '';

  useEffect(() => {
    if (city && state) {
      // Simula um pequeno delay de carregamento
      setTimeout(() => {
        const fakeProperties = generateFakeProperties(city, state);
        setProperties(fakeProperties);
        setIsLoading(false);
      }, 1000);
    }
  }, [city, state]);

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
                {isLoading ? 'Carregando...' : `${properties.length} imóveis encontrados em ${city}, ${state}`}
              </p>
              {cep && (
                <p className="text-sm text-gray-500">
                  Resultados baseados no CEP: {cep}
                </p>
              )}
            </div>
            <Button
              variant="secondary"
              onClick={() => setLocation('/state-selection')}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Novo CEP
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
