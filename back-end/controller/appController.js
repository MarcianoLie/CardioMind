const FeedParser = require("feedparser-promised");
const dotenv = require("dotenv");
const User = require("../models/userModel.js");
const SuicidePrediction = require('../models/suicideModel.js');
const News = require("../models/newsModel.js");

dotenv.config();

// profile
const profile = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: true, message: "Unauthorized" });

    const userProfile = await User.findOne({ userId: userId });
    if (!userProfile) {
        return res.status(404).json({ error: true, message: "User tidak ditemukan" });
    }

    res.status(200).json({ error: false, message: "Data User ditemukan", user: userProfile });
};


const editProfile = async (req, res) => {
    const { displayName, birthPlace, birthDate, phone } = req.body;
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: true, message: "Unauthorized" });
    try {
        const userNewData = {
            displayName: displayName,
            birthPlace: birthPlace,
            birthDate: birthDate,
            phone: phone
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
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { message, predictionResult } = req.body;

    try {
        const user = await User.findOne({ "userId": userId });

        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        const prediction = new SuicidePrediction({
            userId: user.userId,
            message,
            predictionResult,
        });

        await prediction.save();
        res.status(201).json({ success: true, data: prediction });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
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
        res.status(200).json({ success: true, message: `${insertedCount} artikel baru telah disimpan.` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getHealthArticles = async (req, res) => {
    try {
        const articles = await News.find().sort({ pubDate: -1 });
        res.status(200).json({ success: true, data: articles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = { editProfile, profile, saveSuicidePrediction, newsUpdate, getHealthArticles };
