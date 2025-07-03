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
        title: "Casa em Condomínio Fechado",
        location: "Alphaville, Barueri - SP",
        state: "SP",
        city: "Barueri",
        price: 450000,
        evaluation: 580000,
        type: "Casa",
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        auctionDate: "15/12/2024",
        auctionNumber: "2024001",
        description: "Excelente casa em condomínio fechado com área de lazer completa, segurança 24h, e localização privilegiada próxima a shopping centers e escolas. Imóvel em bom estado de conservação com jardim e quintal.",
        images: [
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
        ],
        available: true
      },
      {
        title: "Apartamento Vista Mar",
        location: "Copacabana, Rio de Janeiro - RJ",
        state: "RJ",
        city: "Rio de Janeiro",
        price: 320000,
        evaluation: 420000,
        type: "Apartamento",
        bedrooms: 2,
        bathrooms: 1,
        parking: 1,
        auctionDate: "18/12/2024",
        auctionNumber: "2024002",
        description: "Apartamento com vista para o mar em Copacabana, uma das praias mais famosas do mundo. Localização privilegiada próximo a transporte público, comércio e pontos turísticos. Edifício com portaria 24h.",
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
        ],
        available: true
      },
      {
        title: "Casa Térrea com Quintal",
        location: "Vila Mariana, São Paulo - SP",
        state: "SP",
        city: "São Paulo",
        price: 280000,
        evaluation: 350000,
        type: "Casa",
        bedrooms: 2,
        bathrooms: 1,
        parking: 1,
        auctionDate: "20/12/2024",
        auctionNumber: "2024003",
        description: "Casa térrea em bairro nobre de São Paulo, próxima ao metrô e com fácil acesso ao centro da cidade. Imóvel com quintal amplo, ideal para famílias. Região com excelente infraestrutura urbana.",
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
        ],
        available: true
      },
      {
        title: "Apartamento com Sacada",
        location: "Barra da Tijuca, Rio de Janeiro - RJ",
        state: "RJ",
        city: "Rio de Janeiro",
        price: 380000,
        evaluation: 480000,
        type: "Apartamento",
        bedrooms: 3,
        bathrooms: 2,
        parking: 1,
        auctionDate: "22/12/2024",
        auctionNumber: "2024004",
        description: "Apartamento moderno na Barra da Tijuca com sacada e vista panorâmica. Condomínio com área de lazer completa incluindo piscina, academia e salão de festas. Próximo a shopping centers e praias.",
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
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
    const property: Property = { ...insertProperty, id };
    this.properties.set(id, property);
    return property;
  }
}

export const storage = new MemStorage();
