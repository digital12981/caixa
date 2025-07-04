import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, CheckCircle } from "lucide-react";
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
  const { toast } = useToast();

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
      <DialogContent className="max-w-md mx-auto" style={{borderRadius: '2px'}}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold" style={{color: '#1964ad'}}>
            Pagamento PIX
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Status e spinner */}
          <div className="flex flex-col items-center space-y-3">
            {isLoading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin" style={{color: '#1964ad'}} />
                <p className="text-gray-600 text-center">Aguardando pagamento...</p>
              </>
            ) : paymentData ? (
              <>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <p className="text-green-600 font-medium">PIX gerado com sucesso!</p>
                </div>
                <p className="text-gray-600 text-center text-sm">
                  Valor: <span className="font-bold">R$ 64,90</span>
                </p>
              </>
            ) : null}
          </div>

          {/* QR Code */}
          {paymentData?.pixQrCode && !isLoading && (
            <div className="flex justify-center">
              <img 
                src={paymentData.pixQrCode} 
                alt="QR Code PIX" 
                className="w-48 h-48 border border-gray-200"
                style={{borderRadius: '2px'}}
              />
            </div>
          )}

          {/* Código PIX */}
          {paymentData?.pixCode && !isLoading && (
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-2">Código PIX (Copia e Cola):</p>
                <div 
                  className="bg-gray-50 p-3 text-xs font-mono break-all border"
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
            <div className="bg-blue-50 p-4 text-sm text-gray-700" style={{borderRadius: '2px'}}>
              <p className="font-medium mb-2">Como pagar:</p>
              <ol className="list-decimal list-inside space-y-1">
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