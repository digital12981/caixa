import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { paymentService } from "./payment-service";

// Cache para manter consistência dos bairros durante a sessão
const neighborhoodCache = new Map<string, string[]>();
// Clear cache on startup to ensure clean data
neighborhoodCache.clear();

// Função para limpar o cache (useful for development)
function clearNeighborhoodCache() {
  neighborhoodCache.clear();
  console.log('Neighborhood cache cleared');
}

// Function to get nearby neighborhoods using Perplexity AI
async function getNearbyNeighborhoods(city: string, state: string): Promise<string[]> {
  const cacheKey = `${city}-${state}`;
  
  // Verificar se já temos os bairros em cache
  if (neighborhoodCache.has(cacheKey)) {
    return neighborhoodCache.get(cacheKey)!;
  }
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'Retorne apenas nomes separados por vírgula. Máximo 20 palavras.'
          },
          {
            role: 'user',
            content: `4 bairros num raio de 20km de ${city}, ${state}:`
          }
        ],
        max_tokens: 100,
        temperature: 0.2,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      return [city]; // Fallback to original city
    }

    const data = await response.json();
    const citiesText = data.choices?.[0]?.message?.content || '';
    
    // Parse neighborhoods from response and clean them
    // Extract only the first part (before any explanations or asterisks)
    const cleanText = citiesText.split('*')[0].split('\n')[0];
    const neighborhoods = cleanText
      .split(',')
      .map((n: string) => {
        // Remove números, dois pontos, e caracteres especiais, manter apenas letras e espaços
        return n.trim()
          .replace(/^\d+\.\s*/, '') // Remove números no início (1. 2. etc)
          .replace(/:/g, '') // Remove dois pontos
          .replace(/[^\w\s\u00C0-\u017F]/g, '') // Remove caracteres especiais, mantém acentos
          .replace(/\.$/, '') // Remove ponto no final
          .trim();
      })
      .filter((n: string) => n.length > 2 && n.length < 30) // Filter out explanatory text
      .slice(0, 4); // Ensure we only get 4 neighborhoods
    const result = neighborhoods.length >= 1 ? neighborhoods : [city]; // Fallback to at least the original city
    
    // Salvar no cache para manter consistência
    neighborhoodCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching nearby neighborhoods:', error);
    const fallback = [city];
    neighborhoodCache.set(cacheKey, fallback);
    return fallback; // Fallback to original city
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Heroku
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Clear neighborhood cache endpoint (development)
  app.post("/api/clear-cache", (req, res) => {
    clearNeighborhoodCache();
    res.json({ success: true, message: "Cache cleared" });
  });

  // Get all properties
  app.get("/api/properties", async (req, res) => {
    try {
      const { city, state } = req.query;
      const properties = await storage.getProperties();
      
      // If city and state are provided, update locations with nearby neighborhoods
      if (city && state) {
        const nearbyCities = await getNearbyNeighborhoods(city as string, state as string);
        
        // Update each property with a nearby city and searched state
        const updatedProperties = properties.map((property) => {
          const cityIndex = (property.id - 1) % nearbyCities.length; // Use property ID to ensure consistency
          return {
            ...property,
            city: nearbyCities[cityIndex] || (city as string),
            state: state as string, // Use the searched state instead of property's original state
            location: `${nearbyCities[cityIndex] || (city as string)}, ${state as string}`
          };
        });
        
        res.json(updatedProperties);
      } else {
        res.json(properties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  // Get properties by state
  app.get("/api/properties/state/:state", async (req, res) => {
    try {
      const { state } = req.params;
      const properties = await storage.getPropertiesByState(state);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties by state" });
    }
  });

  // Get property by ID
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const { city, state } = req.query;
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // If city and state are provided, update location with nearby neighborhoods
      if (city && state) {
        const nearbyCities = await getNearbyNeighborhoods(city as string, state as string);
        const cityIndex = (id - 1) % nearbyCities.length; // Use property ID to determine which city to use
        const updatedProperty = {
          ...property,
          city: nearbyCities[cityIndex] || (city as string),
          state: state as string, // Use the searched state instead of property's original state
          location: `${nearbyCities[cityIndex] || (city as string)}, ${state as string}`
        };
        res.json(updatedProperty);
      } else {
        res.json(property);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  // Rota para processar pagamentos PIX
  app.post("/api/payment/pix", async (req, res) => {
    try {
      const { name, email, cpf, phone } = req.body;
      
      // Validar dados obrigatórios
      if (!name || !email || !cpf) {
        return res.status(400).json({ message: "Nome, email e CPF são obrigatórios" });
      }
      
      // Criar pagamento PIX no valor de R$ 64,90
      const paymentData = {
        name,
        email,
        cpf,
        phone,
        amount: 64.90,
        items: [{
          title: 'Cadastro Leilões Caixa',
          quantity: 1,
          unitPrice: 6490, // valor em centavos
          tangible: false
        }]
      };
      
      const payment = await paymentService.createPixPayment(paymentData);
      res.json(payment);
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error.message);
      res.status(500).json({ message: error.message || "Erro ao processar pagamento" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
