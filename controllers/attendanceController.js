const StudentAttendance = require('../models/StudentAttendance');
const StaffAttendance = require('../models/StaffAttendance');

const normalizeDate = (dateStr) => {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

exports.markStudentAttendance = async (req, res) => {
    try {
        const { classId, sectionId, date, records } = req.body; 
        
        const markedBy = req.user.id; 
        const attendanceDate = normalizeDate(date);

        if (!records || records.length === 0) {
            return res.status(400).json({ success: false, message: 'No attendance records provided!' });
        }

        const bulkOperations = records.map(record => ({
            updateOne: {
                filter: { student: record.student, date: attendanceDate },
                update: {
                    student: record.student,
                    class: classId,
                    section: sectionId,
                    date: attendanceDate,
                    status: record.status,
                    markedBy
                },
                upsert: true 
            }
        }));

        await StudentAttendance.bulkWrite(bulkOperations);

        res.status(200).json({
            success: true,
            message: 'Student attendance marked successfully!'
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getStudentAttendanceReport = async (req, res) => {
    try {
        const { classId, sectionId, date } = req.query;
        const attendanceDate = normalizeDate(date);

        const report = await StudentAttendance.find({
            class: classId,
            section: sectionId,
            date: attendanceDate
        })
        .populate({
            path: 'student',
            populate: { path: 'user', select: 'name email' } 
        });

        res.status(200).json({
            success: true,
            count: report.length,
            data: report
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.markStaffAttendance = async (req, res) => {
    try {
        const { date, records } = req.body; 
        
        const markedBy = req.user.id;
        const attendanceDate = normalizeDate(date);

        if (!records || records.length === 0) {
            return res.status(400).json({ success: false, message: 'No staff attendance records provided!' });
        }

        const bulkOperations = records.map(record => ({
            updateOne: {
                filter: { staff: record.staff, date: attendanceDate },
                update: {
                    staff: record.staff,
                    date: attendanceDate,
                    status: record.status,
                    markedBy
                },
                upsert: true
            }
        }));

        await StaffAttendance.bulkWrite(bulkOperations);

        res.status(200).json({
            success: true,
            message: 'Staff attendance marked successfully!'
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getStaffAttendanceReport = async (req, res) => {
    try {
        const { date } = req.query;
        const attendanceDate = normalizeDate(date);

        const report = await StaffAttendance.find({ date: attendanceDate })
            .populate('staff', 'name email role'); 

        res.status(200).json({
            success: true,
            count: report.length,
            data: report
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};