Je laisse ca ici pour référence rapide pour la listage
PosTable = {
    number: number | null;
    id: number;
    name: string;
    area: string | null;
    capacity: number | null;
    status: string;
    currentOrderId: number | null;
}

Order = {
    id: number;
    status: string;
    tableId: number | null;
    customerName: string | null;
    total: number;
    createdAt: Date;
    updatedAt: Date;
    paymentMethod: string | null;
    priority: string | null;
    estimatedCompletionTime: Date | null;
}

OrderItem = {
    id: number;
    status: string | null;
    orderId: number | null;
    price: number | null;
    productId: number | null;
    quantity: number;
    notes: string | null;
    subtotal: number;
    category: string | null;
    preparationTime: number | null;
}

Product = {
    id: number;
    name: string;
    description: string | null;
    price: number;
    categoryId: number | null;
    isAvailable: boolean;
    imageUrl: string | null;
}

ProductCategory = {
    id: number;
    name: string;
    description: string | null;
    isActive: boolean;
}


Modifie pour que ca utilise api,


Orders: [
  {
    "id": 35,
    "tableId": 2,
    "customerName": null,
    "status": "pending",
    "total": 20000,
    "createdAt": "2025-09-10T09:40:28.085Z",
    "updatedAt": "2025-09-10T09:40:28.085Z",
    "paymentMethod": null,
    "priority": null,
    "estimatedCompletionTime": null
  }
] pos-tables-page.tsx:127:17
Tables: [
  {
    "id": 2,
    "name": "Table 2",
    "number": 2,
    "area": "Terrasse",
    "capacity": 2,
    "status": "occupied",
    "currentOrderId": 35
  },
  {
    "id": 3,
    "name": "Table 3",
    "number": 3,
    "area": "Terrasse",
    "capacity": 4,
    "status": "available",
    "currentOrderId": null
  },
  {
    "id": 4,
    "name": "Table 4",
    "number": 4,
    "area": "Int‚rieur",
    "capacity": 6,
    "status": "available",
    "currentOrderId": null
  },
  {
    "id": 5,
    "name": "Table 5",
    "number": 5,
    "area": "Int‚rieur",
    "capacity": 4,
    "status": "available",
    "currentOrderId": null
  },
  {
    "id": 6,
    "name": "Table 6",
    "number": 6,
    "area": "Int‚rieur",
    "capacity": 4,
    "status": "available",
    "currentOrderId": 102
  },
  {
    "id": 7,
    "name": "Table 7",
    "number": 7,
    "area": "Int‚rieur",
    "capacity": 8,
    "status": "available",
    "currentOrderId": null
  },
  {
    "id": 8,
    "name": "VIP Lounge 1",
    "number": 8,
    "area": "VIP",
    "capacity": 10,
    "status": "available",
    "currentOrderId": null
  },
  {
    "id": 9,
    "name": "VIP Lounge 2",
    "number": 9,
    "area": "VIP",
    "capacity": 8,
    "status": "available",
    "currentOrderId": 103
  },
  {
    "id": 10,
    "name": "Bar 1",
    "number": 10,
    "area": "Bar",
    "capacity": 2,
    "status": "available",
    "currentOrderId": null
  },
  {
    "id": 11,
    "name": "Bar 2",
    "number": 11,
    "area": "Bar",
    "capacity": 2,
    "status": "available",
    "currentOrderId": 104
  },
  {
    "id": 12,
    "name": "Bar 3",
    "number": 12,
    "area": "Bar",
    "capacity": 2,
    "status": "available",
    "currentOrderId": null
  }
] pos-tables-page.tsx:128:17
Order Items: [
  {
    "id": 35,
    "orderId": 35,
    "productId": 14,
    "quantity": 4,
    "price": 5000,
    "subtotal": 20000,
    "status": "pending",
    "category": null,
    "preparationTime": null,
    "notes": null
  }
] pos-tables-page.tsx:129:17
Products: [
  {
    "id": 14,
    "name": "Bière Rou",
    "description": "THB/Star",
    "price": 5000,
    "categoryId": 3,
    "isAvailable": true,
    "imageUrl": null
  },
  {
    "id": 9,
    "name": "Burger Club",
    "description": "Burger avec frites",
    "price": 16,
    "categoryId": 5,
    "isAvailable": false,
    "imageUrl": "burger.jpg"
  },
  {
    "id": 7,
    "name": "Coca-Cola",
    "description": "Canette 33cl",
    "price": 5,
    "categoryId": 4,
    "isAvailable": true,
    "imageUrl": "coca.jpg"
  },
  {
    "id": 3,
    "name": "Cosmopolitan",
    "description": "Vodka, triple sec, cranberry",
    "price": 13,
    "categoryId": 1,
    "isAvailable": false,
    "imageUrl": "cosmo.jpg"
  },
  {
    "id": 6,
    "name": "Heineken",
    "description": "BiŠre pression 50cl",
    "price": 7,
    "categoryId": 3,
    "isAvailable": true,
    "imageUrl": "heineken.jpg"
  },
  {
    "id": 2,
    "name": "Margarita",
    "description": "Tequila, triple sec, citron vert",
    "price": 14,
    "categoryId": 1,
    "isAvailable": true,
    "imageUrl": "margarita.jpg"
  },
  {
    "id": 1,
    "name": "Mojito",
    "description": "Rhum, menthe, citron vert",
    "price": 12,
    "categoryId": 1,
    "isAvailable": true,
    "imageUrl": "mojito.jpg"
  },
  {
    "id": 10,
    "name": "Pizza Margherita",
    "description": "Pizza traditionnelle",
    "price": 14,
    "categoryId": 5,
    "isAvailable": true,
    "imageUrl": "pizza.jpg"
  },
  {
    "id": 8,
    "name": "Plateau fromage",
    "description": "Assortiment de fromages",
    "price": 18,
    "categoryId": 6,
    "isAvailable": true,
    "imageUrl": "plateau_fromage.jpg"
  },
  {
    "id": 0,
    "name": "Tenia ",
    "description": "kakana 2m",
    "price": 500,
    "categoryId": 16,
    "isAvailable": true,
    "imageUrl": null
  },
  {
    "id": 12,
    "name": "Tenia 1",
    "description": "Tenia 100",
    "price": 500,
    "categoryId": 16,
    "isAvailable": true,
    "imageUrl": null
  },
  {
    "id": 11,
    "name": "Tenia 2",
    "description": "Tenia 3m",
    "price": 1000,
    "categoryId": 16,
    "isAvailable": true,
    "imageUrl": null
  },
  {
    "id": 13,
    "name": "Tenia 3",
    "description": "Tenia 300\n",
    "price": 1500,
    "categoryId": 16,
    "isAvailable": true,
    "imageUrl": null
  },
  {
    "id": 5,
    "name": "Vin Blanc Maison",
    "description": "Verre de vin blanc",
    "price": 8,
    "categoryId": 2,
    "isAvailable": true,
    "imageUrl": "vin_blanc.jpg"
  },
  {
    "id": 4,
    "name": "Vin Rouge Maison",
    "description": "Verre de vin rouge",
    "price": 8,
    "categoryId": 2,
    "isAvailable": true,
    "imageUrl": "vin_rouge.jpg"
  }
] pos-tables-page.tsx:130:17
Product Categories: [
  {
    "id": 3,
    "name": "BiŠres",
    "description": "BiŠres pression et bouteilles",
    "isActive": true
  },
  {
    "id": 8,
    "name": "Boissons",
    "description": "Boisson bafas",
    "isActive": true
  },
  {
    "id": 1,
    "name": "Cocktails",
    "description": "Cocktails signature et classiques",
    "isActive": true
  },
  {
    "id": 16,
    "name": "Kakana",
    "description": "Kakana lava be, kkk non ts de lava kay ka",
    "isActive": false
  },
  {
    "id": 5,
    "name": "Plats",
    "description": "Carte restaurant",
    "isActive": true
  },
  {
    "id": 6,
    "name": "Snacks",
    "description": "En-cas et petits plats",
    "isActive": true
  },
  {
    "id": 4,
    "name": "Softs",
    "description": "Boissons non-alcoolis‚es",
    "isActive": true
  },
  {
    "id": 2,
    "name": "Vins",
    "description": "Vins au verre et bouteilles",
    "isActive": true
  }
]


\\POS :

POSDevices :  [
  {
    "id": 1,
    "name": "POS Bar",
    "location": "Mobile",
    "status": "active",
    "lastActive": null,
    "sales": 0
  },
  {
    "id": 2,
    "name": "Terminal Mobile 1",
    "location": "Mobile",
    "status": "active",
    "lastActive": null,
    "sales": 0
  },
  {
    "id": 3,
    "name": "Terminal Mobile 2",
    "location": "Mobile",
    "status": "inactive",
    "lastActive": null,
    "sales": 0
  }
] pos-management-page.tsx:123:15
Employer :  [
  {
    "id": 3,
    "name": "Rafael",
    "pin": "1234",
    "role": "admin"
  },
  {
    "id": 2,
    "name": "Siory",
    "pin": "5678",
    "role": "staff"
  }
]