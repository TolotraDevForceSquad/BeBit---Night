[employees] = [
  id : serial (primaryKey),
  name : text (notNull),
  role : text (notNull),
  pin : text (notNull),
  status : boolean (notNull),
  deviceId : integer (ref: posDevices.id),
  imageUrl: text
]

[posDevices] = [
  id : serial (primaryKey),
  name : text (notNull),
  location : text,
  status : boolean (notNull),
  lastActive : text,
  sales : integer,
  imageUrl: text

]

[productCategories] = [
  id : serial (primaryKey),
  name : text (notNull),
  description : text,
  isActive : boolean (notNull, default: true),
  imageUrl: text
]

[products] = [
  id : serial (primaryKey),
  name : text (notNull),
  description : text,
  price : integer (notNull),
  categoryId : integer (ref: productCategories.id),
  isAvailable : boolean (notNull, default: true),
  imageUrl : text
]

[posTables] = [
  id : serial (primaryKey),
  name : text (notNull),
  number : integer,
  area : text,
  capacity : integer,
  status : text (notNull),
  currentOrderId : integer (ref: orders.id),
  imageUrl: text
  
]

[orders] = [
  id : serial (primaryKey),
  tableId : integer (ref: posTables.id),
  customerName : text,
  status : text (notNull),
  total : integer (notNull),
  createdAt : timestamp (defaultNow, notNull),
  updatedAt : timestamp (defaultNow, notNull),
  paymentMethod : text,
  priority : text,
  estimatedCompletionTime : timestamp
]

[orderItems] = [
  id : serial (primaryKey),
  orderId : integer (ref: orders.id),
  productId : integer (ref: products.id),
  quantity : integer (notNull),
  price : integer,
  notes : text,
  subtotal : integer (notNull),
  status : text,
  category : text,
  preparationTime : integer
]

[posHistory] = [
  id : serial (primaryKey),
  type : text (notNull),
  description : text,
  userId : integer (ref: employees.id),
  userName : text,
  userRole : text,
  timestamp : timestamp (defaultNow, notNull),
  amount : integer,
  orderId : integer (ref: orders.id),
  tableId : integer (ref: posTables.id),
  tableName : text,
  details : text,
  status : text
]

[paymentMethods] = [
  id : serial (primaryKey),
  name : text (notNull),
  value : integer (notNull)
]

Relations (POS-specific):
- employees -> posDevices (one-to-one via deviceId -> id)
- employees -> posHistory (one-to-many via id -> userId)
- posDevices -> employees (one-to-many via id -> deviceId)
- productCategories -> products (one-to-many via id -> categoryId)
- products -> productCategories (many-to-one via categoryId -> id)
- products -> orderItems (one-to-many via id -> productId)
- posTables -> orders (one-to-many via id -> tableId)
- posTables -> posHistory (one-to-many via id -> tableId)
- orders -> posTables (many-to-one via tableId -> id)
- orders -> orderItems (one-to-many via id -> orderId)
- orders -> posHistory (one-to-many via id -> orderId)
- orderItems -> orders (many-to-one via orderId -> id)
- orderItems -> products (many-to-one via productId -> id)
- posHistory -> employees (many-to-one via userId -> id)
- posHistory -> orders (many-to-one via orderId -> id)
- posHistory -> posTables (many-to-one via tableId -> id)
- paymentMethods (no relations defined)