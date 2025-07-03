import { CAIXA_LOGO_URL } from "@/lib/constants";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer id="rodape" className="bg-white">
      <div className="content-rodape max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-1 gap-8 text-center">
          {/* Contato */}
          <div className="column-rodape">
            <p className="soft">Central de Atendimento</p>
            <p className="telefone">0800 726 0101</p>
            <p className="soft">Segunda a sexta: 8h às 18h</p>
            <p className="soft">Sábados: 10h às 16h</p>
            
            <div className="redes-sociais mt-6">
              <p className="soft mb-3">Redes Sociais</p>
              <div className="flex gap-4 justify-center">
                <a href="#" className="icon-link">
                  <Facebook className="icon w-5 h-5" />
                </a>
                <a href="#" className="icon-link">
                  <Instagram className="icon w-5 h-5" />
                </a>
                <a href="#" className="icon-link">
                  <Youtube className="icon w-5 h-5" />
                </a>
                <a href="#" className="icon-link">
                  <Twitter className="icon w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seção de informações com logos */}
      <div className="informacao-rodape">
        <ul>
          <li>
            <a href="#">
              <img src="https://via.placeholder.com/120x42/005CA9/FFFFFF?text=BANCO+CENTRAL" alt="Banco Central" />
            </a>
          </li>
          <li>
            <span className="divisor-rodape"></span>
          </li>
          <li>
            <a href="#">
              <img src="https://via.placeholder.com/120x42/005CA9/FFFFFF?text=GOVERNO+FEDERAL" alt="Governo Federal" />
            </a>
          </li>
        </ul>
      </div>
      
      {/* Links do footer */}
      <div className="link-footer">
        <ul>
          <li><a href="#" data-text="Política de Privacidade">Política de Privacidade</a></li>
          <li><a href="#" data-text="Termo de Uso">Termo de Uso</a></li>
          <li><a href="#" data-text="Segurança">Segurança</a></li>
          <li><a href="#" data-text="Acessibilidade">Acessibilidade</a></li>
          <li><a href="#" data-text="Mapa do Site">Mapa do Site</a></li>
        </ul>
      </div>
      
      {/* Rodapé azul */}
      <div className="rodape-azul">
        <p>&copy; 2024 Caixa Econômica Federal. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
