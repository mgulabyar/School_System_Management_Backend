const FeeStructure = require('../models/FeeStructure');
const FeeInvoice = require('../models/FeeInvoice');
const Student = require('../models/Student');

const normalizeMonth = (dateStr) => {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(1); 
    return d;
};

exports.setupFeeStructure = async (req, res) => {
    try {
        const { classId, tuitionFee, admissionFee, otherCharges } = req.body;

        const structure = await FeeStructure.findOneAndUpdate(
            { class: classId },
            { class: classId, tuitionFee, admissionFee, otherCharges },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Class Fee Structure setup successfully!',
            data: structure
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.generateMonthlyFees = async (req, res) => {
    try {
        const { classId, month } = req.body;
        const targetMonth = normalizeMonth(month);

        const structure = await FeeStructure.findOne({ class: classId });
        if (!structure) {
            return res.status(404).json({ 
                success: false, 
                message: 'No Fee Structure defined for this class yet!' 
            });
        }

        const students = await Student.find({ class: classId, status: 'Active' });
        if (students.length === 0) {
            return res.status(404).json({ success: false, message: 'No active students found in this class!' });
        }

        const totalAmount = structure.tuitionFee + structure.otherCharges;
        
        const bulkOperations = students.map(student => ({
            updateOne: {
                filter: { student: student._id, month: targetMonth },
                update: {
                    student: student._id,
                    class: classId,
                    month: targetMonth,
                    tuitionFee: structure.tuitionFee,
                    otherCharges: structure.otherCharges,
                    totalAmount,
                    status: 'Unpaid'
                },
                upsert: true
            }
        }));

        await FeeInvoice.bulkWrite(bulkOperations);

        res.status(200).json({
            success: true,
            message: `Monthly fees generated successfully for ${students.length} students!`
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.collectFee = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const invoice = await FeeInvoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found!' });
        }

        if (invoice.status === 'Paid') {
            return res.status(400).json({ success: false, message: 'Fee already paid for this invoice!' });
        }

        invoice.status = 'Paid';
        invoice.paymentDate = new Date();
        await invoice.save();

        res.status(200).json({
            success: true,
            message: 'Fee collected and invoice updated successfully!',
            data: invoice
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getDefaultersList = async (req, res) => {
    try {
        const { classId, month } = req.query;
        const targetMonth = normalizeMonth(month);

        const defaulters = await FeeInvoice.find({
            class: classId,
            month: targetMonth,
            status: 'Unpaid'
        })
        .populate({
            path: 'student',
            populate: { path: 'user', select: 'name email' } 
        });

        res.status(200).json({
            success: true,
            count: defaulters.length,
            data: defaulters
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.voidInvoice = async (req, res) => {
    try {
        const { id } = req.params; 

        const invoice = await FeeInvoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found!' });
        }

        await FeeInvoice.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Fee invoice cancelled and deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};