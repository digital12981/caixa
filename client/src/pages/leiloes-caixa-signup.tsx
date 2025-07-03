import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LeiloesCaixaSignup() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: ""
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
    // Salvar dados do formulário
    localStorage.setItem('signupData', JSON.stringify(formData));
    alert("Redirecionando para o pagamento da Taxa de Inscrição...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-caixa-blue hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos detalhes do imóvel
          </button>

          <div className="bg-white shadow-lg p-6 md:p-8" style={{borderRadius: '2px'}}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-caixa-blue mb-4">
                Leilões Caixa
              </h1>
              <p className="text-lg text-gray-700">
                Programa Exclusivo para Participação em Leilões Imobiliários
              </p>
            </div>

            <div className="mb-8 p-6" style={{backgroundColor: '#f8f9fa', borderRadius: '2px'}}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                ⚠️ Importante: Inscrição Obrigatória
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Para participar dos leilões de imóveis da Caixa Econômica Federal, é obrigatória a inscrição 
                no programa <strong>"Leilões Caixa"</strong>. Este é um programa exclusivo que garante sua 
                elegibilidade para participar de todos os leilões imobiliários da instituição.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-caixa-blue mb-6">
                Benefícios Exclusivos do Programa
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200" style={{borderRadius: '2px'}}>
                  <h3 className="font-semibold text-gray-800 mb-2">📋 Documentação Facilitada</h3>
                  <p className="text-sm text-gray-600">
                    Emissão automática de toda documentação necessária para participação nos leilões
                  </p>
                </div>
                <div className="p-4 border border-gray-200" style={{borderRadius: '2px'}}>
                  <h3 className="font-semibold text-gray-800 mb-2">💰 Financiamento Preferencial</h3>
                  <p className="text-sm text-gray-600">
                    Aprovação facilitada em financiamentos Caixa com taxas especiais para participantes
                  </p>
                </div>
                <div className="p-4 border border-gray-200" style={{borderRadius: '2px'}}>
                  <h3 className="font-semibold text-gray-800 mb-2">🏠 Desconto no IPTU</h3>
                  <p className="text-sm text-gray-600">
                    Desconto de até 15% no IPTU do primeiro ano para imóveis adquiridos em leilão
                  </p>
                </div>
                <div className="p-4 border border-gray-200" style={{borderRadius: '2px'}}>
                  <h3 className="font-semibold text-gray-800 mb-2">💳 Linha de Crédito Especial</h3>
                  <p className="text-sm text-gray-600">
                    Acesso a empréstimos com juros reduzidos para reforma e adequação do imóvel
                  </p>
                </div>
                <div className="p-4 border border-gray-200" style={{borderRadius: '2px'}}>
                  <h3 className="font-semibold text-gray-800 mb-2">🔔 Notificações Prioritárias</h3>
                  <p className="text-sm text-gray-600">
                    Receba alertas exclusivos sobre novos leilões antes da divulgação pública
                  </p>
                </div>
                <div className="p-4 border border-gray-200" style={{borderRadius: '2px'}}>
                  <h3 className="font-semibold text-gray-800 mb-2">🏆 Suporte Especializado</h3>
                  <p className="text-sm text-gray-600">
                    Atendimento preferencial com especialistas em leilões imobiliários
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 p-6" style={{backgroundColor: '#1964ad', borderRadius: '2px'}}>
              <h2 className="text-xl font-semibold text-white mb-4">
                💎 Investimento Único - Benefícios Vitalícios
              </h2>
              <div className="text-white">
                <p className="mb-3">
                  <strong>Taxa de Inscrição:</strong> <span className="text-2xl font-bold">R$ 64,90</span>
                </p>
                <p className="text-sm">
                  Pagamento único que garante acesso vitalício ao programa "Leilões Caixa" e todos os seus benefícios. 
                  Sem mensalidades ou taxas adicionais.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-caixa-blue mb-6">
                Complete seu Cadastro
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                    Nome Completo
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="mt-1"
                    style={{borderRadius: '2px'}}
                    readOnly
                  />
                </div>
                
                <div>
                  <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    className="mt-1"
                    style={{borderRadius: '2px'}}
                    readOnly
                  />
                </div>
                
                <div>
                  <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                    Telefone / Celular
                  </Label>
                  <Input
                    id="telefone"
                    type="text"
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    className="mt-1"
                    style={{borderRadius: '2px'}}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    className="mt-1"
                    style={{borderRadius: '2px'}}
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={handlePayment}
                disabled={!formData.telefone || !formData.email}
                className="btn px-8 py-3 text-lg font-semibold"
                style={{borderRadius: '2px'}}
              >
                Pagar Taxa de Inscrição - R$ 64,90
              </Button>
              <p className="text-sm text-gray-600 mt-3">
                Após o pagamento, você receberá o acesso imediato ao programa Leilões Caixa
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}