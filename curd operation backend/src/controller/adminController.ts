import type { Request, Response } from "express";
import type { Admin } from "../types/types.js";
import { con } from "../db/database.js";
import type { QueryResult } from "pg";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const signUp = async (req: Request<{}, {}, Admin>, res: Response) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hash password", hashedPassword);

  const query =
    "INSERT INTO admin (username, email, password) VALUES ($1, $2, $3) RETURNING *";

  con.query(
    query,
    [username, email, hashedPassword],
    (err: Error | null, result: QueryResult<Admin>) => {
      if (err) {
        console.error("Error executing query", err.stack);
        return res.status(500).json({
          error: "Database error",
          message: "Error",
        });
      } else {
        console.log("Admin registered successfully");
        res.status(201).json({
          success: true,
          data: result.rows[0],
          message: "Admin registered successfully",
        });
      }
    }
  );
};

export const login = async (req: Request<{}, {}, Admin>, res: Response) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM admin WHERE email = $1";

  con.query(
    query,
    [email],
    async (err: Error | null, result: QueryResult<Admin>) => {
      if (err) {
        console.error("Error executing query", err.stack);
        return res.status(500).json({
          error: "Database error",
          message: "Error",
        });
      }
      if (result.rowCount === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      } else {
        // console.log(result.rows[0])
        const matchedPassword = await bcrypt.compare(
          password,
          result.rows[0]?.password as string
        );
        // return matchedPassword;

        // console.log("matched password", matchedPassword);
        if (matchedPassword) {
          const token = jwt.sign(
            { email: result.rows[0]?.email },
            JWT_SECRET as string,
            { expiresIn: "1h" }
          );
          console.log("Login successful");
          return res.status(200).json({
            token,
            success: true,
            message: "Login successful",
          });
        } else {
          return res.status(401).json({
            success: false,
            message: "Invalid email or password",
          });
        }
      }
    }
  );
};
