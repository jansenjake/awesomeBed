//Import db connection from config folder
let db = require("../config");
//Import bcrypt module
let { hash, compare, hashSync } = require("bcrypt");
// creating a token
let { createToken } = require("../middleware/AuthenticatedUser");
//user class
class User {
  login(req, res) {
    const { emailAddress, userPass } = req.body;
    const strQry = `
SELECT userID,firstName,lastName ,emailAddress,userPass,gender,userRole,userProfile FROM Users WHERE emailAddress = ${emailAddress};
`;
    db.query(strQry, async (err, data) => {
      if (err) throw err;
      if (!data || data == null) {
        res.status(401).json({ err: "You provided the wrong email address" });
      } else {
        await compare(userPass, data[0].userPass, (cErr, cResult) => {
          // create token
          const jwToken = createToken({
            emailAddress,
            userPass,
          });
          //saving token
          res.cookie("LegitUser", jwToken, {
            maxAge: 3600000,
            httpOnly: true,
          });
          if (cResult) {
            res.status(200).json({
              msg: "Logged in",
              jwToken,
              result: data[0],
            });
          } else {
            res.status(401).json({
              err: "You entered an invalid password or did not register.",
            });
          }
        });
      }
    });
  }
  fetchUsers(req, res) {
    const strQry = `
        SELECT
        userID,firstName,lastName ,emailAddress,gender,userRole,userProfile FROM Users;
        `;
    db.query(strQry, (err, data) => {
      if (err) throw err;
      else res.status(200).json({ result: data });
    });
  }
  fetchUser(req, res) {
    const strQry = `
        SELECT
        userID,firstName,lastName ,emailAddress,gender,userRole,userProfile FROM Users WHERE userID = ?;
        `;
    db.query(strQry, [req, params.id], (err, data) => {
      if (err) throw err;
      else res.status(200).json({ result: data });
    });
  }
}

class Product {
  fetchProducts(req, res) {
      const strQry = `SELECT id, prodName, prodDescription, category, price, prodQuantity, imgURL
      FROM products;`;
      db.query(strQry, (err, results)=> {
          if(err) throw err;
          res.status(200).json({results: results})
      });
  }
  fetchProduct(req, res) {
      const strQry = `SELECT id, prodName, prodDescription, category, price, prodQuantity, imgURL
      FROM products
      WHERE id = ?;`;
      db.query(strQry, [req.params.id], (err, results)=> {
          if(err) throw err;
          res.status(200).json({results: results})
      });

  }
  addProduct(req, res) {
      const strQry = 
      `
      INSERT INTO Products
      SET ?;
      `;
      db.query(strQry,[req.body],
          (err)=> {
              if(err){
                  res.status(400).json({err: "Unable to insert a new record."});
              }else {
                  res.status(200).json({msg: "Product saved"});
              }
          }
      );    

  }
  updateProduct(req, res) {
      const strQry = 
      `
      UPDATE Products
      SET ?
      WHERE id = ?
      `;
      db.query(strQry,[req.body, req.params.id],
          (err)=> {
              if(err){
                  res.status(400).json({err: "Unable to update a record."});
              }else {
                  res.status(200).json({msg: "Product updated"});
              }
          }
      );    

  }
  deleteProduct(req, res) {
      const strQry = 
      `
      DELETE FROM Products
      WHERE id = ?;
      `;
      db.query(strQry,[req.params.id], (err)=> {
          if(err) res.status(400).json({err: "The record was not found."});
          res.status(200).json({msg: "A product was deleted."});
      })
  }

}
// Export User class
module.exports = {
  User, 
  Product
}