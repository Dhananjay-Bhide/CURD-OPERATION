// const { con } = require("../db/database");

import type { QueryResult } from "pg";
import { con } from "../db/database.js";

import type { Request, Response } from "express";

export const getUsers = (req: Request, res: Response) => {
  let { sort_column, sort_order, currentPage, usersPerPage, search } =
    req.query; //variable for sorting and pagination

  // Allowed sort columns to avoid SQL injection
  const allowedSortColumns = [
    "firstname",
    "dob",
  ];
  const allowedSortOrders = ["asc", "desc"];

  // Defaults
  sort_column = allowedSortColumns.includes(sort_column as string)
    ? sort_column as string
    : "firstname";
  sort_order = typeof sort_order == "string" && allowedSortOrders.includes(sort_order?.toLowerCase())
    ? sort_order
    : "asc";

  const numericCurrentPage = Number((currentPage as string) || 1);
  const numericUsersPerPage = Number(usersPerPage as string) || 5;

  const offset = (numericCurrentPage - 1) * numericUsersPerPage;

  const pagesQuery = search
    ? `SELECT COUNT(*) FROM users WHERE firstname ILIKE $1`
    : `SELECT COUNT(*) FROM users`;
  // let query;

  const query = search
    ? `SELECT id, firstname, lastname, TO_CHAR(dob, 'YYYY-MM-DD') AS dob, mobile, address FROM users WHERE firstname ILIKE '%${search}%' ORDER BY ${sort_column} ${sort_order} LIMIT ${numericUsersPerPage} OFFSET ${offset} `
    : `SELECT id, firstname, lastname, TO_CHAR(dob, 'YYYY-MM-DD') AS dob, mobile, address FROM users ORDER BY ${sort_column} ${sort_order} LIMIT ${numericUsersPerPage} OFFSET ${offset}`;

if(search){
  con.query(pagesQuery, [`%${search}%`], (err: Error | null, countResult: { rows: { count: string }[] }) => {
    if (err) {
      console.log("pagesquery error");
      console.error("Error executing count query", err.stack);
      return res.status(500).json({ error: "Database error" });
    }
    const totalCount = countResult?.rows?.[0]?.count ? parseInt(countResult.rows[0].count) : 0;
    const totalPages = Math.ceil(totalCount / numericUsersPerPage);
    
    con.query(query, (err: Error | null, result: QueryResult<any>) => {
      if (err) {
        console.log("query error");
        console.error("Error executing query", err.stack);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({
        success: true,
        message: "User created successfully",
        data: {
          users: result.rows,
          currentPage: Number(currentPage),
          totalPages,
          totalCount,
        },
      });
    });
  });
}
  else{
  con.query(pagesQuery, (err: Error | null, countResult: { rows: { count: string }[] }) => {
    if (err) {
      console.log("pagesquery error");
      console.error("Error executing count query", err.stack);
      return res.status(500).json({ error: "Database error" });
    }
    const totalCount = countResult?.rows?.[0]?.count ? parseInt(countResult.rows[0].count) : 0;
    const totalPages = Math.ceil(totalCount / numericUsersPerPage);
    
    con.query(query, (err: Error | null, result: QueryResult<any>) => {
      if (err) {
        console.log("query error");
        console.error("Error executing query", err.stack);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({
        success: true,
        message: "User created successfully",
        data: {
          users: result.rows,
          currentPage: Number(currentPage),
          totalPages,
          totalCount,
        },
      });
    });
  });
}
};

// export const getUserById = (req, res) => {
//     const firstname = req.params.firstname;
//     const query = "SELECT id, firstname, lastname, TO_CHAR(dob, 'YYYY-MM-DD') AS dob, mobile, address FROM users WHERE firstname ILIKE $1";
//     con.query(query, [firstname], (err, result) => {
//         if (err) {
//         console.error("Error executing query", err.stack);
//         return res.status(500).json(
//           { error: "Database error",
//             message: "User not created"
//           });
//       }
//       res.status(200).json({
//         success: true,
//         message: "User created successfully",
//         data: result.rows
//       });
//       // console.log(result)
//     })
// }

export const getUserById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id || "0");
  const query =
    "SELECT id, firstname, lastname, TO_CHAR(dob, 'YYYY-MM-DD') AS dob, mobile, address FROM users WHERE id = $1";
  con.query(query, [id], (err: Error | null, result: QueryResult<any>) => {
    if (err) {
      console.error("Error executing query", err.stack);
      return res
        .status(500)
        .json({ error: "Database error", message: "User not found" });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User found successfully",
      data: result.rows,
    });
  });
};

export const addUser = (req: Request, res: Response) => {
  const user = req.body;
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format
  if (user.dob >= today) {
    return res
      .status(400)
      .json({ error: "Date of birth cannot be greater than today" });
  }
  const query =
    "INSERT INTO users (firstname, lastname, dob, mobile, address) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  con.query(
    query,
    [user.firstname, user.lastname, user.dob, user.mobile, user.address],
    (err: Error, result: QueryResult<any>) => {
      if (err) {
        console.error("Error executing query", err.stack);
        return res.status(500).json({
          error: "Database error",
          message: "Error",
        });
      } else {
        console.log("User added successfully");
        res.status(201).json({
          success: true,
          data: result,
          message: "User added successfully",
        });
      }
    }
  );
};

export const updateUser = (req: Request, res: Response) => {
  const id = parseInt(req.params.id || "0");
  // const name = req.body.name;

  // console.log('Updating user with firstname:', oldfirstname);

  const user = [
    req.body.firstname,
    req.body.lastname,
    req.body.dob,
    req.body.mobile,
    req.body.address,
    id,
  ];
  // console.log(user);

  const query =
    "UPDATE users SET firstname = $1, lastname = $2, dob = $3, mobile = $4, address = $5 WHERE id = $6 RETURNING *";

  con.query(query, user, (err: Error | null, result: QueryResult<any>) => {
    if (err) {
      console.error("Error executing query", err.stack);
      return res.status(500).json({ error: "Database error" });
    } else {
      console.log("Query executed successfully", result);
    }
    if (result.rowCount === 0) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  });
};

export const deleteUser = (req: Request, res: Response) => {
  const id = req.params.id;

  const query = "DELETE FROM users WHERE id = $1 RETURNING *";

  con.query(query, [id], (err: Error | null, result: QueryResult<any>) => {
    if (err) {
      console.error("Error executing query", err.stack);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.rowCount === 0) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", user: result.rows[0] });
  });
};
