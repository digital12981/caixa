import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Bed, Bath, Car, Calendar } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, calculateDiscount } from "@/lib/constants";
import type { Property } from "@shared/schema";

export default function PropertyDetail() {
  const [location, setLocation] = useLocation();
  const propertyId = location.split('/')[2];

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ['/api/properties', propertyId],
    enabled: !!propertyId,
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Imóvel não encontrado</h2>
            <p className="text-gray-600 mb-6">O imóvel solicitado não foi encontrado.</p>
            <Button onClick={() => setLocation('/state-selection')}>
              Voltar para Busca
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <Skeleton className="w-full h-96 rounded-lg mb-4" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="w-full h-24 rounded" />
                  <Skeleton className="w-full h-24 rounded" />
                </div>
              </div>
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!property) return null;

  const discount = calculateDiscount(property.price, property.evaluation);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="text-caixa-blue hover:text-blue-700 flex items-center mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para listagem
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              {/* Property image gallery */}
              <div className="mb-6">
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg mb-4"
                />
                <div className="grid grid-cols-2 gap-2">
                  {property.images.slice(1).map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`${property.title} - ${index + 2}`}
                      className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    property.type === 'Casa' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {property.type}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Leilão #{property.auctionNumber}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <p className="text-lg text-gray-600 mb-6">{property.location}</p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl font-bold text-caixa-blue">
                      {formatCurrency(property.price)}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Avaliação</div>
                      <div className="text-lg text-gray-500 line-through">
                        {formatCurrency(property.evaluation)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Economia de {discount}%
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <Bed className="text-caixa-blue w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Quartos</div>
                    <div className="font-semibold">{property.bedrooms}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <Bath className="text-caixa-blue w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Banheiros</div>
                    <div className="font-semibold">{property.bathrooms}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <Car className="text-caixa-blue w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Vagas</div>
                    <div className="font-semibold">{property.parking}</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Informações do Leilão</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data do Leilão:</span>
                      <span className="font-medium">{property.auctionDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Horário:</span>
                      <span className="font-medium">14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Local:</span>
                      <span className="font-medium">Online</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button className="btn w-full py-3 font-semibold">
                    Participar do Leilão
                  </Button>
                  <Button 
                    variant="secondary"
                    className="w-full bg-gray-200 text-gray-800 py-3 hover:bg-gray-300"
                  >
                    Baixar Edital
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Descrição do Imóvel</h3>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
