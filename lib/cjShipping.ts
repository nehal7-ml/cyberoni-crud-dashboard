"server-only";

import { objectToSearchParams } from "./utils";

const email = process.env.CJSHIPPING_EMAIL as string;
const password = process.env.CJSHIPPING_PASSWORD as string;
const apiKey = process.env.CJSHIPPING_API_KEY as string;
const apiUrl = "https://developers.cjdropshipping.com/api2.0/v1";

let refreshToken: string | null = null;

// console.log("headers: ", authHeader);
type AccessTokenResponse = {
  code: number;
  result: boolean;
  message: string;
  data: {
    accessToken: string;
    accessTokenExpiryDate: string | Date;
    refreshToken: string;
    refreshTokenExpiryDate: string | Date;
    createDate: string;
  } | null;
  requestId: string;
};

interface Product {
  pid: string;
  productName: string[];
  productNameEn: string;
  productSku: string;
  productImage: string;
  productWeight: number;
  productType: any; // Replace 'any' with the actual type if known
  productUnit: string;
  sellPrice: number;
  categoryId: string;
  categoryName: string;
  sourceFrom: number;
  remark: string;
  createTime: Date | null;
  variants: any[];
}

interface ProductListResponse {
  code: number;
  result: boolean;
  message: string;
  data: {
    pageNum: number;
    pageSize: number;
    total: number;
    list: Product[];
  };
  requestId: string;
}

interface ProductResponse {
  code: number;
  result: boolean;
  message: string;
  data: Product;
  requestId: string;
}

interface InquiryCriteria {
  pageNum: number | 1; // Default 1
  pageSize: number | 20; // Default 20
  categoryId?: string; // Inquiry criteria
  pid?: string; // Inquiry criteria
  productSku?: string; // Inquiry criteria
  productName?: string; // Inquiry criteria
  productNameEn?: string; // Inquiry criteria
  productType?: "ORDINARY_PRODUCT" | "SUPPLIER_PRODUCT"; // Values: ORDINARY_PRODUCT SUPPLIER_PRODUCT
  countryCode?: string; // eg: CN, US
  createTimeFrom?: string; // format: yyyy-MM-dd hh:mm:ss
  createTimeTo?: string; // format: yyyy-MM-dd hh:mm:ss
  brandOpenId?: number; // Inquiry criteria
  minPrice?: number; // eg: 1.0
  maxPrice?: number; // eg: 2.5
}

interface CreateOrder {
  orderNumber: string; // A unique identifier for the order from CJ partner
  shippingCountryCode: string; // Country code
  shippingCountry: string; // Country
  shippingProvince: string; // Province
  shippingCity: string; // City
  shippingAddress: string; // Shipping address
  shippingCustomerName: string; // Shipping name
  shippingZip: string; // Zip code
  shippingPhone: string; // Phone number
  remark?: string; // Order remark
  logisticName: string; // Logistic name
  fromCountryCode: string; // Warehouse country code
  houseNumber?: string; // House number
  email?: string; // Email
  products: OrderProduct[]; // List of products
}

interface Order {
  orderId: string; // Order id
  orderNum: string; // Order name
  cjOrderId: string; // CJ order id
  shippingCountryCode: string; // Country code
  shippingProvince: string; // Province
  shippingCity: string; // City
  shippingAddress: string; // Shipping address
  shippingCustomerName: string; // Shipping name
  shippingPhone: string; // Phone number
  remark: string; // Order remark
  logisticName: string; // Logistic name
  trackNumber: string; // Track number
  orderWeight: number; // Order weight
  orderAmount: number; // Order amount (BigDecimal in (18,2))
  orderStatus: OrderStatus; // Order status
  createDate: string; // Create time
  paymentDate: string; // Payment time
  productAmount: number; // Product amount (BigDecimal in (18,2))
  postageAmount: number; // Postage amount (BigDecimal in (18,2))
}

enum OrderStatus {
  CREATED = "CREATED", // Order create, wait confirm
  IN_CART = "IN_CART", // In cart, wait confirm, API merges this state
  UNPAID = "UNPAID", // Unpaid, confirm order, CJ order number created
  UNSHIPPED = "UNSHIPPED", // Unshipped, paid, wait for sending
  SHIPPED = "SHIPPED", // Shipped, in transit, get tracking number
  DELIVERED = "DELIVERED", // Delivered, clients receiving
  CANCELLED = "CANCELLED", // Cancelled
}

interface OrderProduct {
  vid: string; // Variant id
  quantity: string; // Quantity
}

type CjResponse = {
  code: number;
  result: boolean;
  message: string;
  data: Product | Product[] | Order | Order[] | string;
  requestId: string;
};

export async function getAccessToken(email: string, password: string) {
  const res = await fetch(`${apiUrl}/authentication/getAccessToken`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const response: AccessTokenResponse = await res.json();
  console.log(response);
  refreshToken = response.data?.refreshToken as string;
  return response.data;
}

export async function getNewToken(refreshToken: string) {
  const res = await fetch(`${apiUrl}/authentication/getAccessToken`, {
    method: "POST",
    body: JSON.stringify({
      refreshToken,
    }),
  });

  const { data }: AccessTokenResponse = await res.json();
  return data;
}

export async function getProductList(query: InquiryCriteria, token: string) {
  const newQuery = objectToSearchParams(query);
  const res = await fetch(`${apiUrl}/product/list?${newQuery.toString()}`, {
    method: "GET",
    headers: {
      "CJ-Access-Token": token,
    },
  });

  const productList: ProductListResponse = await res.json();
  // console.log(productList);
  return productList.data;
}

export async function getProduct(sku: string, token: string) {
  const res = await fetch(`${apiUrl}/product/query?productSku=${sku}`, {
    method: "GET",
    headers: {
      "CJ-Access-Token": token,
    },
  });
  const response: ProductResponse = await res.json();
  // console.log(response);
  return response.data;
}

export async function createOrder(order: CreateOrder, token: string) {
  const res = await fetch(`${apiUrl}/shopping/order/createOrder`, {
    method: "POST",
    headers: {
      "CJ-Access-Token": token,
    },
    body: JSON.stringify(order),
  });
  const response: CjResponse = await res.json();
  // console.log(response);
  return response.data as string;
}

export async function getOrderbyId(orderId: string, token: string) {
  const res = await fetch(
    `${apiUrl}/shopping/order/getOrderDetail?orderId=${orderId}`,
    {
      method: "PATCH",
      headers: {
        "CJ-Access-Token": token,
      },
      body: JSON.stringify({
        orderId: orderId,
      }),
    },
  );
  const response: CjResponse = await res.json();
  // console.log(response);
  return response.data as string;
}

export async function confirmOrder(orderId: string, token: string) {
  const res = await fetch(`${apiUrl}/shopping/order/confirmOrder`, {
    method: "PATCH",
    headers: {
      "CJ-Access-Token": token,
    },
    body: JSON.stringify({
      orderId: orderId,
    }),
  });
  const response: CjResponse = await res.json();
  // console.log(response);
  return response.data as Order;
}
