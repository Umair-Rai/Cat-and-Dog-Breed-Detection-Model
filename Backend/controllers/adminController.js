const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Generate JWT
const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.ACCESS_TOKEN_SECRET, // use this instead of JWT_SECRET
    { expiresIn: "7d" }
  );
};

exports.registerDefaultAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne({ admin_email: "superadmin@example.com" });

    if (existing) {
      return res.json({ message: "Default superadmin already exists", admin: existing });
    }

    const defaultAdmin = new Admin({
      admin_name: "Super Admin",
      admin_email: "u@gmail.com",
      admin_pass: "1", // pre-save hook will hash it
      role: "superadmin" // ✅ Changed from "admin" to "superadmin"
    });

    await defaultAdmin.save();
    res.status(201).json({ message: "Default superadmin created", admin: defaultAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { admin_name, admin_email, admin_pass, role = "admin" } = req.body;


    const existing = await Admin.findOne({ admin_email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const admin = new Admin({ admin_name, admin_email, admin_pass, role });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { admin_email, admin_pass } = req.body;
    const admin = await Admin.findOne({ admin_email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.comparePassword(admin_pass);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(admin);
    res.json({ token, admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  console.log('🔄 Password update request received for admin:', req.params.id);
  console.log('📝 Request body:', { ...req.body, oldPassword: '[HIDDEN]', newPassword: '[HIDDEN]' });
  
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      console.log('❌ Missing password fields');
      return res.status(400).json({ error: "Both old and new passwords are required" });
    }
    
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      console.log('❌ Admin not found');
      return res.status(404).json({ error: "Admin not found" });
    }

    console.log('🔍 Comparing passwords...');
    const isMatch = await bcrypt.compare(oldPassword, admin.admin_pass);
    if (!isMatch) {
      console.log('❌ Old password incorrect');
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    console.log('💾 Updating password...');
    admin.admin_pass = newPassword;
    await admin.save();
    
    console.log('✅ Password updated successfully');
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error('💥 Password update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
