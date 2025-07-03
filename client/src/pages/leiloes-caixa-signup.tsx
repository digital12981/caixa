import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LeiloesCaixaSignup() {
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
    <div className="min-h-screen bg-[#F9FBFB]">
      <Header />
      
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="mb-8">
              <img 
                src="https://bombaparaiba.com.br/wp-content/uploads/2022/09/imoveis-caixa-1.jpg" 
                alt="Imóveis Caixa Econômica Federal"
                className="mx-auto h-auto shadow-lg"
                style={{borderRadius: '2px', width: '300px'}}
              />
            </div>
            <h1 className="text-4xl font-bold text-caixa-blue mb-4">
              Programa Leilões Caixa
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Para participar dos leilões de imóveis da Caixa, é necessário se inscrever no programa exclusivo que oferece benefícios especiais para participantes.
            </p>
          </div>

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
          </div>

          <div className="bg-white p-8 shadow-lg mb-12" style={{borderRadius: '2px'}}>
            <h2 className="text-2xl font-bold text-caixa-blue mb-8 text-center">
              Benefícios Exclusivos do Programa
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-gray-50" style={{borderRadius: '2px'}}>
                <h3 className="font-bold text-gray-800 mb-3">Documentação Facilitada</h3>
                <p className="text-gray-600 text-sm">
                  Emissão automática de toda documentação necessária para participação nos leilões
                </p>
              </div>
              <div className="p-6 bg-gray-50" style={{borderRadius: '2px'}}>
                <h3 className="font-bold text-gray-800 mb-3">Financiamento Preferencial</h3>
                <p className="text-gray-600 text-sm">
                  Aprovação facilitada em financiamentos Caixa com taxas especiais para participantes
                </p>
              </div>
              <div className="p-6 bg-gray-50" style={{borderRadius: '2px'}}>
                <h3 className="font-bold text-gray-800 mb-3">Desconto no IPTU</h3>
                <p className="text-gray-600 text-sm">
                  Desconto de até 15% no IPTU do primeiro ano para imóveis adquiridos em leilão
                </p>
              </div>
              <div className="p-6 bg-gray-50" style={{borderRadius: '2px'}}>
                <h3 className="font-bold text-gray-800 mb-3">Linha de Crédito Especial</h3>
                <p className="text-gray-600 text-sm">
                  Acesso a empréstimos com juros reduzidos para reforma e adequação do imóvel
                </p>
              </div>
              <div className="p-6 bg-gray-50" style={{borderRadius: '2px'}}>
                <h3 className="font-bold text-gray-800 mb-3">Notificações Prioritárias</h3>
                <p className="text-gray-600 text-sm">
                  Receba alertas exclusivos sobre novos leilões antes da divulgação pública
                </p>
              </div>
              <div className="p-6 bg-gray-50" style={{borderRadius: '2px'}}>
                <h3 className="font-bold text-gray-800 mb-3">Suporte Especializado</h3>
                <p className="text-gray-600 text-sm">
                  Atendimento preferencial com especialistas em leilões imobiliários
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <div className="text-center bg-gray-50 p-8" style={{borderRadius: '2px'}}>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Investimento Único
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-caixa-blue">R$ 64,90</span>
                  <p className="text-gray-600 mt-2">Taxa de inscrição única</p>
                </div>
                <p className="text-gray-700">
                  Pagamento único que garante acesso vitalício ao programa com todos os benefícios inclusos, sem mensalidades.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 shadow-lg" style={{borderRadius: '2px'}}>
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
      </section>
      
      <Footer />
    </div>
  );
}