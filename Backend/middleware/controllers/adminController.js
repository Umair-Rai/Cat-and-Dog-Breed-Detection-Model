const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

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
      admin_email: "admin@gmail.com",
      admin_pass: "admin123", // pre-save hook will hash it
      role: "admin"
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
