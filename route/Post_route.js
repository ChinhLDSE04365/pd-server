const express = require('express');
const postRoutes = express.Router();
const createConnection = require('../MySQLConnection');
const mysql = require('mysql');

//insert
postRoutes.route('/posts').post(function (req, res) {
    var data = req.body;
    if (data) {
        let sql = `INSERT INTO post SET ?`;

        let query = mysql.format(sql, [data]);

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

//get lasted posted by userid
postRoutes.route('/lastedPost/:uid').get(function (req, res) {
    var uid = req.params.uid;
    if (uid) {
        let sql = `SELECT * FROM post WHERE user_id=? and post_status=1 
                   ORDER BY postID DESC
                   LIMIT 1`;
        let query = mysql.format(sql, [parseInt(uid)]);

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

//select post that posted by the user
postRoutes.route('/posts').get(function (req, res) {
    var uid = req.query.uid;
    var page = req.query.page;
    var limit = 4;
    var offset = (page - 1) * limit;
    if (uid) {
        let sql = `SELECT p.*,COUNT(ps.user_id) as NOL, user.user_name, user.user_avatar FROM post  as p
                LEFT JOIN user ON p.user_id = user.uID
                LEFT JOIN post_reaction as ps ON p.postID=ps.post_id
                WHERE p.user_id=? and p.post_status = 1 GROUP BY p.postID ORDER BY postID DESC 
                LIMIT ?,?`;

        let query = mysql.format(sql, [parseInt(uid), offset, limit]);
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

//update post by the postID
postRoutes.route('/posts/:postid').put(function (req, res) {
    var postid = req.params.postid;

    var data = req.body;
    if (postid) {
        let sql = `UPDATE post SET ? WHERE postID=?`;

        let query = mysql.format(sql, [data, parseInt(postid)]);
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

//remove image from multimedia_storage
postRoutes.route('/posts/:postid').delete(function (req, res) {
    var postid = req.params.postid;
    if (postid) {
        let sql = `DELETE FROM multimedia_storage WHERE mURL IN 
        (SELECT img_URL as mURL FROM post_images WHERE post_id=?)`;

        let query = mysql.format(sql, [parseInt(postid)]);
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

//insert images to post_images
postRoutes.route('/postImages').post(function (req, res) {
    var data = req.body;
    if (data) {
        let sql = `INSERT INTO post_images SET ?`;

        let query = mysql.format(sql, [data]);

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
//select images by post id
postRoutes.route('/postImages/:postID').get(function (req, res) {
    var postID = req.params.postID;
    if (postID) {
        let sql = `SELECT * FROM post_images WHERE post_id=?`;

        let query = mysql.format(sql, [parseInt(postID)]);
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

//check postReaction
postRoutes.route('/postReaction').get(function (req, res) {
    let post_id = req.query.postID;
    let user_id = req.query.uid;
    if (post_id && user_id) {
        let sql = `SELECT * from post_reaction WHERE user_id=? and post_id=? `;
        let query = mysql.format(sql, [parseInt(user_id), parseInt(post_id)]);
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

//like post
postRoutes.route('/likePost').post(function (req, res) {
    var data = req.body;
    if (data) {
        let sql = `INSERT INTO post_reaction SET ?`;

        let query = mysql.format(sql, [data]);

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

//unlike post
postRoutes.route('/unlikePost').delete(function (req, res) {
    var post_id = req.body.post_id;
    var user_id = req.body.user_id;
    if (post_id && user_id) {
        let sql = `DELETE FROM post_reaction WHERE post_id=? and user_id=?`;

        let query = mysql.format(sql, [parseInt(post_id), parseInt(user_id)]);

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

//Top post by top follower of user
postRoutes.route('/topPosts/:uid').get(function (req, res) {
    var uid = req.params.uid;
    var page = req.query.page;
    var limit = 6;
    var offset = (page - 1) * limit;
    if (uid && page) {
        let sql = `WITH T1 AS (SELECT fed.followed_id as userID, COUNT(fed.follower_id) as NOF FROM followed as fed
        WHERE fed.followed_id IN (SELECT followed_id FROM followed WHERE follower_id=?)
        GROUP BY fed.followed_id
        ORDER BY NOF DESC
        LIMIT ?,?)
        
        SELECT user.user_name,user.user_avatar,post.postID as postID, post.user_id, post.caption, post.post_status, post.posted_at,post.updated_at FROM post
        RIGHT JOIN user ON user.uID = post.user_id
        WHERE post.post_status=1 and post.postID IN 
        (SELECT MAX(post.postID) from post  RIGHT JOIN T1 on post.user_id = T1.userID 
        WHERE post.post_status=1 GROUP BY post.user_id ORDER BY T1.NOF DESC)`;

        let query = mysql.format(sql, [parseInt(uid), offset, limit]);
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

//Last new post
postRoutes.route('/lastPost/').get(function (req, res) {
    var page = req.query.page;
    var limit = 3;
    var offset = (page - 1) * limit;
    if (page) {
        let sql = `SELECT user.user_name,user.user_avatar,post.* FROM post 
                    LEFT JOIN user ON user.uID = post.user_id
                    WHERE post.post_status=1
                    ORDER BY post.postID DESC
                    LIMIT ?,?`;

        let query = mysql.format(sql, [offset, limit]);
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

//Last new post owned
postRoutes.route('/lastOwnPost/:uid').get(function (req, res) {
    var uid = req.params.uid;
    var page = req.query.page;
    var limit = 1;
    var offset = (page - 1) * limit;
    if (uid && page) {
        let sql = `SELECT user.user_name,user.user_avatar,post.* FROM post 
                    LEFT JOIN user ON user.uID = post.user_id
                    WHERE post.post_status=1 and post.user_id=?
                    ORDER BY post.postID DESC
                    LIMIT ?,?`;

        let query = mysql.format(sql, [parseInt(uid), offset, limit]);
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

//insert a violation 
postRoutes.route('/violation').post(function (req, res) {
    var data = req.body;
    if (data) {
        let sql = `INSERT INTO violation SET ?`;

        let query = mysql.format(sql, [data]);

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


module.exports = postRoutes;