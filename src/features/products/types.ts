export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;     // ej: "Lácteos" | "Bebidas" | ...
  offer?: boolean;      // para la pestaña "Ofertas"
};
