import { Bed, Bath, Car } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";
import { formatCurrency, formatInstallment } from "@/lib/constants";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/property/${property.id}`}>
      <div className="bg-white border border-gray-200 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:transform hover:scale-[1.02] overflow-hidden" style={{borderRadius: '2px'}}>
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

        </div>
        
        <div className="p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold mb-2 text-caixa-text leading-tight">
            {property.title}
          </h3>
          <p className="text-gray-600 mb-3 md:mb-4 text-sm flex items-center">
            <span className="w-2 h-2 bg-caixa-orange rounded-full mr-2"></span>
            {property.location}
          </p>
          
          <div className="mb-3 md:mb-4">
            <div className="text-xl md:text-2xl font-bold text-caixa-blue mb-1">
              {formatInstallment(property.price)} /mês
            </div>
            <div className="text-xs md:text-sm text-gray-600">
              120x • <span className="font-bold text-green-600">Valor total: {formatCurrency(property.price)}</span>
            </div>
            <div className="text-xs md:text-sm text-gray-500">
              Avaliação: {formatCurrency(property.evaluation)}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 md:gap-3 text-xs md:text-sm text-gray-600 mb-3 md:mb-4 py-2 md:py-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center">
              <Bed className="w-3 h-3 md:w-4 md:h-4 mr-1 text-caixa-blue" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center justify-center border-x border-gray-200">
              <Bath className="w-3 h-3 md:w-4 md:h-4 mr-1 text-caixa-blue" />
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center justify-center">
              <Car className="w-3 h-3 md:w-4 md:h-4 mr-1 text-caixa-blue" />
              <span className="font-medium">{property.parking}</span>
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <button className="bg-caixa-orange text-white px-6 py-3 text-sm font-semibold w-full hover:bg-orange-600 transition-colors duration-200" style={{borderRadius: '2px'}}>
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
