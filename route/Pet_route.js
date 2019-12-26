const express = require('express');
const petRoute = express.Router();
const createConnection = require('../MySQLConnection');
const mysql = require('mysql');

//get all pets from db
petRoute.route('/').get(function (req, res) {
  let sql = "Select * FROM pet ORDER BY petID ASC";
  //thực hiện câu lệnh query
  createConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        return res.status(404).send("404-Not Found");
      }
      return res.status(200).json(results);
    });
  });

});


//get pet by userID
//domain/pet/getPetByuID?uid=
petRoute.route('/getPetByuID').get(function (req, res) {
  let uid = req.query.uid;
  if (uid) {
    let sql = "SELECT * FROM pet WHERE user_id= ? and isRemove=0 ORDER BY petID ASC";
    let query = mysql.format(sql, parseInt(uid));
    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});

//get pet by userID for RNPickerSelect
//domain/pet/getPetByuID2?uid=
petRoute.route('/getPetByuID2').get(function (req, res) {
  let uid = req.query.uid;
  if (uid) {
    let sql = "SELECT p_name as label, petID as value FROM pet WHERE user_id= ? and isRemove=0 ORDER BY petID ASC";
    let query = mysql.format(sql, parseInt(uid));
    console.log();

    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});
//Dating Automation
petRoute.route('/datingAu').get(function (req, res) {
  let pb_id = req.query.pb;
  let loca_id = req.query.loca;
  let p_gender = req.query.gender;
  let u_id = req.query.uid;

  if (pb_id && loca_id && p_gender && u_id) {
    let withclause1 = `WITH T1 AS (SELECT pet.petID,pet.p_name,pet.p_dob, pet.p_avatar,user.uID,user.user_name,user.user_avatar,
                  location.locaName, COUNT(pet_reaction.user_id) as noLike
    FROM pet 
    INNER JOIN user ON pet.user_id=user.uID
    INNER JOIN location ON pet.location_id = location.locaID
    LEFT JOIN pet_reaction ON pet.petID=pet_reaction.pet_id
    WHERE pet.p_status=1 and pet.isRemove=0 and pet.pb_id=? and pet.location_id=? and pet.p_gender!=? and user.uID!=? and user.user_status=1 and pet.petID NOT IN 
    (SELECT pet_id from pet_ignorance where user_id=?)
    GROUP BY pet.petID)`;
    let query1 = mysql.format(withclause1, [parseInt(pb_id), parseInt(loca_id), p_gender, parseInt(u_id), parseInt(u_id)]);

    let withclause2 = `,T2 AS (SELECT pet.petID,pet.p_name,pet.p_dob, pet.p_avatar,user.uID,user.user_name,user.user_avatar,location.locaName, COUNT(pet_reaction.user_id) as noLike FROM pet 
    INNER JOIN user ON pet.user_id=user.uID
    INNER JOIN location ON pet.location_id = location.locaID
    LEFT JOIN pet_reaction ON pet.petID=pet_reaction.pet_id
    WHERE pet.p_status=1 and pet.isRemove=0 and pet.pb_id=? and pet.location_id!=? and pet.p_gender!=? and user.uID!=? and user.user_status=1 and pet.petID NOT IN 
    (SELECT pet_id from pet_ignorance where user_id=?)
    GROUP BY pet.petID)`;
    let query2 = mysql.format(withclause2, [parseInt(pb_id), parseInt(loca_id), p_gender, parseInt(u_id), parseInt(u_id)]);

    //5 Pet co nhieu luot like nhat
    let sql1 = `(SELECT T1.uID, T1.petID,T1.p_name,T1.p_dob,T1.p_avatar,T1.user_name,T1.user_avatar,T1.locaName, T1.noLike, COUNT(fl.follower_id) as noFollow FROM T1
    LEFT JOIN followed as fl ON T1.uID=fl.followed_id
    GROUP BY T1.petID
    ORDER BY T1.noLike DESC
    LIMIT 5)`;

    //5 pet co Chu so huu co nhieu luot follow nhat
    let sql2 = `(SELECT T1.uID, T1.petID,T1.p_name,T1.p_dob,T1.p_avatar,T1.user_name,T1.user_avatar,T1.locaName, T1.noLike, COUNT(fl.follower_id) as noFollow FROM T1
    LEFT JOIN followed as fl ON T1.uID=fl.followed_id
    GROUP BY T1.petID
    ORDER BY noFollow DESC
    LIMIT 5)`;

    //5 pet Nhieu luot thich nhat nhung khac location  
    let sql3 = `(SELECT T2.uID, T2.petID,T2.p_name,T2.p_dob,T2.p_avatar,T2.user_name,T2.user_avatar,T2.locaName, T2.noLike, COUNT(fl.follower_id) as noFollow FROM T2
    LEFT JOIN followed as fl ON T2.uID=fl.followed_id
    GROUP BY T2.petID
    ORDER BY T2.noLike DESC
    LIMIT 5)`;

    //5 pets moi nhat cung location 
    let sql4 = `(SELECT T1.uID, T1.petID,T1.p_name,T1.p_dob,T1.p_avatar,T1.user_name,T1.user_avatar,T1.locaName, T1.noLike, COUNT(fl.follower_id) as noFollow FROM T1
    LEFT JOIN followed as fl ON T1.uID=fl.followed_id
    GROUP BY T1.petID
    ORDER BY T1.petID DESC
    LIMIT 5)`;

    let query = query1 + query2 + sql1 + "UNION " + sql2 + "UNION" + sql3 + "UNION" + sql4;

    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
    let sql = `UPDATE pet SET ? WHERE petID=?`;
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});

//Dating Manual
petRoute.route('/datingMn').get(function (req, res) {
  let pb_id = req.query.pb;
  let loca_id = req.query.loca;
  let p_gender = req.query.gender;
  let u_id = req.query.uid;

  if (pb_id && loca_id && p_gender && u_id) {
    let withclause1 = `WITH T1 AS (SELECT pet.petID,pet.p_name,pet.p_dob, pet.p_avatar,user.uID,user.user_name,user.user_avatar,
            location.locaName, COUNT(pet_reaction.user_id) as noLike
      FROM pet 
      INNER JOIN user ON pet.user_id=user.uID
      INNER JOIN location ON pet.location_id = location.locaID
      LEFT JOIN pet_reaction ON pet.petID=pet_reaction.pet_id
      WHERE pet.p_status=1 and pet.isRemove=0 and pet.pb_id=? and pet.location_id=? and pet.p_gender=? and user.uID!=? and user.user_status=1 and pet.petID NOT IN 
      (SELECT pet_id from pet_ignorance where user_id=?)
      GROUP BY pet.petID)`;
    let query1 = mysql.format(withclause1, [parseInt(pb_id), parseInt(loca_id), p_gender, parseInt(u_id), parseInt(u_id)]);

    //5 Pet co nhieu luot like nhat
    let sql1 = `(SELECT T1.uID, T1.petID,T1.p_name,T1.p_dob,T1.p_avatar,T1.user_name,T1.user_avatar,T1.locaName, T1.noLike, COUNT(fl.follower_id) as noFollow FROM T1
     LEFT JOIN followed as fl ON T1.uID=fl.followed_id
     GROUP BY T1.petID
     ORDER BY T1.noLike DESC
     LIMIT 5)`;

    //5 pet co Chu so huu co nhieu luot follow nhat
    let sql2 = `(SELECT T1.uID, T1.petID,T1.p_name,T1.p_dob,T1.p_avatar,T1.user_name,T1.user_avatar,T1.locaName, T1.noLike, COUNT(fl.follower_id) as noFollow FROM T1
     LEFT JOIN followed as fl ON T1.uID=fl.followed_id
     GROUP BY T1.petID
     ORDER BY noFollow DESC
     LIMIT 5)`;
    //5 pets moi nhat cung location 
    let sql3 = `(SELECT T1.uID, T1.petID,T1.p_name,T1.p_dob,T1.p_avatar,T1.user_name,T1.user_avatar,T1.locaName, T1.noLike, COUNT(fl.follower_id) as noFollow FROM T1
    LEFT JOIN followed as fl ON T1.uID=fl.followed_id
    GROUP BY T1.petID
    ORDER BY T1.petID DESC
    LIMIT 5)`;
    let query = query1 + sql1 + "UNION " + sql2 + "UNION " + sql3;


    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});
//get pet reaction by user_id and pet_id
//that include number of like and check status about like/unlike of user
petRoute.route('/getPInfor').get(function (req, res) {
  let pet_id = req.query.pid;
  let user_id = req.query.uid;
  if (pet_id && user_id) {
    let sql = `SELECT * from pet_reaction WHERE user_id=? and pet_id=? `;
    let query = mysql.format(sql, [parseInt(user_id), parseInt(pet_id)]);
    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});

//like reaction
petRoute.route('/likePet').get(function (req, res) {
  let pet_id = req.query.pid;
  let user_id = req.query.uid;
  if (pet_id && user_id) {
    let sql = `INSERT INTO pet_reaction (pet_id, user_id) VALUES (?,?)`;
    let query = mysql.format(sql, [parseInt(pet_id), parseInt(user_id)]);

    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).send("Success like pet");
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});

//unlike reaction
petRoute.route('/unlikePet').get(function (req, res) {
  let pet_id = req.query.pid;
  let user_id = req.query.uid;
  if (pet_id && user_id) {
    let sql = `DELETE FROM pet_reaction WHERE pet_id=? and user_id=?`;
    let query = mysql.format(sql, [parseInt(pet_id), parseInt(user_id)]);

    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).send("Success unlike_pet");
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});

//Pet ignorance
petRoute.route('/ignorPet').get(function (req, res) {
  let pet_id = req.query.pid;
  let user_id = req.query.uid;
  if (pet_id && user_id) {
    let sql = `INSERT INTO pet_ignorance (pet_id, user_id) VALUES (?,?)`;
    let query = mysql.format(sql, [parseInt(pet_id), parseInt(user_id)]);

    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).send("Success unlike_pet");
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});

//get breed for RNPickerSelect by ps_id
petRoute.route('/breeds/:psID').get(function (req, res) {
  var psID = req.params.psID;
  if (psID) {
    let sql = `SELECT pb_name as label, pbID as value FROM pet_breed WHERE ps_id = ? and pb_status=1 ORDER BY pb_name ASC`;
    let query = mysql.format(sql, [parseInt(psID)]);
    //thực hiện câu lệnh query
    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});
//get species for RNPickerSelect
petRoute.route('/species').get(function (req, res) {
  let sql = `SELECT ps_name as label, psID as value FROM pet_species WHERE ps_status=1 ORDER BY psID ASC`;
  //thực hiện câu lệnh query
  createConnection(function (err, connection) {
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        return res.status(404).send("404-Not Found");
      }
      return res.status(200).json(results);
    });
  });

});

//get pets by pID
petRoute.route('/pets/:pid').get(function (req, res) {
  var pid = req.params.pid;
  if (pid) {
    let sql = `SELECT pet.*,pet_breed.ps_id,pet_breed.pb_name FROM pet 
    LEFT JOIN pet_breed ON pet.pb_id=pet_breed.pbID
    WHERE pet.petID=? and pet.isRemove=0`;

    let query = mysql.format(sql, [parseInt(pid)]);

    createConnection(function (err, connection) {
      // do whatever you want with your connection here
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});
//insert new pet
petRoute.route('/pets').post(function (req, res) {
  var data = req.body;
  if (data) {
    let sql = `INSERT INTO pet SET ?`;

    let query = mysql.format(sql, [data]);
    console.log(query);

    createConnection(function (err, connection) {
      // do whatever you want with your connection here
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});
//update pet
petRoute.route('/pets/:petID').put(function (req, res) {
  var petID = req.params.petID;
  var data = req.body;
  if (petID) {
    let sql = `UPDATE pet SET ? WHERE petID=?`;

    let query = mysql.format(sql, [data,parseInt(petID)]);
    console.log(query);

    createConnection(function (err, connection) {
      // do whatever you want with your connection here
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});
//get featured images
petRoute.route('/featureImgs/:pid').get(function (req, res) {
  let pet_id = req.params.pid;
  if (pet_id) {
    let sql = `SELECT * from pet_feature WHERE pet_id=? 
    ORDER BY uploaded_at DESC
    LIMIT 6`;
    let query = mysql.format(sql, [parseInt(pet_id)]);
    console.log(query);
    
    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});

//insert featured image
petRoute.route('/featureImgs').post(function (req, res) {
  let data = req.body;
  if (data) {
    let sql = `INSERT INTO pet_feature SET ?`;
    let query = mysql.format(sql, [data]);
    console.log(query);
    
    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});

//update featured image
petRoute.route('/featureImgs/:pid').put(function (req, res) {
  let pid = req.params.pid;
  let oldURL = req.body.oldURL;
  let newURL = req.body.newURL;
  
  if (pid && oldURL&&newURL) {
    let sql = `UPDATE pet_feature SET img_URL= ? WHERE pet_id=? and img_URL=?`;
    let query = mysql.format(sql, [newURL,parseInt(pid),oldURL]);
    console.log(query);
    
    createConnection(function (err, connection) {
      connection.query(query, function (error, results, fields) {
        connection.release();
        if (error) {
          return res.status(404).send("404-Not Found");
        }
        return res.status(200).json(results);
      });
    });
  } else {
    return res.status(400).send("400-Bad Request");
  }
});



module.exports = petRoute;