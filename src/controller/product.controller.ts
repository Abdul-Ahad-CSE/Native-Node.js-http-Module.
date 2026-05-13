import type { ServerResponse } from "http";
import {
  getAllProductsFromDB,
  getSingleProductFromDB,
} from "../service/product.service";

// 1. Get All Products
export const getProducts = (res: ServerResponse) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  const products = getAllProductsFromDB();

  return res.end(
    JSON.stringify({
      success: true,
      data: products,
    }),
  );
};
// 2. Get Single Product by ID
export const getProductById = (res: ServerResponse, id: string) => {
  // Convert the string ID from the URL to a number for the service
  const product = getSingleProductFromDB(Number(id));

  res.setHeader("Content-Type", "application/json");

  // If the product doesn't exist, send a 404
  if (!product) {
    res.statusCode = 404;
    return res.end(
      JSON.stringify({
        success: false,
        message: `Product with ID ${id} not found`,
      }),
    );
  }

  // If it does exist, send a 200
  res.statusCode = 200;
  return res.end(
    JSON.stringify({
      success: true,
      data: product,
    }),
  );
};
