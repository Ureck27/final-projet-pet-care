const CaregiverApplication = require('../models/CaregiverApplication');
const User = require('../models/User');
const { sendAdminNotification } = require('../services/emailService');

// @desc    Submit caregiver application
// @route   POST /api/caregiver/apply
const submitCaregiverApplication = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      experience,
      petTypes,
      certifications,
      bio,
      profileImage,
      idDocument
    } = req.body;

    // Process uploaded files
    let profileImageUrl = null;
    let idDocumentUrl = null;
    
    if (req.files) {
      if (req.files.profileImage && req.files.profileImage.length > 0) {
        profileImageUrl = `/uploads/trainers/${req.files.profileImage[0].filename}`;
      }
      if (req.files.idDocument && req.files.idDocument.length > 0) {
        idDocumentUrl = `/uploads/trainers/${req.files.idDocument[0].filename}`;
      }
    }

    // Check if user already has a pending application
    const existingApplication = await CaregiverApplication.findOne({
      email,
      status: 'pending'
    });

    if (existingApplication) {
      return res.status(400).json({ 
        message: 'You already have a pending application. Please wait for it to be reviewed.' 
      });
    }

    const application = await CaregiverApplication.create({
      name,
      email,
      phone,
      location,
      experience,
      petTypes,
      certifications,
      bio,
      profileImage: profileImageUrl,
      idDocument: idDocumentUrl,
      userId: req.user?._id
    });

    // Send admin notification
    await sendAdminNotification(
      'New Caregiver Application',
      `
      <p><strong>A new caregiver application has been submitted:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Location:</strong> ${location}</li>
        <li><strong>Experience:</strong> ${experience}</li>
        <li><strong>Pet Types:</strong> ${petTypes.join(', ')}</li>
        <li><strong>Application Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>
      <p>Please review this application in the admin dashboard.</p>
      `
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Error submitting caregiver application:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all caregiver applications (admin only)
// @route   GET /api/caregiver/pending
const getCaregiverApplications = async (req, res) => {
  try {
    const { status } = req.query;
    
    let filter = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const applications = await CaregiverApplication.find(filter)
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching caregiver applications:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve caregiver application
// @route   PUT /api/caregiver/approve/:id
const approveCaregiverApplication = async (req, res) => {
  try {
    const application = await CaregiverApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application status
    application.status = 'approved';
    await application.save();

    // Update user role to caregiver if user exists
    if (application.userId) {
      await User.findByIdAndUpdate(application.userId, { role: 'caregiver' });
    }

    // Send admin notification
    await sendAdminNotification(
      'Caregiver Application Approved',
      `
      <p><strong>Caregiver application has been approved:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${application.name}</li>
        <li><strong>Email:</strong> ${application.email}</li>
        <li><strong>Location:</strong> ${application.location}</li>
        <li><strong>Approval Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>
      `
    );

    res.json({ 
      message: 'Caregiver application approved successfully',
      application 
    });
  } catch (error) {
    console.error('Error approving caregiver application:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject caregiver application
// @route   PUT /api/caregiver/reject/:id
const rejectCaregiverApplication = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const application = await CaregiverApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application status
    application.status = 'rejected';
    application.rejectionReason = rejectionReason || 'Application does not meet requirements';
    await application.save();

    // Send admin notification
    await sendAdminNotification(
      'Caregiver Application Rejected',
      `
      <p><strong>Caregiver application has been rejected:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${application.name}</li>
        <li><strong>Email:</strong> ${application.email}</li>
        <li><strong>Location:</strong> ${application.location}</li>
        <li><strong>Rejection Reason:</strong> ${application.rejectionReason}</li>
        <li><strong>Rejection Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>
      `
    );

    res.json({ 
      message: 'Caregiver application rejected successfully',
      application 
    });
  } catch (error) {
    console.error('Error rejecting caregiver application:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete caregiver application
// @route   DELETE /api/caregiver/delete/:id
const deleteCaregiverApplication = async (req, res) => {
  try {
    const application = await CaregiverApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await CaregiverApplication.findByIdAndDelete(req.params.id);

    // Send admin notification
    await sendAdminNotification(
      'Caregiver Application Deleted',
      `
      <p><strong>Caregiver application has been deleted:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${application.name}</li>
        <li><strong>Email:</strong> ${application.email}</li>
        <li><strong>Location:</strong> ${application.location}</li>
        <li><strong>Deletion Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>
      `
    );

    res.json({ message: 'Caregiver application deleted successfully' });
  } catch (error) {
    console.error('Error deleting caregiver application:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get caregiver application statistics (admin only)
// @route   GET /api/caregiver/stats
const getCaregiverStats = async (req, res) => {
  try {
    const stats = await CaregiverApplication.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statsMap = {
      pending: 0,
      approved: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      statsMap[stat._id] = stat.count;
    });

    res.json({
      totalApplications: statsMap.pending + statsMap.approved + statsMap.rejected,
      pendingApplications: statsMap.pending,
      approvedCaregivers: statsMap.approved,
      rejectedApplications: statsMap.rejected
    });
  } catch (error) {
    console.error('Error fetching caregiver stats:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitCaregiverApplication,
  getCaregiverApplications,
  approveCaregiverApplication,
  rejectCaregiverApplication,
  deleteCaregiverApplication,
  getCaregiverStats
};
