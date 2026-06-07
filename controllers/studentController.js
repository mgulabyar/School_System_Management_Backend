const Student = require('../models/Student');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
exports.admitStudent = async (req, res) => {
    try {
        const { 
            name, email, password, admissionNo, rollNo, 
            dateOfBirth, gender, classId, sectionId, parentName, parentPhone 
        } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email already registered!' });
        }

        const admissionExists = await Student.findOne({ admissionNo });
        if (admissionExists) {
            return res.status(400).json({ success: false, message: 'Admission Number already exists!' });
        }

        const studentPassword = password || 'student123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(studentPassword, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'student'
        });

        const newStudent = await Student.create({
            user: newUser._id,
            admissionNo,
            rollNo,
            dateOfBirth,
            gender,
            class: classId,
            section: sectionId,
            parentName,
            parentPhone
        });

        res.status(201).json({
            success: true,
            message: 'Student admitted and profile created successfully!',
            data: {
                studentProfileId: newStudent._id,
                admissionNo: newStudent.admissionNo,
                rollNo: newStudent.rollNo,
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

exports.getStudentProfile = async (req, res) => {
    try {
        const { id } = req.params; 

        const student = await Student.findById(id)
            .populate('user', '-password') 
            .populate('class')
            .populate('section');

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found!' });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate('user', 'name email') 
            .populate('class', 'name') 
            .populate('section', 'name'); 

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.promoteStudent = async (req, res) => {
    try {
        const { studentId, nextClassId, nextSectionId, nextRollNo } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found!' });
        }

        student.class = nextClassId;
        student.section = nextSectionId;
        student.rollNo = nextRollNo || student.rollNo;
        student.status = 'Promoted'; 

        await student.save();

        res.status(200).json({
            success: true,
            message: 'Student promoted to the next class successfully!',
            data: student
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.issueTransferCertificate = async (req, res) => {
    try {
        const { studentId } = req.body;

        const student = await Student.findById(studentId).populate('user', 'name');
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found!' });
        }

        student.status = 'Transferred';
        await student.save();

        res.status(200).json({
            success: true,
            message: 'Transfer Certificate (TC) issued successfully!',
            certificate: {
                studentName: student.user.name,
                admissionNo: student.admissionNo,
                rollNo: student.rollNo,
                status: 'Transferred',
                tcIssueDate: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateStudentProfile = async (req, res) => {
    try {
        const { id } = req.params; 
        const { name, email, rollNo, dateOfBirth, gender, parentName, parentPhone, status } = req.body;

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found!' });
        }

        if (name || email) {
            const userUpdate = {};
            if (name) userUpdate.name = name;
            if (email) {
                const emailExists = await User.findOne({ email, _id: { $ne: student.user } });
                if (emailExists) {
                    return res.status(400).json({ success: false, message: 'This email is already in use by another user!' });
                }
                userUpdate.email = email;
            }
            await User.findByIdAndUpdate(student.user, userUpdate);
        }

        student.rollNo = rollNo || student.rollNo;
        student.dateOfBirth = dateOfBirth || student.dateOfBirth;
        student.gender = gender || student.gender;
        student.parentName = parentName || student.parentName;
        student.parentPhone = parentPhone || student.parentPhone;
        student.status = status || student.status;

        await student.save();

        const updatedStudent = await Student.findById(id).populate('user', '-password');

        res.status(200).json({
            success: true,
            message: 'Student profile updated successfully!',
            data: updatedStudent
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found!' });
        }

        student.status = 'Inactive'; 
        await student.save();

        res.status(200).json({
            success: true,
            message: 'Student profile deactivated successfully (Soft Deleted)!'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};