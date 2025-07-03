import { CAIXA_LOGO_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <img 
              src={CAIXA_LOGO_URL} 
              alt="Caixa" 
              className="h-8 mb-4"
            />
            <p className="text-gray-300 text-sm">
              Caixa Econômica Federal - Leilões de Imóveis
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Início</a></li>
              <li><a href="#" className="hover:text-white">Como Participar</a></li>
              <li><a href="#" className="hover:text-white">Editais</a></li>
              <li><a href="#" className="hover:text-white">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Informações</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Regulamento</a></li>
              <li><a href="#" className="hover:text-white">Documentação</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Suporte</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <p className="text-sm text-gray-300 mb-2">Central de Atendimento</p>
            <p className="text-sm text-gray-300 mb-2">0800 726 0101</p>
            <p className="text-sm text-gray-300">Segunda a sexta: 8h às 18h</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-sm text-gray-300">
          <p>&copy; 2024 Caixa Econômica Federal. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
