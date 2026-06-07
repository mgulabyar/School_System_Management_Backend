const Class = require("../models/Class");
const Section = require("../models/Section");
const Subject = require("../models/Subject");
const Timetable = require("../models/Timetable");
const CalendarEvent = require("../models/CalendarEvent");
const Student = require("../models/Student");
exports.createSection = async (req, res) => {
  try {
    const { name } = req.body;
    const sectionExists = await Section.findOne({ name });
    if (sectionExists) {
      return res
        .status(400)
        .json({ success: false, message: "Section already exists!" });
    }
    const newSection = await Section.create({ name });
    res
      .status(201)
      .json({
        success: true,
        message: "Section created successfully!",
        data: newSection,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { name, sections } = req.body;
    const classExists = await Class.findOne({ name });
    if (classExists) {
      return res
        .status(400)
        .json({ success: false, message: "Class already exists!" });
    }
    const newClass = await Class.create({ name, sections });
    res
      .status(201)
      .json({
        success: true,
        message: "Class created successfully!",
        data: newClass,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("sections");
    res
      .status(200)
      .json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { name, code, classId } = req.body;

    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found!" });
    }

    const codeExists = await Subject.findOne({ code });
    if (codeExists) {
      return res
        .status(400)
        .json({ success: false, message: "Subject code already exists!" });
    }

    const newSubject = await Subject.create({
      name,
      code,
      class: classId,
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully and linked to Class!",
      data: newSubject,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSubjectsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const subjects = await Subject.find({ class: classId }).populate("class");
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createTimetableSlot = async (req, res) => {
  try {
    const {
      classId,
      sectionId,
      subjectId,
      teacherId,
      day,
      startTime,
      endTime,
    } = req.body;

    const slot = await Timetable.create({
      class: classId,
      section: sectionId,
      subject: subjectId,
      teacher: teacherId,
      day,
      startTime,
      endTime,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Timetable slot created successfully!",
        data: slot,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    const { classId, sectionId } = req.params;
    const schedule = await Timetable.find({
      class: classId,
      section: sectionId,
    })
      .populate("subject", "name code")
      .populate({
        path: "teacher",
        populate: { path: "user", select: "name" },
      });

    res
      .status(200)
      .json({ success: true, count: schedule.length, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createCalendarEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, type } = req.body;

    const event = await CalendarEvent.create({
      title,
      description,
      startDate,
      endDate,
      type,
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Calendar event/holiday created successfully!",
        data: event,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCalendarEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find().sort({ startDate: 1 });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sections } = req.body; 

        const updatedClass = await Class.findByIdAndUpdate(
            id,
            { name, sections },
            { new: true, runValidators: true }
        ).populate('sections');

        if (!updatedClass) {
            return res.status(404).json({ success: false, message: 'Class not found!' });
        }

        res.status(200).json({
            success: true,
            message: 'Class updated successfully!',
            data: updatedClass
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        const studentExists = await Student.findOne({ class: id });
        if (studentExists) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete Class! Enrolled students exist in this class. Remove/transfer students first.'
            });
        }

        const deletedClass = await Class.findByIdAndDelete(id);
        if (!deletedClass) {
            return res.status(404).json({ success: false, message: 'Class not found!' });
        }

        res.status(200).json({
            success: true,
            message: 'Class deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, classId } = req.body;

        if (code) {
            const codeExists = await Subject.findOne({ code, _id: { $ne: id } });
            if (codeExists) {
                return res.status(400).json({ success: false, message: 'Subject code already exists!' });
            }
        }

        const updatedSubject = await Subject.findByIdAndUpdate(
            id,
            { name, code, class: classId },
            { new: true, runValidators: true }
        ).populate('class');

        if (!updatedSubject) {
            return res.status(404).json({ success: false, message: 'Subject not found!' });
        }

        res.status(200).json({
            success: true,
            message: 'Subject updated successfully!',
            data: updatedSubject
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSubject = await Subject.findByIdAndDelete(id);
        if (!deletedSubject) {
            return res.status(404).json({ success: false, message: 'Subject not found!' });
        }

        res.status(200).json({
            success: true,
            message: 'Subject deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateTimetableSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const { classId, sectionId, subjectId, teacherId, day, startTime, endTime } = req.body;

        const updatedSlot = await Timetable.findByIdAndUpdate(
            id,
            { class: classId, section: sectionId, subject: subjectId, teacher: teacherId, day, startTime, endTime },
            { new: true, runValidators: true }
        );

        if (!updatedSlot) {
            return res.status(404).json({ success: false, message: 'Timetable slot not found!' });
        }

        res.status(200).json({
            success: true,
            message: 'Timetable slot updated successfully!',
            data: updatedSlot
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteTimetableSlot = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSlot = await Timetable.findByIdAndDelete(id);
        if (!deletedSlot) {
            return res.status(404).json({ success: false, message: 'Timetable slot not found!' });
        }

        res.status(200).json({
            success: true,
            message: 'Timetable slot deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};