export interface ListingCardProps {
  id: string;
  href: string;
  title: string;
  price: string;
  imageUrl?: string;
  location?: string;
  category?: {
    name: string;
    href?: string;
  };
  condition?: string;
  status?: string;
}
