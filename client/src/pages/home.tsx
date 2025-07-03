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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/state-selection">
              <button className="btn text-white px-10 py-4 text-xl font-bold">
                Buscar Imóveis Disponíveis
              </button>
            </Link>
            <a href="#como-funciona" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded text-lg font-semibold hover:bg-white hover:text-caixa-blue transition-all duration-200">
              Saiba Como Funciona
            </a>
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
            <div className="text-center p-8 bg-white rounded-lg shadow-lg border-l-4 border-caixa-yellow hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-caixa-blue to-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'CAIXA Std Bold'", color: 'var(--caixa-subtitle)' }}>
                1. Busque Imóveis
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--caixa-body-text)' }}>
                Encontre imóveis disponíveis por estado e cidade, com informações detalhadas, fotos e valores atualizados
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-lg shadow-lg border-l-4 border-caixa-orange hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-caixa-orange to-orange-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'CAIXA Std Bold'", color: 'var(--caixa-subtitle)' }}>
                2. Analise Documentos
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--caixa-body-text)' }}>
                Acesse toda documentação necessária e editais para tomada de decisão informada e segura
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-lg shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Gavel className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'CAIXA Std Bold'", color: 'var(--caixa-subtitle)' }}>
                3. Participe do Leilão
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--caixa-body-text)' }}>
                Faça seus lances de forma segura através da plataforma oficial da Caixa Econômica Federal
              </p>
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
