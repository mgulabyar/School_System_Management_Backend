const Notification = require('../models/Notification');

exports.sendNotification = async (req, res) => {
    try {
        const { recipientId, recipientPhone, message, channel } = req.body;
        const sender = req.user.id; 

        if (!recipientPhone || !message || !channel) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide recipientPhone, message, and channel!' 
            });
        }

   
        console.log(`\n COMMUNICATION SIMULATION `);
        console.log(`Channel: [${channel}]`);
        console.log(`To: ${recipientPhone}`);
        console.log(`Message: "${message}"`);
        console.log(`Status: [Sent Successfully]`);
        console.log(`-----------------------------------\n`);
        

        const log = await Notification.create({
            sender,
            recipient: recipientId || null, 
            recipientPhone,
            message,
            channel,
            status: 'Sent'
        });

        res.status(201).json({
            success: true,
            message: `${channel} notification sent (Simulated) and logged successfully!`,
            data: log
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getNotificationLogs = async (req, res) => {
    try {
        const logs = await Notification.find()
            .populate('sender', 'name email role') 
            .populate('recipient', 'name email role') 
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};