import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatInstallment } from "@/lib/constants";
import { PixPaymentModal } from "@/components/pix-payment-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Property } from "@shared/schema";

export default function LeiloesCaixaSignup() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: ""
  });
  
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixPaymentData, setPixPaymentData] = useState<any>(null);
  const { toast } = useToast();

  // Mutation para processar pagamento PIX
  const pixPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await fetch('/api/payment/pix', {
        method: 'POST',
        body: JSON.stringify(paymentData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao processar pagamento');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setPixPaymentData(data);
      toast({
        title: "PIX gerado com sucesso!",
        description: "Use o QR Code ou copie o código PIX para pagar.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar PIX",
        description: error.message || "Não foi possível gerar o pagamento PIX.",
        variant: "destructive",
      });
    },
  });

  // Recuperar o ID do imóvel selecionado da URL
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPropertyId = parseInt(urlParams.get('propertyId') || '1');
  const city = urlParams.get('city') || '';
  const state = urlParams.get('state') || '';

  // Buscar dados do imóvel selecionado
  const { data: selectedProperty, isLoading: propertyLoading } = useQuery<Property>({
    queryKey: ['/api/properties', selectedPropertyId, city, state],
    queryFn: async () => {
      const queryString = city && state ? `?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}` : '';
      const response = await fetch(`/api/properties/${selectedPropertyId}${queryString}`);
      if (!response.ok) throw new Error('Failed to fetch property');
      return response.json();
    }
  });

  // Recuperar dados do usuário do localStorage se existirem
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const data = JSON.parse(userData);
      setFormData(prev => ({
        ...prev,
        nome: data.nome || "",
        cpf: data.cpf || ""
      }));
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhone(value);
    handleInputChange('telefone', formatted);
  };

  const handlePayment = () => {
    // Validar se todos os campos estão preenchidos
    if (!formData.nome || !formData.cpf || !formData.telefone || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    // Salvar dados do formulário
    localStorage.setItem('signupData', JSON.stringify(formData));
    
    // Abrir modal e processar pagamento PIX
    setShowPixModal(true);
    setPixPaymentData(null);
    
    pixPaymentMutation.mutate({
      name: formData.nome,
      email: formData.email,
      cpf: formData.cpf,
      phone: formData.telefone,
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FBFB]">
      <Header />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="mb-8">
              <img 
                src="https://images.icon-icons.com/523/PNG/512/alert_icon-icons.com_52395.png" 
                alt="Alert Icon"
                className="mx-auto h-auto"
                style={{borderRadius: '2px', width: '120px'}}
              />
            </div>
            <h1 className="font-bold mb-4 text-[30px] text-[#005ca9]">Caixa Informa:</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Para participar dos leilões de imóveis da Caixa, é necessário se inscrever no programa exclusivo que oferece benefícios especiais para participantes.
            </p>
          </div>

          {/* Seção do Imóvel Selecionado */}
          {propertyLoading ? (
            <div className="bg-white p-8 shadow-lg mb-12" style={{borderRadius: '2px'}}>
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" aria-label="Loading"/>
                <p className="mt-4 text-gray-600">Carregando detalhes do imóvel...</p>
              </div>
            </div>
          ) : selectedProperty ? (
            <div className="bg-white p-8 shadow-lg mb-12" style={{borderRadius: '2px'}}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-caixa-blue mb-6">
                  Imóvel Selecionado
                </h2>
                <div className="bg-green-50 border border-green-200 p-4 mb-6" style={{borderRadius: '2px'}}>
                  <p className="text-green-800 font-semibold">
                    ✓ Imóvel separado especialmente para você
                  </p>
                  <p className="text-green-700 mt-2 text-[16px]">
                    Este imóvel não será mostrado para outras pessoas até você completar o cadastro no programa Leilões Caixa
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <img 
                    src={selectedProperty.images[0]} 
                    alt={selectedProperty.title}
                    className="w-full h-auto shadow-lg"
                    style={{borderRadius: '2px', maxHeight: '300px', objectFit: 'cover'}}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{selectedProperty.title}</h3>
                  <p className="text-gray-600 mb-6">{selectedProperty.location}, {selectedProperty.city} - {selectedProperty.state}</p>

                  <div className="bg-orange-50 border border-orange-300 p-4 mb-4" style={{borderRadius: '2px'}}>
                    <div className="text-center">
                      <h4 className="font-bold text-orange-800 mb-3 text-[18px]">⚠️ Acesso Restrito</h4>
                      <p className="text-orange-700 mb-2 text-[16px]">
                        Apenas membros do programa Leilões Caixa podem agendar visitas e adquirir imóveis de leilão da Caixa Econômica Federal.
                      </p>
                      <p className="text-orange-700 text-[16px] mt-[7px] mb-[7px]">
                        <strong>Lei Federal nº 8.666/93 Art. 22-A:</strong> É obrigatória a participação em programa específico para aquisição de bens oriundos de execução judicial em instituições financeiras federais.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 p-6" style={{borderRadius: '2px'}}>
                  <h4 className="font-bold text-blue-800 mb-3 text-[18px]">Próximos Passos</h4>
                  <p className="text-blue-700 text-[16px]">
                    Após concluir seu cadastro no programa Leilões Caixa, você poderá:
                  </p>
                  <ul className="text-blue-700 mt-2 space-y-1 text-[16px]">
                    <li>• Agendar uma visita presencial no imóvel</li>
                    <li>• Fechar negócio diretamente se desejar</li>
                    <li>• Receber suporte especializado durante todo o processo</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : null}


          <div className="bg-white p-8 shadow-lg mb-12" style={{borderRadius: '2px'}}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Inscrição Obrigatória
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 max-w-3xl mx-auto">
                O programa "Leilões Caixa" é um requisito obrigatório para participação em todos os leilões imobiliários da Caixa Econômica Federal.
              </p>
              <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Após a inscrição, você terá acesso completo ao sistema de leilões e poderá participar de todos os processos licitatórios disponíveis.
              </p>
            </div>
            <div className="border-t border-gray-200 pt-8">
              <div className="text-center bg-gray-50 p-8 mb-8" style={{borderRadius: '2px'}}>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-caixa-blue">R$ 64,90</span>
                  <p className="text-gray-600 mt-2">Taxa de inscrição única</p>
                </div>
                <p className="text-gray-700">
                  Pagamento único que garante acesso vitalício ao programa com todos os benefícios inclusos, sem mensalidades.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-caixa-blue mb-8 text-center">
                Complete sua Inscrição
              </h2>
              
              <div className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="nome" className="text-sm font-medium text-gray-700 mb-2 block">
                    Nome Completo
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="w-full bg-gray-100"
                    style={{borderRadius: '2px'}}
                    readOnly
                    disabled
                  />
                </div>
                
                <div>
                  <Label htmlFor="cpf" className="text-sm font-medium text-gray-700 mb-2 block">
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    className="w-full bg-gray-100"
                    style={{borderRadius: '2px'}}
                    readOnly
                    disabled
                  />
                </div>
                
                <div>
                  <Label htmlFor="telefone" className="text-sm font-medium text-gray-700 mb-2 block">
                    Telefone / Celular *
                  </Label>
                  <Input
                    id="telefone"
                    type="text"
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    className="w-full"
                    style={{borderRadius: '2px'}}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                    E-mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full"
                    style={{borderRadius: '2px'}}
                    required
                  />
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={handlePayment}
                  disabled={!formData.telefone || !formData.email}
                  className="btn px-12 py-4 text-lg font-semibold"
                  style={{borderRadius: '2px'}}
                >
                  Finalizar Inscrição - R$ 64,90
                </Button>
                <p className="text-sm text-gray-600 mt-4">
                  Após o pagamento, você receberá acesso imediato ao programa Leilões Caixa
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      
      {/* Modal de Pagamento PIX */}
      <PixPaymentModal
        isOpen={showPixModal}
        onClose={() => setShowPixModal(false)}
        paymentData={pixPaymentData}
        isLoading={pixPaymentMutation.isPending}
      />
    </div>
  );
}