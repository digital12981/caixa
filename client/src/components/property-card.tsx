import { Bed, Bath, Car, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";
import { formatCurrency, calculateDiscount } from "@/lib/constants";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const discount = calculateDiscount(property.price, property.evaluation);

  return (
    <Link href={`/property/${property.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              property.type === 'Casa' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {property.type}
            </span>
            <span className="text-gray-500 text-sm">
              Leilão #{property.auctionNumber}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
          <p className="text-gray-600 mb-3">{property.location}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-caixa-blue">
              {formatCurrency(property.price)}
            </div>
            <div className="text-sm text-gray-500 line-through">
              Avaliação: {formatCurrency(property.evaluation)}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-2" />
              {property.bedrooms} quartos
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-2" />
              {property.bathrooms} banheiros
            </div>
            <div className="flex items-center">
              <Car className="w-4 h-4 mr-2" />
              {property.parking} vagas
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <Calendar className="w-4 h-4 inline mr-2" />
            Leilão: {property.auctionDate}
          </div>
        </div>
      </div>
    </Link>
  );
}
