export interface Product {
  id: number;
  naam: string;
  merk: string;
  voorraad: number;
  price: number;
  details?: {
    description: string;
    picture: string;
    features: string[];
  };
  showDetails?: boolean; // For toggling the visibility
}