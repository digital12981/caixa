import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Function to get nearby cities using Perplexity AI
async function getNearbyCities(city: string, state: string): Promise<string[]> {
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
            content: 'Be precise and concise. Return only the city names separated by commas, no additional text.'
          },
          {
            role: 'user',
            content: `List 4 cities within 30km of ${city}, ${state}, Brazil. Include ${city} as the first city. Return only city names separated by commas.`
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
    
    // Parse cities from response and clean them
    const cities = citiesText
      .split(',')
      .map((c: string) => c.trim())
      .filter((c: string) => c.length > 0)
      .slice(0, 4); // Ensure we only get 4 cities
    return cities.length >= 1 ? cities : [city]; // Fallback to at least the original city
  } catch (error) {
    console.error('Error fetching nearby cities:', error);
    return [city]; // Fallback to original city
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all properties
  app.get("/api/properties", async (req, res) => {
    try {
      const { city, state } = req.query;
      const properties = await storage.getProperties();
      
      // If city and state are provided, update locations with nearby cities
      if (city && state) {
        const nearbyCities = await getNearbyCities(city as string, state as string);
        
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
      
      // If city and state are provided, update location with nearby cities
      if (city && state) {
        const nearbyCities = await getNearbyCities(city as string, state as string);
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
