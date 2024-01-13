const typeDefs = `
type Admin {
    id: ID!
    email: String
    password: String
    name: String
    phoneNumber: String
    levelClearance: String
    removed: Boolean
    createdAt: String
}


type Product {
    id: ID!
    name: String  
    images: [String]
    variants: [Variant]
    additionalInformation: [Additional]  
    createdAt: String
}

type Additional {
    label: String
    value: String
}

type Variant {
    quantity: Int
    price: Int
    label: String
}

type Order {
    status: String
    id: ID
    items: [OrderItem]
    customer: Customer
    delivery: Delivery
    payment: Payment
    createdAt: String  
}

type OrderItem {
    product: Product
    variant: String
    salePrice: Int
    quantity: Int
}

type Customer {
    name: String
    phoneNumber: String
}

type Delivery {
    toBeDelivered: Boolean
    deliveryStatus: String
    deliveryTimestamp: String
    location: String  
    amount: Int
}

type Payment {
    mode: String
    code: String
}

type StatPage {
    totalSales: Int
    totalOrders: Int
    totalProducts: Int
    chartData: [ChartData]
    fastestMoving: [MovingProduct]
    slowestMoving: [MovingProduct]
}

type ChartData {
    label: String
    value: Int
}

type MovingProduct{
    product: Product
    ordersPerMonth: Int
}

type Query { 
    getProducts: [Product]
    getAdmins: [Admin]
    getProduct(id: ID): Product    
    getOrders: [Order]     
    getAdmin(
        email: String
        id: ID
        password: String
    ): Admin
 
}

type Mutation {
    addProduct(
        name: String
        variants: String
        additionalInformation: String  
        images: [String]      
    ) : Product
    updateProduct(
        id:ID!
        name: String
        variants: String
        additionalInformation: String  
    ): Product
    createAdmin(
        email: String
        name: String
        levelClearance: String
    ) : Admin    
    addToCart(
        admin: ID
        product: ID
        variant: String
    ) : Order
    updateCart(
        id: ID
        removal: Boolean
        quantity: Int
        admin: ID
    ): Order  
    checkout(
        id: ID
        customer: String
        payment: String
        delivery: String
    ): Order
    deliver(       
        id: ID
    ): Order
    updateAdmin(
        id: ID
        name: String
        phoneNumber: String
        email: String
        password: String
        removed: Boolean
    ): Admin
}

`;

export default typeDefs;
