const FeedParser = require("feedparser-promised");
const dotenv = require("dotenv");
const { User } = require('../models/userModel');
const SuicidePrediction = require('../models/suicideModel.js');
const News = require("../models/newsModel.js");
const Comments = require("../models/commentModel.js");
const Reply = require("../models/replyModel.js");
const CardioPredict = require("../models/cardioModel.js");
// const multer = require('multer');
// const path = require('path');

dotenv.config();

// profile
const profile = async (req, res) => {
    try {
        const userId = req.session.userId; 

        console.log("Fetching profile for user:", userId);

        const userProfile = await User.findOne({ userId: userId });
        
        if (!userProfile) {
            return res.status(404).json({ error: true, message: "User tidak ditemukan" });
        }

        res.status(200).json({ error: false, message: "Data User ditemukan", user: userProfile });

    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ error: true, message: "Terjadi kesalahan server" });
    }
};


const editProfile = async (req, res) => {
    const { displayName, birthPlace, birthDate, phone } = req.body;
    const userId = req.session.userId;
    console.log(userId);
    if (!userId) return res.status(401).json({ error: true, message: "Unauthorized" });
    try {
        const userNewData = {
            displayName: displayName,
            birthPlace: birthPlace,
            birthDate: birthDate,
            phone: phone,
        }
        const result = await User.updateOne(
            { userId: userId },
            { $set: userNewData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: true, message: "User tidak ditemukan" });
        }

        res.status(200).json({ error: false, message: "Data user berhasil diubah", _id: userId });
    }
    catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
};


// history
const saveSuicidePrediction = async (req, res) => {
    const userId = req.session.userId;
    const { message, predictionResult } = req.body;

    try {

        const prediction = new SuicidePrediction({
            userId: userId,
            message,
            predictionResult,
        });

        await prediction.save();
        res.status(201).json({ error: false, data: prediction });
    } catch (err) {
        res.status(500).json({ error: true, error: err.message });
    }
};




// artikel update
const keywords = ['sehat', 'kesehatan', 'gizi', 'nutrisi', 'penyakit', 'imun'];
function isHealthArticle(item) {
    const desc = item.description?.toLowerCase() || '';
    return keywords.some(keyword => desc.includes(keyword));
}

function extractImage(html) {
    const match = html.match(/img.*?src="(.*?)"/);
    return match ? match[1] : null;
}

const newsUpdate = async (req, res) => {
    const url = 'https://kemkes.go.id/id/rss/article/artikel-kesehatan';
    try {
        const items = await FeedParser.parse(url);
        let insertedCount = 0;

        for (const item of items) {
            if (!isHealthArticle(item)) continue;
            const imageUrl = extractImage(item.description) || item.enclosures?.[0]?.url || '';

            const result = await News.updateOne(
                { link: item.link },
                {
                    $setOnInsert: {
                        title: item.title,
                        link: item.link,
                        description: item.description,
                        pubDate: new Date(item.pubDate),
                        imageUrl: imageUrl
                    }
                },
                { upsert: true }
            );

            if (result.upsertedCount > 0) {
                insertedCount++;
            }
        }
        res.status(200).json({ error: false, message: `${insertedCount} artikel baru telah disimpan.` });
    } catch (err) {
        res.status(500).json({ error: true, error: err.message });
    }
}

const getHealthArticles = async (req, res) => {
    try {
        const articles = await News.find().sort({ pubDate: -1 });
        const shownArticle = articles.map(article => ({
            _id: article._id,
            title: article.title,
            pubDate: article.pubDate,
            imageUrl: article.imageUrl
        })
        )
        res.status(200).json({ error: false, data: shownArticle });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

const articleById = async (req, res) => {
    const id = req.params.id;
    try {
        const article = await News.findById(id)
        if (!article) {
            res.status(404).json({ error: true, message: "Artikel tidak ditemukan" });
        }
        res.status(200).json({ error: false, data: article });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message })
    }
}


