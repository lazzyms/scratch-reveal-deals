export interface DiscountOffer {
  label: string;
  description: string;
  isLucky: boolean;
}

export const DISCOUNT_OFFERS: DiscountOffer[] = [
  {
    label: "Better luck next time",
    description: "Try again for a discount!",
    isLucky: false,
  },
  {
    label: "5% OFF",
    description: "on purchase of at least ₹250",
    isLucky: true,
  },
  {
    label: "10% OFF",
    description: "on purchase of at least ₹500",
    isLucky: true,
  },
  {
    label: "15% OFF",
    description: "on purchase of at least ₹1000",
    isLucky: true,
  },
  {
    label: "5% OFF",
    description: "on purchase of at least ₹250",
    isLucky: true,
  },
  {
    label: "20% OFF",
    description: "on purchase of at least ₹1200",
    isLucky: true,
  },
  {
    label: "Better luck next time",
    description: "Try again for a discount!",
    isLucky: false,
  },
  {
    label: "Better luck next time",
    description: "Try again for a discount!",
    isLucky: false,
  },
  {
    label: "Better luck next time",
    description: "Try again for a discount!",
    isLucky: false,
  },
  {
    label: "Better luck next time",
    description: "Try again for a discount!",
    isLucky: false,
  },
  {
    label: "5% OFF",
    description: "on purchase of at least ₹250",
    isLucky: true,
  },
  {
    label: "Better luck next time",
    description: "Try again for a discount!",
    isLucky: false,
  },
  {
    label: "Better luck next time",
    description: "Try again for a discount!",
    isLucky: false,
  },
  {
    label: "Better luck next time",
    description: "Try again for a discount!",
    isLucky: false,
  },
  {
    label: "5% OFF",
    description: "on purchase of at least ₹250",
    isLucky: true,
  },
];

export const getRandomOffer = () => {
  return DISCOUNT_OFFERS[Math.floor(Math.random() * DISCOUNT_OFFERS.length)];
};
