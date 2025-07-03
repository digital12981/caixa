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
      <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:transform hover:scale-[1.02] overflow-hidden">
        <div className="relative">
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-56 object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-lg ${
              property.type === 'Casa' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-blue-500 text-white'
            }`}>
              {property.type}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="bg-white bg-opacity-95 px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-lg">
              Leilão #{property.auctionNumber}
            </span>
          </div>
          {discount > 0 && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {discount}% OFF
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-caixa-text leading-tight">
            {property.title}
          </h3>
          <p className="text-gray-600 mb-4 text-sm flex items-center">
            <span className="w-2 h-2 bg-caixa-orange rounded-full mr-2"></span>
            {property.location}
          </p>
          
          <div className="mb-4">
            <div className="text-2xl font-bold text-caixa-blue mb-1">
              {formatCurrency(property.price)}
            </div>
            <div className="text-sm text-gray-500">
              <span className="line-through">Avaliação: {formatCurrency(property.evaluation)}</span>
              {discount > 0 && (
                <span className="ml-2 text-green-600 font-semibold">
                  Economia de {formatCurrency(property.evaluation - property.price)}
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-sm text-gray-600 mb-4 py-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center">
              <Bed className="w-4 h-4 mr-1 text-caixa-blue" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center justify-center border-x border-gray-200">
              <Bath className="w-4 h-4 mr-1 text-caixa-blue" />
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center justify-center">
              <Car className="w-4 h-4 mr-1 text-caixa-blue" />
              <span className="font-medium">{property.parking}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-caixa-orange" />
              <span>{property.auctionDate}</span>
            </div>
            <span className="bg-caixa-orange text-white px-3 py-1 rounded-full text-xs font-semibold">
              Ver Detalhes
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
