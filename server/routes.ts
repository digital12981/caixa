import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Function to get nearby neighborhoods using Perplexity AI
async function getNearbyNeighborhoods(city: string, state: string): Promise<string[]> {
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
      .map((n: string) => n.trim())
      .filter((n: string) => n.length > 0 && n.length < 50) // Filter out explanatory text
      .slice(0, 4); // Ensure we only get 4 neighborhoods
    return neighborhoods.length >= 1 ? neighborhoods : [city]; // Fallback to at least the original city
  } catch (error) {
    console.error('Error fetching nearby neighborhoods:', error);
    return [city]; // Fallback to original city
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all properties
  app.get("/api/properties", async (req, res) => {
    try {
      const { city, state } = req.query;
      const properties = await storage.getProperties();
      
      // If city and state are provided, update locations with nearby neighborhoods
      if (city && state) {
        const nearbyCities = await getNearbyNeighborhoods(city as string, state as string);
        
        // Update each property with a nearby city
        const updatedProperties = properties.map((property, index) => ({
          ...property,
          city: nearbyCities[index % nearbyCities.length] || (city as string),
          location: `${nearbyCities[index % nearbyCities.length] || (city as string)}, ${state}`
        }));
        
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
          location: `${nearbyCities[cityIndex] || (city as string)}, ${state}`
        };
        res.json(updatedProperty);
      } else {
        res.json(property);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
