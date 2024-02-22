import pg from "pg";
import { v4 as uuidv4 } from "uuid";
import { Product, User } from "./types";
import { response } from "express";

export const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_the_store"
);

export const createTables = async () => {
  const SQL = /*sql*/ `
        DROP TABLE IF EXISTS favorites;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS users;

        CREATE TABLE users(
            id UUID PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) UNIQUE NOT NULL
        );

        CREATE TABLE products(
            id UUID PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL
        );
        
        CREATE TABLE favorites(
            id UUID PRIMARY KEY,
            product_id UUID REFERENCES products(id) NOT NULL,
            user_id UUID REFERENCES users(id) NOT NULL,
            CONSTRAINT unique_user_product UNIQUE(product_id, user_id)
        );
    `;
  await client.query(SQL);
};

export const createUser = async ({
  username,
  password,
}: User): Promise<User> => {
  const SQL = /*sql*/ `
    INSERT INTO users(id, username, password)
    VALUES($1, $2, $3)
    RETURNING id, username;
  `;
  const response = await client.query(SQL, [uuidv4(), username, password]);
  return response.rows[0] as User;
};

export const createProduct = async ({ name }: Product): Promise<Product> => {
  const SQL = /*sql*/ `
    INSERT INTO products(id, name)
    VALUES($1, $2)
    RETURNING *;
  `;
  const response = await client.query(SQL, [uuidv4(), name]);
  return response.rows[0] as Product;
};

export const fetchUsers = async (): Promise<User[]> => {
  const SQL = /*sql*/ `
    SELECT id, username FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows as User[];
};

export const fetchProducts = async (): Promise<Product[]> => {
  const SQL = /*sql*/ `
    SELECT * FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows as Product[];
};
