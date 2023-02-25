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








// // import database connection from folder
// let db = require('./config');

// // import bcrypt
// let {hash, compare, hashSync} = require('bcrypt');

// // 
// let {createToken} = require('../middleware/AuthenticatedUser');

// // User class
// class User {
//     fetchUsers(req, res){
//         const qry = 
//         `
//         SELECT
//         userID,
//         firstName,
//         lastName,
//         gender,
//         emailAdd,
//         userRole,
//         userProfile
//         FROM Users;
//         `
//         db.query(strQry, (err, data) => {
//             if (err) throw err;
//             else res.status(200).
//             json({results: data})
//         })
//     }

//     fetchUsers(req, res) {
//         const strQry = 
//         `
//         SELECT
//         userID,
//         firstName,
//         lastName,
//         gender,
//         emailAdd,
//         userRole,
//         userProfile
//         FROM Users
//         WHERE userID =?;
//         `
//         db.query(strQry, [req.params.id], (err, data) => {
//             if (err) throw err;
//             else res.status(200).
//             json({results: data})
//         })
//     }

// }

// // fetchUsers(req, res) {
// //     const strQry = 
// //     `
// //     SELECT
// //     userID,
// //     firstName,
// //     lastName,
// //     gender,
// //     emailAdd,
// //     userRole,
// //     userProfile
// //     FROM Users
// //     WHERE userID =?;
// //     `
// //     db.query(strQry, [req.params.id], (err, data) => {
// //         if (err) throw err;
// //         else res.status(200).
// //         json({results: data})
// //     })
// // }


// class User{
//     login(req, res) {
//         const {emailAdd, userPass} = req.body;
//         const strQry = 
//         `
//         SELECT
//         userID,
//         firstName,
//         lastName,
//         gender,
//         emailAdd,
//         userRole,
//         userPass,
//         userProfile
//         FROM Users
//         WHERE emailAdd = ${emailAdd};

//         `
//         db.query(strQry, async(err, data) => {
//         if(err) throw err;
//             if ((!data) || (data == null)) {
//                 res.status(401).json({err: 
//                     "You have entered an invalid email or password"
//                 });
//              } else{
//                 await compare(userPass, data[0].userPass, (cErr, cResult) => {
//                     if (cErr) throw cErr;
//                     // Create token
//                     const jwToken = createToken({emailAdd, userPass});
//                     // saving the token

//                     res.cookie('Kus Bier', jwToken, {
//                     maxAge: 3600000,
//                     httpOnly: true
//                     })
//                     if (cResult) {
//                         res.status(200).
//                         json({
//                             msg: 'Login successful',
//                             jwToken,
//                             result: data[0]
//                         })
//              } else{
//                 res.status(401).json({
//                 err: 'you have entered an invalid email or did not register'
//                 })
//              }

//                     }
//                 })
//              }

//         })
//     }
    
// }