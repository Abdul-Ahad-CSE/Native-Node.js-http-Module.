import type { IncomingMessage, ServerResponse } from "http";
import {
  createProductInDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
} from "../service/product.service";
import { parseBody } from "../utility/parseBody";

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

  // post a new product
export const createProduct = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    // 1. Wait for the data chunks to assemble
    const body = await parseBody(req);

    // 2. Send the assembled data to the database
    const newProduct = createProductInDB(body);
    console.log(newProduct);

    // 3. Respond with 201 Created
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        success: true,
        message: "Product created successfully",
        data: newProduct,
      })
    );
  } catch (error) {
    // If JSON parsing fails, return a 400 Bad Request
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        success: false,
        message: "Invalid JSON data provided",
      })
    );
  }
};