import { users, properties, type User, type InsertUser, type Property, type InsertProperty } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProperties(): Promise<Property[]>;
  getPropertiesByState(state: string): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private currentUserId: number;
  private currentPropertyId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    
    // Initialize with sample properties
    this.initializeProperties();
  }

  private initializeProperties() {
    const sampleProperties: InsertProperty[] = [
      {
        title: "Casa Residencial de 3 Quartos - 200m²",
        location: "Rua das Flores, 123 - Centro",
        state: "SP",
        city: "São Paulo",
        price: 280000,
        evaluation: 320000,
        type: "Casa",
        bedrooms: 3,
        bathrooms: 4,
        parking: 2,
        auctionDate: "15/02/2025",
        auctionNumber: "LLO001/2025",
        description: "Excelente casa residencial com área construída de 200m². Imóvel com 3 quartos sendo 1 suíte, 4 banheiros completos, sala ampla, cozinha planejada, área de serviço e garagem para 2 carros. Localizada em bairro nobre, próxima a escolas, supermercados e transporte público.",
        images: [
          "https://img.olx.com.br/images/97/976592778481392.webp",
          "https://img.olx.com.br/images/97/979530653030789.webp",
          "https://img.olx.com.br/images/97/978561292381133.webp"
        ],
        available: true
      },
      {
        title: "Casa de 4 Quartos - 173m²",
        location: "Avenida Central, 456 - Jardim América",
        state: "SP",
        city: "São Paulo",
        price: 450000,
        evaluation: 520000,
        type: "Casa",
        bedrooms: 4,
        bathrooms: 2,
        parking: 2,
        auctionDate: "20/02/2025",
        auctionNumber: "LLO002/2025",
        description: "Ampla casa familiar com área construída de 173m². Propriedade com 4 quartos sendo 2 suítes, 2 banheiros, sala de estar, sala de jantar, cozinha americana moderna, área gourmet, quintal espaçoso e garagem coberta para 2 carros.",
        images: [
          "https://img.olx.com.br/images/23/233510424467668.webp",
          "https://img.olx.com.br/images/24/241579662489270.webp",
          "https://img.olx.com.br/images/25/254535421386467.webp"
        ],
        available: true
      },
      {
        title: "Casa Térrea - 190m²",
        location: "Rua do Sol, 789 - Vila Nova",
        state: "SP",
        city: "São Paulo",
        price: 380000,
        evaluation: 450000,
        type: "Casa",
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        auctionDate: "25/02/2025",
        auctionNumber: "LLO003/2025",
        description: "Bela casa térrea com área construída de 190m². 3 quartos sendo 1 suíte master, 2 banheiros, sala ampla com pé-direito alto, cozinha planejada, área gourmet com churrasqueira e jardim paisagístico.",
        images: [
          "https://img.olx.com.br/images/48/483483108848770.webp",
          "https://img.olx.com.br/images/74/746410109574106.webp",
          "https://img.olx.com.br/images/74/748473340204660.webp"
        ],
        available: true
      },
      {
        title: "Apartamento de 2 Quartos - 60m²",
        location: "Edifício Central, Apto 801 - Centro",
        state: "SP",
        city: "São Paulo",
        price: 180000,
        evaluation: 220000,
        type: "Apartamento",
        bedrooms: 2,
        bathrooms: 2,
        parking: 1,
        auctionDate: "18/02/2025",
        auctionNumber: "LLO004/2025",
        description: "Moderno apartamento no coração da cidade com área útil de 60m². 2 quartos com armários planejados, 2 banheiros completos, sala integrada com varanda, cozinha americana equipada, área de serviço e 1 vaga de garagem.",
        images: [
          "https://img.olx.com.br/images/97/974579631062270.webp",
          "https://img.olx.com.br/images/97/972552275953944.webp",
          "https://img.olx.com.br/images/97/971562397621873.webp"
        ],
        available: true
      }
    ];

    sampleProperties.forEach(property => {
      this.createProperty(property);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(property => property.available);
  }

  async getPropertiesByState(state: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      property => property.state === state && property.available
    );
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const property: Property = { 
      ...insertProperty, 
      id,
      available: true
    };
    this.properties.set(id, property);
    return property;
  }
}

export const storage = new MemStorage();
