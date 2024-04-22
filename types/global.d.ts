export type TableType =
  | "blogs"
  | "services"
  | "casestudies"
  | "users"
  | "products"
  | "prompts"
  | "events"
  | "discounts"
  | "referrals";
export type OrderTableBy =
  | "updatedAt"
  | "title"
  | "name"
  | "email"
  | "prefix"
  | "click"
  | "expires"
  | "value"
  | "profitMargin"
  | "timesUsed"
  | "price"
  | "date"
  | "publishDate"
  | "inventory";
export type OrderTable = "desc" | "asc";
