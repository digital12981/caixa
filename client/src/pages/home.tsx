import { Link } from "wouter";
import { Search, FileText, Gavel, Percent, Shield, CreditCard, Home as HomeIcon } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #005CA9 0%, #058ce1 50%, #0066cc 100%)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white">
          <div className="mb-8 inline-block">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white" style={{ fontFamily: "'CAIXA Std Bold'" }}>
              Leilões de Imóveis
            </h1>
            <div className="w-24 h-1 bg-caixa-yellow mx-auto mb-4"></div>
            <div className="text-2xl md:text-3xl font-semibold text-white">
              Caixa Econômica Federal
            </div>
          </div>
          
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: "'CAIXA Std Book'" }}>
            Encontre oportunidades únicas para adquirir seu imóvel com <strong>condições especiais</strong> e <strong>preços competitivos</strong>. 
            Processo transparente, seguro e regulamentado.
          </p>
          
          <div className="flex justify-center">
            <button 
              onClick={() => {
                document.getElementById('como-funciona')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded text-lg font-semibold hover:bg-white hover:text-caixa-blue transition-all duration-200"
            >
              Saiba Como Funciona
            </button>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="como-funciona" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'CAIXA Std Bold'", color: 'var(--caixa-subtitle)' }}>Como Funciona</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--caixa-body-text)' }}>
              Processo transparente e seguro para aquisição de imóveis através de leilões oficiais
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-left p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#EEF4F5] p-6 mb-4" style={{ borderRadius: '2px' }}>
                <h3 className="text-2xl mb-4" style={{ fontFamily: "'CAIXA Std Book'", color: 'var(--caixa-subtitle)' }}>
                  <span className="font-bold" style={{ color: 'var(--caixa-orange)' }}>1.</span> Busque Imóveis
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--caixa-body-text)' }}>
                  Encontre imóveis disponíveis por estado e cidade, com informações detalhadas, fotos e valores atualizados
                </p>
              </div>
            </div>
            
            <div className="text-left p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#EEF4F5] p-6 mb-4" style={{ borderRadius: '2px' }}>
                <h3 className="text-2xl mb-4" style={{ fontFamily: "'CAIXA Std Book'", color: 'var(--caixa-subtitle)' }}>
                  <span className="font-bold" style={{ color: 'var(--caixa-orange)' }}>2.</span> Cadastre-se no Leilões Caixa
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--caixa-body-text)' }}>
                  É obrigatório se cadastrar no programa exclusivo para adquirir imóveis da Caixa. É cobrada uma taxa única de inscrição no valor de R$ 64,90.
                </p>
              </div>
            </div>
            
            <div className="text-left p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#EEF4F5] p-6 mb-4" style={{ borderRadius: '2px' }}>
                <h3 className="text-2xl mb-4" style={{ fontFamily: "'CAIXA Std Book'", color: 'var(--caixa-subtitle)' }}>
                  <span className="font-bold" style={{ color: 'var(--caixa-orange)' }}>3.</span> Compre Diretamente
                </h3>
                <p className="leading-relaxed mb-6" style={{ color: 'var(--caixa-body-text)' }}>
                  Os imóveis disponíveis são vendidos diretamente pela Caixa sem a necessidade de leilão. Basta agendar uma visita e fechar negócio. Documentação entregue em até 7 dias.
                </p>
                <Link href="/state-selection">
                  <button className="btn text-white px-6 py-3 text-lg font-bold w-full">
                    Buscar Imóveis Disponíveis
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'CAIXA Std Bold'", color: 'var(--caixa-subtitle)' }}>
              Vantagens dos Leilões Caixa
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Percent className="text-caixa-blue w-12 h-12 mb-4" />
              <h4 className="font-semibold mb-2" style={{ color: 'var(--caixa-subtitle)' }}>Preços Competitivos</h4>
              <p className="text-sm" style={{ color: 'var(--caixa-body-text)' }}>
                Imóveis com valores abaixo do mercado
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield className="text-caixa-blue w-12 h-12 mb-4" />
              <h4 className="font-semibold mb-2" style={{ color: 'var(--caixa-subtitle)' }}>Segurança Jurídica</h4>
              <p className="text-sm" style={{ color: 'var(--caixa-body-text)' }}>
                Processo transparente e regulamentado
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CreditCard className="text-caixa-blue w-12 h-12 mb-4" />
              <h4 className="font-semibold mb-2" style={{ color: 'var(--caixa-subtitle)' }}>Financiamento</h4>
              <p className="text-sm" style={{ color: 'var(--caixa-body-text)' }}>
                Condições especiais de financiamento
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <HomeIcon className="text-caixa-blue w-12 h-12 mb-4" />
              <h4 className="font-semibold mb-2" style={{ color: 'var(--caixa-subtitle)' }}>Variedade</h4>
              <p className="text-sm" style={{ color: 'var(--caixa-body-text)' }}>
                Casas, apartamentos e terrenos
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
