const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes");
const academicRoutes = require("./routes/academicRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const feeRoutes = require("./routes/feeRoutes");
const examRoutes = require("./routes/examRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const transportRoutes = require("./routes/transportRoutes");
const accountsRoutes = require("./routes/accountsRoutes");
const communicationRoutes = require("./routes/communicationRoutes");
const reportsRoutes = require("./routes/reportsRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/communication", communicationRoutes);
app.use("/api/reports", reportsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to School ERP Backend Server with MongoDB!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
