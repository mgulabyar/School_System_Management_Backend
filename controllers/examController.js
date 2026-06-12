const Exam = require('../models/Exam');
const ExamMark = require('../models/ExamMark');
const Student = require('../models/Student');

exports.createExam = async (req, res) => {
    try {
        const { name, classId } = req.body;

        const examExists = await Exam.findOne({ name, class: classId });
        if (examExists) {
            return res.status(400).json({ success: false, message: 'This exam is already scheduled for this class!' });
        }

        const newExam = await Exam.create({
            name,
            class: classId
        });

        res.status(201).json({
            success: true,
            message: 'Exam scheduled successfully!',
            data: newExam
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate('class', 'name');
        res.status(200).json({
            success: true,
            count: exams.length,
            data: exams
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.enterMarks = async (req, res) => {
    try {
        const { examId, subjectId, records } = req.body;
        const markedBy = req.user.id;

        if (!records || records.length === 0) {
            return res.status(400).json({ success: false, message: 'No marks records provided!' });
        }

        const bulkOperations = records.map(record => ({
            updateOne: {
                filter: { exam: examId, student: record.student, subject: subjectId },
                update: {
                    exam: examId,
                    student: record.student,
                    subject: subjectId,
                    obtainedMarks: record.obtainedMarks,
                    totalMarks: record.totalMarks || 100,
                    markedBy
                },
                upsert: true
            }
        }));

        await ExamMark.bulkWrite(bulkOperations);

        res.status(200).json({
            success: true,
            message: 'Exam marks entered successfully!'
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getStudentReportCard = async (req, res) => {
    try {
        const { studentId, examId } = req.params;

        const student = await Student.findById(studentId).populate('user', 'name');
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found!' });
        }

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ success: false, message: 'Exam not found!' });
        }

        const marks = await ExamMark.find({ student: studentId, exam: examId })
            .populate('subject', 'name code');

        if (marks.length === 0) {
            return res.status(404).json({ success: false, message: 'No marks entered for this exam yet!' });
        }

        let totalObtained = 0;
        let totalMaximum = 0;

        const subjectsResult = marks.map(record => {
            totalObtained += record.obtainedMarks;
            totalMaximum += record.totalMarks;
            const percentage = ((record.obtainedMarks / record.totalMarks) * 100).toFixed(2);
            
            return {
                subjectName: record.subject.name,
                subjectCode: record.subject.code,
                obtained: record.obtainedMarks,
                total: record.totalMarks,
                percentage: `${percentage}%`
            };
        });

        const overallPercentage = ((totalObtained / totalMaximum) * 100).toFixed(2);

        res.status(200).json({
            success: true,
            data: {
                studentName: student.user.name,
                admissionNo: student.admissionNo,
                examName: exam.name,
                results: subjectsResult,
                summary: {
                    totalObtained,
                    totalMaximum,
                    percentage: `${overallPercentage}%`
                }
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getMeritList = async (req, res) => {
    try {
        const { examId } = req.params;

        const allMarks = await ExamMark.find({ exam: examId })
            .populate({
                path: 'student',
                populate: { path: 'user', select: 'name' }
            });

        if (allMarks.length === 0) {
            return res.status(404).json({ success: false, message: 'No marks registered for this exam yet!' });
        }

        const studentScores = {};
        allMarks.forEach(record => {
            if (record.student && record.student.user) {
                const sId = record.student._id.toString();
                if (!studentScores[sId]) {
                    studentScores[sId] = {
                        name: record.student.user.name,
                        admissionNo: record.student.admissionNo,
                        obtained: 0,
                        total: 0
                    };
                }
                studentScores[sId].obtained += record.obtainedMarks;
                studentScores[sId].total += record.totalMarks;
            }
        });

        const meritList = Object.values(studentScores).map(item => {
            const percentage = ((item.obtained / item.total) * 100).toFixed(2);
            return {
                ...item,
                percentage: parseFloat(percentage)
            };
        }).sort((a, b) => b.percentage - a.percentage);

        res.status(200).json({
            success: true,
            examId,
            count: meritList.length,
            meritList
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};