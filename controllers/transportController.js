const Vehicle = require('../models/Vehicle');
const Route = require('../models/Route');
const TransportAllocation = require('../models/TransportAllocation');

exports.addVehicle = async (req, res) => {
    try {
        const { vehicleNo, registrationNo, driverName, driverPhone, capacity } = req.body;

        const vehicleExists = await Vehicle.findOne({ vehicleNo });
        if (vehicleExists) {
            return res.status(400).json({ success: false, message: 'Vehicle number already exists!' });
        }

        const newVehicle = await Vehicle.create({
            vehicleNo,
            registrationNo,
            driverName,
            driverPhone,
            capacity
        });

        res.status(201).json({
            success: true,
            message: 'Vehicle added successfully!',
            data: newVehicle
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createRoute = async (req, res) => {
    try {
        const { routeName, routeCost, stops } = req.body;

        const routeExists = await Route.findOne({ routeName });
        if (routeExists) {
            return res.status(400).json({ success: false, message: 'Route name already exists!' });
        }

        const newRoute = await Route.create({
            routeName,
            routeCost,
            stops
        });

        res.status(201).json({
            success: true,
            message: 'Route created successfully!',
            data: newRoute
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.allocateTransport = async (req, res) => {
    try {
        const { studentId, routeId, vehicleId } = req.body;

        const alreadyAllocated = await TransportAllocation.findOne({ student: studentId });
        if (alreadyAllocated) {
            return res.status(400).json({ success: false, message: 'This student is already allocated to a transport route!' });
        }

        const allocation = await TransportAllocation.create({
            student: studentId,
            route: routeId,
            vehicle: vehicleId
        });

        res.status(201).json({
            success: true,
            message: 'Transport allocated to student successfully!',
            data: allocation
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getTransportReport = async (req, res) => {
    try {
        const list = await TransportAllocation.find()
            .populate({
                path: 'student',
                populate: { path: 'user', select: 'name email' } 
            })
            .populate('route') 
            .populate('vehicle'); 

        res.status(200).json({
            success: true,
            count: list.length,
            data: list
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { vehicleNo, registrationNo, driverName, driverPhone, capacity } = req.body;

        const updated = await Vehicle.findByIdAndUpdate(
            id,
            { vehicleNo, registrationNo, driverName, driverPhone, capacity },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Vehicle not found!' });
        }

        res.status(200).json({ success: true, message: 'Vehicle details updated successfully!', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        await Vehicle.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Vehicle deleted successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const { routeName, routeCost, stops } = req.body;

        const updated = await Route.findByIdAndUpdate(
            id,
            { routeName, routeCost, stops },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Route not found!' });
        }

        res.status(200).json({ success: true, message: 'Route updated successfully!', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;
        await Route.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Route deleted successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.cancelAllocation = async (req, res) => {
    try {
        const { id } = req.params; 

        const deleted = await TransportAllocation.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Transport allocation record not found!' });
        }

        res.status(200).json({ success: true, message: 'Student transport allocation cancelled successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
