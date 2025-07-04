import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

  // Cronômetro de 14 minutos
  useEffect(() => {
    if (!isOpen || isLoading || !paymentData) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isLoading, paymentData]);

  // Resetar timer quando modal abre
  useEffect(() => {
    if (isOpen && paymentData) {
      setTimeLeft(14 * 60);
    }
  }, [isOpen, paymentData]);

  // Formatar tempo (MM:SS)
  const formatTime = (seconds: number) => {
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
        title: "Código PIX copiado!",
        description: "O código foi copiado para a área de transferência.",
      });
      
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código PIX.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-none mx-2 max-h-[95vh] overflow-y-auto left-1/2 transform -translate-x-1/2" style={{borderRadius: '2px'}}>
        <DialogHeader className="sr-only">
          <DialogTitle>Pagamento PIX</DialogTitle>
          <DialogDescription>
            Modal para pagamento via PIX no valor de R$ 64,90 para cadastro no Leilões Caixa
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3">
          {/* Box laranja com status aguardando pagamento */}
          <div 
            className="p-4 mb-6"
            style={{
              backgroundColor: '#fef3e2',
              border: '1px solid #d17d00',
              borderRadius: '2px'
            }}
          >
            <div className="flex items-center justify-center space-x-3 mb-3">
              <Loader2 className="h-6 w-6 animate-spin" style={{color: '#d17d00'}} />
              <h3 className="text-lg font-bold" style={{color: '#b8590a'}}>Aguardando Pagamento</h3>
            </div>
            
            <div className="text-center space-y-2">
              <p className="font-medium" style={{color: '#b8590a'}}>
                Valor: <span className="font-bold">R$ 64,90</span>
              </p>
              
              {/* Cronômetro */}
              {(isLoading || paymentData) && (
                <div className="flex items-center justify-center space-x-2" style={{color: '#b8590a'}}>
                  <Clock className="h-4 w-4" />
                  <span className="text-lg font-mono font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
              
              <p className="text-sm" style={{color: '#d17d00'}}>
                Complete o pagamento antes que o tempo expire
              </p>
            </div>
          </div>

          {/* QR Code */}
          {paymentData?.pixQrCode && !isLoading && (
            <div className="flex justify-center">
              <img 
                src={paymentData.pixQrCode} 
                alt="QR Code PIX" 
                className="w-32 h-32 border border-gray-200"
                style={{borderRadius: '2px'}}
              />
            </div>
          )}

          {/* Código PIX */}
          {paymentData?.pixCode && !isLoading && (
            <div className="space-y-2">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-1">Código PIX (Copia e Cola):</p>
                <div 
                  className="bg-gray-50 p-2 text-xs font-mono break-all border"
                  style={{borderRadius: '2px'}}
                >
                  {paymentData.pixCode}
                </div>
              </div>
              
              <Button 
                onClick={copyToClipboard}
                className="w-full"
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

          {/* Instruções */}
          {paymentData && !isLoading && (
            <div className="bg-blue-50 p-3 text-xs text-gray-700" style={{borderRadius: '2px'}}>
              <p className="font-medium mb-1">Como pagar:</p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Abra o app do seu banco</li>
                <li>Escolha a opção PIX</li>
                <li>Escaneie o QR Code ou cole o código</li>
                <li>Confirme o pagamento de R$ 64,90</li>
              </ol>
            </div>
          )}

          {/* Botão fechar */}
          {!isLoading && (
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full"
              style={{borderRadius: '2px'}}
            >
              Fechar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}