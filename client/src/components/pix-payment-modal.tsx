import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: {
    pixCode: string;
    pixQrCode: string;
    id: string;
  } | null;
  isLoading: boolean;
}

export function PixPaymentModal({ isOpen, onClose, paymentData, isLoading }: PixPaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(14 * 60); // 14 minutos em segundos
  const { toast } = useToast();

  // Timer de 14 minutos
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          toast({
            title: "Tempo expirado",
            description: "O tempo para pagamento expirou. Tente novamente.",
            variant: "destructive",
          });
          onClose();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose, toast]);

  // Reset timer quando modal abre
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(14 * 60);
      setCopied(false);
    }
  }, [isOpen]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async () => {
    if (!paymentData?.pixCode) return;
    
    try {
      await navigator.clipboard.writeText(paymentData.pixCode);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Código PIX copiado para a área de transferência.",
      });
      
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o código.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-white overflow-y-auto"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999
      }}
    >
      <div className="flex flex-col h-full justify-center space-y-4 py-6 max-w-md mx-auto" style={{transform: 'translateY(-5%) translateX(-5px)'}}>
        {/* Box laranja com status aguardando pagamento */}
        <div 
          className="p-4 mx-6"
          style={{
            backgroundColor: '#fef3e2',
            border: '1px solid #d17d00',
            borderRadius: '2px'
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
            <Loader2 className="h-6 w-6 animate-spin" style={{color: '#d17d00'}} />
            <h3 className="text-lg sm:text-xl font-bold text-center" style={{color: '#b8590a'}}>
              Aguardando Pagamento
            </h3>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-base font-medium" style={{color: '#b8590a'}}>
              Valor: <span className="font-bold text-lg">R$ 64,90</span>
            </p>
            
            
            
            <p className="text-sm" style={{color: '#d17d00'}}>
              Complete o pagamento antes que o tempo expire
            </p>
          </div>
        </div>

        {/* QR Code */}
        {paymentData?.pixQrCode && !isLoading && (
          <div className="flex justify-center mx-6">
            <img 
              src={paymentData.pixQrCode} 
              alt="QR Code PIX" 
              className="w-32 h-32 sm:w-40 sm:h-40 border border-gray-200"
              style={{borderRadius: '2px'}}
            />
          </div>
        )}

        {/* Código PIX */}
        {paymentData?.pixCode && !isLoading && (
          <div className="space-y-3 mx-6">
            <div className="text-center">
              <p className="text-sm font-medium mb-2" style={{color: '#1964ad'}}>Código PIX (Copia e Cola):</p>
              <div 
                className="bg-gray-50 p-3 text-xs font-mono break-all border"
                style={{borderRadius: '2px'}}
              >
                {paymentData.pixCode}
              </div>
            </div>
            
            <Button 
              onClick={copyToClipboard}
              className="w-full h-11 text-base font-semibold"
              style={{
                backgroundColor: copied ? '#22c55e' : '#1964ad',
                borderRadius: '2px'
              }}
              disabled={copied}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Código PIX
                </>
              )}
            </Button>
          </div>
        )}

        {/* Box informativa sobre cadastro */}
        {paymentData && !isLoading && (
          <div className="mx-6">
            <div 
              className="p-4 text-center"
              style={{
                backgroundColor: '#EEF4F5',
                borderRadius: '2px'
              }}
            >
              <p className="text-sm text-gray-700 leading-relaxed">
                Após o pagamento, você será cadastrado no programa <strong>Leilões Caixa</strong> e poderá comprar qualquer imóvel disponível nos leilões Caixa.
              </p>
            </div>
          </div>
        )}


      </div>
      {/* Botão fechar no canto superior direito */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:text-gray-700 text-[#ffffff]"
        style={{zIndex: 10000}}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}