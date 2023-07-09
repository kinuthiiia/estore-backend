const typeDefs = `
type Admin {
    id: ID!
    email: String
    password: String
    name: String
    phoneNumber: String
    levelClearance: String
    createdAt: String
}

type User {
    id: ID!
    name: String
    email: String    
    image: String
    emailVerified: Boolean
    phoneNumber: String
    cart: [CartItem]
    saved: [Product]
    addresses: [Address]
}

type CartItem {
    id: ID
    product: Product
    quantity: Int
    variant: String
}

type Address {
    id: ID
    label: String
    lat: Float
    lng: Float
    default: Boolean
}


type Product {
    id: ID!
    name: String
    description: String
    category: String
    images: [String]
    variants: [Variant]
    additionalInformation: [Additional]
    reviews: [Review]
    createdAt: String
}

type Additional {
    label: String
    value: String
}

type Variant {
    thumbnail: String
    price: Float
    label: String
}

type Order {
    items: [OrderItem]
    customer: User
    deliveryLocation: DeliveryLocation
    payment: Payment
    deliveryTimestamp: String
    dispatchTimestamp: String
    pickUpTimestamp: String
}

type OrderItem {
    product: Product
    salePrice: Int
    quantity: Int
}

type DeliveryLocation {
    lat: Float
    lng: Float
}

type Payment {
    code: String
    timestamp: String
    name: String
    amount: Int
}

type Review {
    name: String
    rating: Float
    timestamp: String
    message: String
}

type Section {
    id: ID!
    instagram: String
    twitter: String
    facebook: String
    phoneNumber: String
    sliders: [String]
    termsOfService: String
    shipping: String
    privacyPolicy: String
    returnAndExchanges: String
}


type Query { 
    getProducts: [Product]
    getAdmins: [Admin]
    getProduct(id: ID): Product
    getUser(email: String): User    
}

type Mutation {
    addProduct(
        name: String
        description: String
        category: String,
        variants: String
        additionalInformation: String  
        images: [String]      
    ) : Product
    createAdmin(
        email: String
        name: String
        levelClearance: String
    ) : Admin
    addToCart(
        customer: String
        product: ID
        variant: String
    ) : User
    updateCart(
        id: ID
        removal: Boolean
        quantity: Int
        email: String
    ): User
    saveUnsave(
        product: ID
        customer: String
    ) : User
    updateProfile(
        email: String
        name: String
        phoneNumber: String
    ) : User
    addAddress(
        label: String
        lat: Float
        lng: Float
        email: String
    ) : User
    mutateAddress(
        action: String
        id: ID
        email: String
        default: Boolean
    ) : User
}

`;

export default typeDefs;
