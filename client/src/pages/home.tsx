import { Link } from "wouter";
import { Search, FileText, Gavel, Percent, Shield, CreditCard, Home as HomeIcon } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-caixa-blue to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Leilões de Imóveis Caixa
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Encontre oportunidades únicas para adquirir seu imóvel com condições especiais e preços competitivos
          </p>
          <Link href="/state-selection">
            <button className="btn text-white px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform">
              Buscar Imóveis Disponíveis
            </button>
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Processo transparente e seguro para aquisição de imóveis através de leilões oficiais
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-caixa-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Busque Imóveis</h3>
              <p className="text-gray-600">
                Encontre imóveis disponíveis por estado e cidade, com informações detalhadas e fotos
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-caixa-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Analise Documentos</h3>
              <p className="text-gray-600">
                Acesse toda documentação necessária e editais para tomada de decisão informada
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-caixa-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gavel className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Participe do Leilão</h3>
              <p className="text-gray-600">
                Faça seus lances de forma segura através da plataforma oficial da Caixa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vantagens dos Leilões Caixa
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Percent className="text-caixa-blue w-12 h-12 mb-4" />
              <h4 className="font-semibold mb-2">Preços Competitivos</h4>
              <p className="text-gray-600 text-sm">
                Imóveis com valores abaixo do mercado
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield className="text-caixa-blue w-12 h-12 mb-4" />
              <h4 className="font-semibold mb-2">Segurança Jurídica</h4>
              <p className="text-gray-600 text-sm">
                Processo transparente e regulamentado
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CreditCard className="text-caixa-blue w-12 h-12 mb-4" />
              <h4 className="font-semibold mb-2">Financiamento</h4>
              <p className="text-gray-600 text-sm">
                Condições especiais de financiamento
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <HomeIcon className="text-caixa-blue w-12 h-12 mb-4" />
              <h4 className="font-semibold mb-2">Variedade</h4>
              <p className="text-gray-600 text-sm">
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
