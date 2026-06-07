const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Transaction = require('../models/Transaction');
exports.registerTeacher = async (req, res) => {
    try {
        const { name, email, password, employeeId, qualification, salary } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email already registered!' });
        }

        const employeeExists = await Teacher.findOne({ employeeId });
        if (employeeExists) {
            return res.status(400).json({ success: false, message: 'Employee ID already exists!' });
        }

        const teacherPassword = password || 'teacher123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(teacherPassword, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'teacher'
        });

        const newTeacher = await Teacher.create({
            user: newUser._id,
            employeeId,
            qualification,
            salary
        });

        res.status(201).json({
            success: true,
            message: 'Teacher registered successfully!',
            data: {
                teacherProfileId: newTeacher._id,
                employeeId: newTeacher.employeeId,
                qualification: newTeacher.qualification,
                salary: newTeacher.salary,
                userDetails: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.allocateClassAndSubject = async (req, res) => {
    try {
        const { teacherId, classes, sections, subjects } = req.body; 

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher profile not found!' });
        }
        teacher.allocatedClasses = classes || teacher.allocatedClasses;
        teacher.allocatedSections = sections || teacher.allocatedSections;
        teacher.allocatedSubjects = subjects || teacher.allocatedSubjects;

        await teacher.save();

        res.status(200).json({
            success: true,
            message: 'Classes and Subjects allocated successfully!',
            data: teacher
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getTeacherProfile = async (req, res) => {
    try {
        const { id } = req.params; 

        const teacher = await Teacher.findById(id)
            .populate('user', '-password') 
            .populate('allocatedClasses', 'name') 
            .populate('allocatedSections', 'name') 
            .populate('allocatedSubjects', 'name code'); 

        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher profile not found!' });
        }

        res.status(200).json({
            success: true,
            data: teacher
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find()
            .populate('user', 'name email') 
            .populate('allocatedSubjects', 'name code'); 

        res.status(200).json({
            success: true,
            count: teachers.length,
            data: teachers
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.paySalary = async (req, res) => {
    try {
        const { teacherId, month } = req.body; 
        const markedBy = req.user.id;

        const teacher = await Teacher.findById(teacherId).populate('user', 'name');
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher profile not found!' });
        }

        const salaryAmount = teacher.salary;

        const expenseLog = await Transaction.create({
            type: 'Expense',
            category: 'Staff Salary',
            amount: salaryAmount,
            description: `Paid monthly salary of Rs. ${salaryAmount} to Teacher: ${teacher.user.name} for ${month}.`,
            referenceId: teacherId,
            markedBy
        });

        res.status(200).json({
            success: true,
            message: `Salary of Rs. ${salaryAmount} paid to ${teacher.user.name} and logged in Accounts successfully!`,
            expenseRecord: expenseLog
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateTeacherProfile = async (req, res) => {
    try {
        const { id } = req.params; 
        const { name, email, qualification, salary, status } = req.body;

        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher profile not found!' });
        }

        if (name || email) {
            const userUpdate = {};
            if (name) userUpdate.name = name;
            if (email) {
                const emailExists = await User.findOne({ email, _id: { $ne: teacher.user } });
                if (emailExists) {
                    return res.status(400).json({ success: false, message: 'Email already in use!' });
                }
                userUpdate.email = email;
            }
            await User.findByIdAndUpdate(teacher.user, userUpdate);
        }

        teacher.qualification = qualification || teacher.qualification;
        teacher.salary = salary || teacher.salary;
        teacher.status = status || teacher.status;

        await teacher.save();

        const updatedTeacher = await Teacher.findById(id).populate('user', '-password');

        res.status(200).json({
            success: true,
            message: 'Teacher profile updated successfully!',
            data: updatedTeacher
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.clearTeacherAllocations = async (req, res) => {
    try {
        const { id } = req.params; 

        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher profile not found!' });
        }

        teacher.allocatedClasses = [];
        teacher.allocatedSections = [];
        teacher.allocatedSubjects = [];

        await teacher.save();

        res.status(200).json({
            success: true,
            message: 'All allocations cleared successfully for this teacher!',
            data: teacher
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher profile not found!' });
        }

        teacher.status = 'Resigned'; 
        await teacher.save();

        res.status(200).json({
            success: true,
            message: 'Teacher profile deactivated successfully (Status: Resigned)!'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};