import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { getProduct } from "@/lib/cjShipping";

let accessToken: string = `eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxNDI5NiIsInR5cGUiOiJBQ0NFU1NfVE9LRU4iLCJzdWIiOiJicUxvYnFRMGxtTm55UXB4UFdMWnl0cjQ4N0FoY0t3STNSK0cwbE5mZkVBYVlGaFZIT3l5OGlGM3REL0RlbGNkU2FnajAyMnR3WEZZczBYWWdMRnExWlYydGpFWWVUaHVFQm1DQ2dmQXF3QU5aUHNrODF4TVlaRm9LTG9GblF5WCtqcHV4NFVadS9oRkpRbEZTSjdOOTNZaForbitXSjA2Smo1L2JpVmFlUmo1VnIwTmlNMVk5Sko4MzY3QXJTV3poMk8wM1g1RHI5Q1ZnMHhJK2lWRWRhTlRWQzhwbXBmbjV6SGxQcnpkWmROaUFDUnJtZUNxUjI0dGhqVFQvQUJRRUZLQUdNU0ZDSU9OTlJyai84WlZjWVhhQjBNVXAvQ041ckRTKzkrOXJHTT0ifQ.tNwnjEuG00bd4LgQUCsF2griXufvxuGxMhbOUj3ByOE`;

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ GET: get });

async function get(req: NextRequest, { params }: { params: { sku: string } }) {
  const productId = params.sku as string;
  const product = await getProduct(productId, accessToken);
  return NextResponse.json({ data: product });
}
