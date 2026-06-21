const Transaction = require('../models/Transaction');

exports.addTransaction = async (req, res) => {
    try {
        const { type, category, amount, date, description, referenceId } = req.body;
        const markedBy = req.user.id; 

        const newTransaction = await Transaction.create({
            type,
            category,
            amount,
            date: date || new Date(),
            description,
            referenceId,
            markedBy
        });

        res.status(201).json({
            success: true,
            message: `${type} transaction recorded successfully!`,
            data: newTransaction
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getFinancialReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide both startDate and endDate! (e.g., YYYY-MM-DD)' 
            });
        }

        const query = {
            date: {
                $gte: new Date(startDate), 
                $lte: new Date(endDate)  
            }
        };

        const transactions = await Transaction.find(query)
            .populate('markedBy', 'name email role') 
            .sort({ date: -1 }); 

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(t => {
            if (t.type === 'Income') {
                totalIncome += t.amount;
            } else if (t.type === 'Expense') {
                totalExpense += t.amount;
            }
        });

        const netBalance = totalIncome - totalExpense; 

        res.status(200).json({
            success: true,
            count: transactions.length,
            summary: {
                totalIncome,
                totalExpense,
                netBalance,
                status: netBalance >= 0 ? 'Surplus (Profit)' : 'Deficit (Loss)'
            },
            data: transactions
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


