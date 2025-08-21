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
    title: "Leche Multidefensa 3% La Serenisima 1 Lt.",
    price: 3000,
    image: "https://ardiaprod.vtexassets.com/arquivos/ids/343627-500-auto?v=638732576485070000&width=500&height=auto&aspect=true",
    description: "Leche entera de tambo local, 1L.",
    category: "Lácteos",
  },
  {
    id: "dulce",
    title: "Dulce de Leche Clásico La Serenísima con calcio 400 Gr.",
    price: 3200,
    image: "https://ardiaprod.vtexassets.com/arquivos/ids/352294/Dulce-de-Leche-Clasico-La-Serenisima-con-calcio-400-Gr-_1.jpg?v=638851462802500000",
    description: "Dulce de Leche Clásico La Serenísima con calcio 400 Gr.",
    category: "Lácteos",
    offer: true,
  },
  {
    id: "yerba",
    title: "Yerba Mate Chamigo 500 Gr.",
    price: 3800,
    image: "https://ardiaprod.vtexassets.com/arquivos/ids/309240-500-auto?v=638599354383770000&width=500&height=auto&aspect=true",
    description: "Yerba Mate Chamigo 500 Gr.",
    category: "Almacén",
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
    image: "https://resizer.glanacion.com/resizer/v2/medialunas-faciles-de-M2NJ4M5YCZFHBGYG3YH7VCZTGE.jpg?auth=f3ee3813e49b9dadb97c8dc3890ce71677f3719c12a7be55a531b3555f64a7a8&width=1280&height=854&quality=70&smart=true",
    description: "Docena de medialunas de manteca, glaseadas.",
    category: "Almacén",
  },
  {
    id: "frutillas",
    title: "Frutillas 1kg",
    price: 4200,
    image: "https://www.vitamina.cl/wp-content/uploads/2018/11/frutilla-receta.jpg",
    description: "Frutillas frescas de estación, por kilo.",
    category: "Frutas y Verduras",
    offer: true,
  },
  {
    id: "alfajores",
    title: "Alfajor Triple Milka Dulce De Leche 70 Gr.",
    price: 2500,
    image: "https://ardiaprod.vtexassets.com/arquivos/ids/307961/Alfajor-Triple-Milka-Dulce-De-Leche-70-Gr-_1.jpg?v=638888002357230000",
    description: "Alfajor Triple Milka Dulce De Leche 70 Gr.",
    category: "Kiosko",
  },
  {
    id: "coca",
    title: "Gaseosa Coca-Cola Sabor Original 2.25 Lt.",
    price: 3000,
    image: "https://ardiaprod.vtexassets.com/arquivos/ids/307377/Gaseosa-CocaCola-Sabor-Original-2-25-Lt-_2.jpg?v=638599329588070000",
    description: "Gaseosa Coca-Cola Sabor Original 2.25 Lt.",
    category: "Bebidas",
  },
];
