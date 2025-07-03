import { Link, useLocation } from "wouter";
import { Menu, Search, User } from "lucide-react";
import { CAIXA_LOGO_URL } from "@/lib/constants";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="caixa-header">
      <div className="caixa-header-logo">
        <Link href="/">
          <img 
            src={CAIXA_LOGO_URL} 
            alt="Caixa Econômica Federal"
          />
        </Link>
      </div>

      <div className="caixa-header-nav">
        <div className="caixa-header-nav-item">
          <Link href="/">
            Início
          </Link>
        </div>
        <div className="caixa-header-nav-item">
          <Link href="/state-selection">
            Buscar Imóveis
          </Link>
        </div>
        <div className="caixa-header-nav-item">
          <a href="#">Como Participar</a>
        </div>
        <div className="caixa-header-nav-item">
          <a href="#">Editais</a>
        </div>
        <div className="caixa-header-nav-item">
          <a href="#">Contato</a>
        </div>
      </div>

      <div className="caixa-header-actions">
        <div className="caixa-search-box">
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="caixa-search-input"
          />
          <Search size={16} color="white" />
        </div>
        
        <a href="#" className="caixa-account-btn">
          <User size={20} />
          Minha Conta
        </a>

        <button className="caixa-mobile-menu">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
