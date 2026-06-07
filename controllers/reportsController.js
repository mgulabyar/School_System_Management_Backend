const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const StudentAttendance = require('../models/StudentAttendance');
const FeeInvoice = require('../models/FeeInvoice');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments({ status: 'Active' });
        const totalTeachers = await Teacher.countDocuments({ status: 'Active' });
        const totalClasses = await Class.countDocuments();

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const todayPresent = await StudentAttendance.countDocuments({ date: today, status: 'Present' });
        const todayAbsent = await StudentAttendance.countDocuments({ date: today, status: 'Absent' });

        const currentMonth = new Date();
        currentMonth.setUTCHours(0, 0, 0, 0);
        currentMonth.setUTCDate(1); 

        const paidFeesSum = await FeeInvoice.aggregate([
            { $match: { month: currentMonth, status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const unpaidFeesSum = await FeeInvoice.aggregate([
            { $match: { month: currentMonth, status: 'Unpaid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                schoolOverview: {
                    totalStudents,
                    totalTeachers,
                    totalClasses
                },
                todayAttendance: {
                    present: todayPresent,
                    absent: todayAbsent,
                    totalMarked: todayPresent + todayAbsent
                },
                monthlyFeesSummary: {
                    collected: paidFeesSum[0] ? paidFeesSum[0].total : 0,
                    pending: unpaidFeesSum[0] ? unpaidFeesSum[0].total : 0
                }
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getUnifiedFeeReport = async (req, res) => {
    try {
        const { month, status } = req.query; 
        
        let query = {};
        if (month) {
            const d = new Date(month);
            d.setUTCHours(0, 0, 0, 0);
            d.setUTCDate(1);
            query.month = d;
        }
        if (status) {
            query.status = status; 
        }

        const invoices = await FeeInvoice.find(query)
            .populate({
                path: 'student',
                populate: { path: 'user', select: 'name email' } 
            })
            .populate('class', 'name');

        res.status(200).json({
            success: true,
            count: invoices.length,
            data: invoices
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};