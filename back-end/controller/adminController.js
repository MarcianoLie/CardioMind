const { User } = require('../models/userModel');
const News = require("../models/newsModel.js");



const getTotalUsers = async (req, res) => {
    try {
        const status = req.session.status;
        if (status !== "admin") {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        const totalUsers = await User.countDocuments({ status: "user" });

        res.status(200).json({
            error: false,
            total: totalUsers
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

const getTotalMedics = async (req, res) => {
    try {
        const status = req.session.status;
        if (status !== "admin") {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        const totalMedics = await User.countDocuments({ status: "medic" });

        res.status(200).json({
            error: false,
            total: totalMedics
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

const getTotalNews = async (req, res) => {
    try {
        const status = req.session.status;
        if (status !== "admin") {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        const totalNews = await News.countDocuments();

        res.status(200).json({
            error: false,
            total: totalNews
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const status = req.session.status;
        if (status !== "admin") {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        const users = await User.find({ status: "user" }).select(
            "displayName email phone birthPlace birthDate"
        );

        res.status(200).json({
            error: false,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

const getAllMedics = async (req, res) => {
    try {
        const status = req.session.status;
        if (status !== "admin") {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        const medics = await User.find({ status: "medic" }).select(
            "displayName email phone birthPlace birthDate"
        );

        res.status(200).json({
            error: false,
            data: medics
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

const searchUser = async (req, res) => {
    try {
        const { email } = req.query;
        const status = req.session.status;
        if (status !== "admin") {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        const user = await User.findOne({ email });
        if (user && user.status === "user") {
            return res.status(200).json({ error: false, data: user });
        }

        res.status(404).json({ error: true, message: "User not found or not eligible" });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

const promoteToMedic = async (req, res) => {
    try {
        const status = req.session.status;
        if (status !== "admin") {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        const { email } = req.body;
        const updated = await User.findOneAndUpdate(
            { email, status: "user" },
            { status: "medic" },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: true, message: "User not found or already promoted" });
        }

        res.status(200).json({ error: false, data: updated });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

const changeToUser = async (req, res) => {
    try {
        const status = req.session.status;
        if (status !== "admin") {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        const { email } = req.body;
        const updated = await User.findOneAndUpdate(
            { email, status: "medic" },
            { status: "user" },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: true, message: "User not found or already promoted" });
        }

        res.status(200).json({ error: false, data: updated });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const status = req.session.status;
        if (status !== "admin") {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        const { email } = req.body;
        
        // Hapus user dari collection User
        const result = await User.deleteOne({ email });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        res.status(200).json({ error: false, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

module.exports = { getTotalMedics, getTotalNews, getTotalUsers, getAllUsers, getAllMedics, searchUser, promoteToMedic, deleteUser, changeToUser };