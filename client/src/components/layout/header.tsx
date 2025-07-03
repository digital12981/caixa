import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { CAIXA_LOGO_URL } from "@/lib/constants";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-caixa-blue text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <img 
                src={CAIXA_LOGO_URL} 
                alt="Caixa Econômica Federal" 
                className="h-8 cursor-pointer"
              />
            </Link>
            <span className="text-xl font-semibold">Leilões de Imóveis</span>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/" 
              className={`hover:text-gray-200 transition-colors ${location === '/' ? 'text-gray-200' : ''}`}
            >
              Início
            </Link>
            <Link 
              href="/state-selection" 
              className={`hover:text-gray-200 transition-colors ${location === '/state-selection' ? 'text-gray-200' : ''}`}
            >
              Buscar Imóveis
            </Link>
            <a href="#" className="hover:text-gray-200 transition-colors">
              Como Participar
            </a>
            <a href="#" className="hover:text-gray-200 transition-colors">
              Contato
            </a>
          </nav>
          
          <button className="md:hidden text-white">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
