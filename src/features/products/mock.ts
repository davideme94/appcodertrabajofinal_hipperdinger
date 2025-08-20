import { Product } from "./types";

export const CATEGORIES = [
  "Lácteos",
  "Bebidas",
  "Almacén",
  "Kiosko",
  "Frutas y Verduras",
  "Ofertas",
] as const;

export const PRODUCTS: Product[] = [
  {
    id: "leche",
    title: "Leche Entera",
    price: 1500,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200",
    description: "Leche entera de tambo local, 1L.",
    category: "Lácteos",
  },
  {
    id: "dulce",
    title: "Dulce de Leche",
    price: 3200,
    image: "https://images.unsplash.com/photo-1604908812774-964e811ac0a5?q=80&w=1200",
    description: "Dulce de leche clásico, pote de 400g.",
    category: "Lácteos",
    offer: true,
  },
  {
    id: "yerba",
    title: "Yerba Mate",
    price: 3800,
    image: "https://images.unsplash.com/photo-1556679343-c7306c121c7f?q=80&w=1200",
    description: "Yerba suave, seleccionada, paquete de 1kg.",
    category: "Bebidas",
  },
  {
    id: "pan-casero",
    title: "Pan casero",
    price: 1200,
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1200",
    description: "Pan recién horneado, crocante por fuera y tierno por dentro.",
    category: "Almacén",
  },
  {
    id: "medialunas",
    title: "Medialunas",
    price: 1800,
    image: "https://images.unsplash.com/photo-1568051243858-02bd2c1761a5?q=80&w=1200",
    description: "Docena de medialunas de manteca, glaseadas.",
    category: "Kiosko",
  },
  {
    id: "frutillas",
    title: "Frutillas 1kg",
    price: 4200,
    image: "https://images.unsplash.com/photo-1437750769465-301382cdf094?q=80&w=1200",
    description: "Frutillas frescas de estación, por kilo.",
    category: "Frutas y Verduras",
    offer: true,
  },
  {
    id: "alfajores",
    title: "Alfajores",
    price: 2500,
    image: "https://images.unsplash.com/photo-1612785089604-6f7c0c9e81c3?q=80&w=1200",
    description: "Alfajores artesanales rellenos de dulce de leche.",
    category: "Kiosko",
  },
];
