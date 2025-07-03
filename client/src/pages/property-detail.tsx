import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Bed, Bath, Car } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, calculateDiscount } from "@/lib/constants";
import type { Property } from "@shared/schema";

// Função para obter os dados completos das propriedades fake
const getPropertyData = (id: number): Property | null => {
  const properties: Property[] = [
    {
      id: 1,
      title: "Casa Residencial de 3 Quartos",
      description: "Excelente casa residencial em bairro nobre. Imóvel com 3 quartos sendo 1 suíte, 2 banheiros, sala ampla, cozinha planejada, área de serviço completa e garagem para 2 carros. Localizada em rua tranquila, próxima a escolas, supermercados e transporte público. Casa em ótimo estado de conservação, pronta para morar.",
      price: 280000,
      evaluation: 320000,
      location: "Rua das Flores, 123 - Centro",
      city: "São Paulo",
      state: "SP",
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      type: "Casa",
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1567496898669-ee935f5317ac?w=400&h=300&fit=crop"
      ],
      auctionDate: "2025-02-15",
      auctionNumber: "LLO001/2025",
      available: true,
    },
    {
      id: 2,
      title: "Casa de 4 Quartos com Quintal",
      description: "Ampla casa familiar em excelente localização. Propriedade com 4 quartos sendo 2 suítes, 3 banheiros, sala de estar, sala de jantar, cozinha americana moderna, área gourmet, quintal espaçoso e garagem coberta para 2 carros. Ideal para famílias que buscam conforto e qualidade de vida.",
      price: 450000,
      evaluation: 520000,
      location: "Avenida Central, 456 - Jardim América",
      city: "São Paulo",
      state: "SP",
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      type: "Casa",
      images: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
      ],
      auctionDate: "2025-02-20",
      auctionNumber: "LLO002/2025",
      available: true,
    },
    {
      id: 3,
      title: "Casa Térrea com Piscina",
      description: "Bela casa térrea com área de lazer completa. 3 quartos sendo 1 suíte master, 2 banheiros, sala ampla com pé-direito alto, cozinha planejada, área gourmet com churrasqueira, piscina aquecida e jardim paisagístico. Acabamentos de primeira qualidade e localização privilegiada.",
      price: 380000,
      evaluation: 450000,
      location: "Rua do Sol, 789 - Vila Nova",
      city: "São Paulo",
      state: "SP",
      bedrooms: 3,
      bathrooms: 2,
      parking: 3,
      type: "Casa",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop"
      ],
      auctionDate: "2025-02-25",
      auctionNumber: "LLO003/2025",
      available: true,
    },
    {
      id: 4,
      title: "Apartamento de 2 Quartos no Centro",
      description: "Moderno apartamento no coração da cidade. 2 quartos com armários planejados, 1 banheiro completo, sala integrada com varanda, cozinha americana equipada, área de serviço e 1 vaga de garagem. Edifício com portaria 24h, elevador e área de lazer. Localização estratégica com fácil acesso a transporte público.",
      price: 180000,
      evaluation: 220000,
      location: "Edifício Central, Apto 801 - Centro",
      city: "São Paulo",
      state: "SP",
      bedrooms: 2,
      bathrooms: 1,
      parking: 1,
      type: "Apartamento",
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
      ],
      auctionDate: "2025-02-18",
      auctionNumber: "LLO004/2025",
      available: true,
    },
    {
      id: 5,
      title: "Apartamento de 3 Quartos com Vista Panorâmica",
      description: "Apartamento com vista privilegiada em edifício de alto padrão. 3 quartos sendo 1 suíte master com closet, 2 banheiros, sala ampla com varanda gourmet, cozinha planejada com ilha, área de serviço e 2 vagas de garagem. Edifício com academia, piscina, salão de festas e segurança 24h.",
      price: 320000,
      evaluation: 380000,
      location: "Edifício Bela Vista, Apto 1205 - Bela Vista",
      city: "São Paulo",
      state: "SP",
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      type: "Apartamento",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560449752-3fd4fca5fb6e?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop"
      ],
      auctionDate: "2025-02-22",
      auctionNumber: "LLO005/2025",
      available: true,
    },
  ];

  return properties.find(p => p.id === id) || null;
};

export default function PropertyDetail() {
  const [location, setLocation] = useLocation();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const propertyId = parseInt(location.split('/')[2] || '0');

  useEffect(() => {
    const propertyData = getPropertyData(propertyId);
    setProperty(propertyData);
    setIsLoading(false);
  }, [propertyId]);

  if (!isLoading && !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Imóvel não encontrado</h2>
            <p className="text-gray-600 mb-6">O imóvel solicitado não foi encontrado.</p>
            <Button onClick={() => setLocation('/properties')}>
              Voltar para Listagem
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
                  className="w-full h-96 object-cover shadow-lg mb-4"
                  style={{borderRadius: '2px'}}
                />
                <div className="grid grid-cols-2 gap-2">
                  {property.images.slice(1).map((img: string, index: number) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`${property.title} - ${index + 2}`}
                      className="w-full h-24 object-cover cursor-pointer hover:opacity-75 transition-opacity"
                      style={{borderRadius: '2px'}}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-6 shadow-lg" style={{borderRadius: '2px'}}>
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
                
                <div className="bg-gray-50 p-4 mb-6" style={{borderRadius: '2px'}}>
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
                  <div className="text-center p-3 bg-gray-50" style={{borderRadius: '2px'}}>
                    <Bed className="text-caixa-blue w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Quartos</div>
                    <div className="font-semibold">{property.bedrooms}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50" style={{borderRadius: '2px'}}>
                    <Bath className="text-caixa-blue w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Banheiros</div>
                    <div className="font-semibold">{property.bathrooms}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50" style={{borderRadius: '2px'}}>
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
                  <Button className="btn w-full py-3 font-semibold" style={{borderRadius: '2px'}}>
                    Participar do Leilão
                  </Button>
                  <Button 
                    variant="secondary"
                    className="w-full bg-gray-200 text-gray-800 py-3 hover:bg-gray-300"
                    style={{borderRadius: '2px'}}
                  >
                    Baixar Edital
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Descrição do Imóvel</h3>
            <div className="bg-white p-6 shadow-lg" style={{borderRadius: '2px'}}>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