const getComments = async (req, res) => {
    try {
        const newsId = req.params.newsId;

        const comments = await Comments.aggregate([
            {
                $match: { newsId: newsId } 
            },
            {
                $lookup: {
                    from: "user", 
                    localField: "userId",
                    foreignField: "userId",
                    as: "userData"
                }
            },
            {
                $unwind: "$userData" 
            },
            {
                $sort: { createdAt: -1 } 
            },
            {
                $project: {
                    comment: 1,
                    createdAt: 1,
                    userId: 1,
                    username: "$userData.displayName",
                    profileImage: "$userData.profileImage" 
                }
            }
        ]);

        if (comments.length === 0) {
            return res.status(404).json({ false: true, message: "Komentar tidak ditemukan" });
        }

        res.status(200).json({ error: false, data: comments });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};
const getReplies = async (req, res) => {
    try {
        const commentId = req.params.commentId; 

        const replies = await Reply.aggregate([
            {
                $match: { commentId: commentId } 
            },
            {
                $lookup: {
                    from: "user",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userData"
                }
            },
            {
                $unwind: "$userData" 
            },
            {
                $sort: { createdAt: -1 } 
            },
            {
                $project: {
                    reply: 1,
                    createdAt: 1,
                    userId: 1,
                    username: "$userData.displayName",
                    profileImage: "$userData.profileImage",
                    status: "$userData.status" 
                }
            }
        ]);

        if (replies.length === 0) {
            return res.status(200).json({ error: false, data: replies, message: "Replies tidak ditemukan" });
        }

        res.status(200).json({ error: false, data: replies });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};


const postComments = async (req, res) => {
    const userId = req.session.userId; 
    const { newsId, comment } = req.body;
    console.log("Session userId set:", userId);

    if (!comment || !newsId || !userId) {
        return res.status(400).json({ message: "Data tidak lengkap" });
    }

    try {
        const newComment = new Comments({
            userId,
            newsId,
            comment,
            createdAt: new Date(),
        });

        await newComment.save();
        res.status(201).json({ error: false, message: "Komentar berhasil ditambahkan" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: err.message });
    }
};
const postReply = async (req, res) => {
    const userId = req.session.userId;
    const { commentId, reply } = req.body;
    console.log("Session userId set:", userId);

    if (!commentId || !reply || !userId) {
        return res.status(400).json({ error: false, message: "Data tidak lengkap" });
    }

    try {
        const newReply = new Reply({
            userId,
            commentId,
            reply,
            createdAt: new Date(),
        });

        await newReply.save();
        res.status(201).json({ error: false, message: "Reply berhasil ditambahkan" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: err.message });
    }
};

const postCardioPredict = async (req, res) => {
    const userId = req.session.userId; 
    const { age, gender, height, weight, ap_hi, ap_lo,
        cholesterol, glucose, smoke, alcohol, active, score } = req.body;
    console.log("Session userId set for record:", userId);

    if (!score || !userId) {
        return res.status(400).json({ error: true, message: "Data tidak lengkap" });
    }

    try {
        const newCardioRecord = new CardioPredict({
            userId,
            age, gender, height, weight, ap_hi, ap_lo,
            cholesterol, glucose, smoke, alcohol, active, score,
            createdAt: new Date(),
        });

        await newCardioRecord.save();
        res.status(201).json({ error: false, message: "cardio predict berhasil ditambahkan" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: err.message });
    }
};
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ 
//   storage: storage, 
//   limits: { fileSize: 50 * 1024 * 1024 } // 50MB
// });

const postImageProfile = async (req, res) => {
    const userId = req.session.userId;
    const { profileImage } = req.body;

    if (!profileImage || !userId) {
        return res.status(400).json({ error: true, message: "Gambar atau userId tidak tersedia" });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { userId },
            { profileImage: profileImage },
            { new: true, upsert: false } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: true, message: "User tidak ditemukan" });
        }

        res.status(200).json({ error:false, message: "Gambar profil berhasil diperbarui", data: updatedUser });
    } catch (err) {
        console.error("Error updating profile image:", err);
        res.status(500).json({ error:true, message: err.message });
    }
};


// const getUser = async (req, res) => {
//     try {
//       const userId = req.session.userId;
//       if (!userId) {
//         return res.status(401).json({ success: false, message: "Unauthorized: No session" });
//       }

//       const user = await User.findOne({ userId }); // mencocokkan dengan field userId dalam model
//       if (!user) {
//         return res.status(404).json({ success: false, message: "User not found" });
//       }

//       res.status(200).json({ success: true, data: user });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };


const getCardioHistory = async (req, res) => {
    try {
        const userId = req.session.userId; 

        if (!userId) {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        const cardioPredict = await CardioPredict.find({ userId })
            .sort({ createdAt: -1 }) 
            .select(
                "userId age gender height weight ap_hi ap_lo cholesterol glucose smoke alcohol active score createdAt"
            ); 

        if (cardioPredict.length === 0) {
            return res.status(200).json({ error: true, message: "History tidak ditemukan" });
        }

        res.status(200).json({ error: false, data: cardioPredict });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};


const getSuicidePredictions = async (req, res) => {
    const userId = req.session.userId;
    try {
        const predictions = await SuicidePrediction.find({ userId })
            .sort({ createdAt: -1 })
            .select('-__v');

        if (!predictions || predictions.length === 0) {
            return res.status(200).json({
                error: true,
                message: "Tidak ada riwayat prediksi ditemukan."
            });
        }

        res.status(200).json({
            error: false,
            data: predictions
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            error: err.message
        });
    }
};



module.exports = { getReplies, editProfile, profile, saveSuicidePrediction, getSuicidePredictions, newsUpdate, getHealthArticles, articleById, getComments, postComments, postCardioPredict, postImageProfile, getCardioHistory, postReply };
