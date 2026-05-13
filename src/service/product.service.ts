import fs from "node:fs";
import path from "node:path";

const getDBData = () => {
  // 1. Create an absolute path to the file
  const filePath = path.join(process.cwd(), "src", "database", "db.json");
  // 2. Read the file content as a string
  const fileData = fs.readFileSync(filePath, "utf-8");
  // 3. Parse the string into a JavaScript object
  return JSON.parse(fileData);
};

// Function for localhost:5000/products
export const getAllProductsFromDB = () => {
  const jsonData = getDBData();
  return jsonData.products;
};

// Function for localhost:5000/products/:id
export const getSingleProductFromDB = (id: number) => {
  const jsonData = getDBData(); // Calls the same helper above
  return jsonData.products.find((p: any) => p.id === id);
};

