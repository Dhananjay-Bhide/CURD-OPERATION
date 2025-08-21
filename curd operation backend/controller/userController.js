// const { con } = require("../db/database");

import { con } from "../db/database.js";

export const getUsers = (req, res) => {
  const {sort_column, sort_order} = req.query;
  // console.log(sort_column, sort_order);

  if(sort_column&&sort_order){
    const query = `SELECT id, firstname, lastname, TO_CHAR(dob, 'YYYY-MM-DD') AS dob, mobile, address FROM users ORDER BY ${sort_column} ${sort_order}`
    con.query(query, (err, result) => {
      if (err) {
      console.error("Error executing query", err.stack);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(result.rows);
    })
  } else{
  const query = "SELECT id, firstname, lastname, TO_CHAR(dob, 'YYYY-MM-DD') AS dob, mobile, address FROM users";
  // console.log("here")
  con.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err.stack);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(result.rows);
  });
}
}

// export const searchUsers = (req, res) => {
//   const searchTerm = req.params.searchTerm;
//   const query = "SELECT id, firstname, lastname, TO_CHAR(dob, 'YYYY-MM-DD') AS dob, mobile, address FROM users WHERE firstname=$1";
// con.query
// }

export const getUserById = (req, res) => {
    const firstname = req.params.firstname;
    const query = "SELECT id, firstname, lastname, TO_CHAR(dob, 'YYYY-MM-DD') AS dob, mobile, address FROM users WHERE firstname ILIKE $1";
    con.query(query, [firstname], (err, result) => {
        if (err) {
        console.error("Error executing query", err.stack);
        return res.status(500).json({ error: "Database error" });
      } 
      res.status(200).json(result.rows);
      // console.log(result)
    })
}

export const addUser = (req, res) => {
  const user = req.body;
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
  if(user.dob >= today) {
    return res.status(400).json({ error: "Date of birth cannot be greater than today" });
  }
  const query =
    "INSERT INTO users (firstname, lastname, dob, mobile, address) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  con.query(
    query,
    [user.firstname, user.lastname, user.dob, user.mobile, user.address],
    (err, result) => {
      if (err) {
        console.error("Error executing query", err.stack);
        return res.status(500).json({ error: "Database error" });
      } else {
        console.log("User added successfully");
        res.status(201).json(result);
      }
    }
  );
}

export const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
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

  con.query(query, user, (err, result) => {
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
}

export const deleteUser = (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM users WHERE id = $1 RETURNING *";

  con.query(query, [id], (err, result) => {
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
}

// export const sortTable = (req, res) => {
//   const {sort_by, sort_order} = req.params;
//   console.log("sort Table")
//   // const sort_order = req.params.sort_order;
//   console.log(sort_order)
//   const query = `SELECT id, firstname, lastname, TO_CHAR(dob, 'YYYY-MM-DD') AS dob, mobile, address FROM users ORDER BY "${sort_by}" ${sort_order}`;
//   con.query(query, [sort_by, sort_order], (err, result) => {
//     if (err) {
//         console.error("Error executing query", err.stack);
//         return res.status(500).json({ error: "Database error" });
//       } 
//       console.log(result)
//       res.status(200).json(result.rows);
//   })
// }
 

// module.exports = {
//   getUsers,
//   getUserById,
//   addUser,
//   updateUser,
//   deleteUser
// };