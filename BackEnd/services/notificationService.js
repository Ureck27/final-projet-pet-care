const nodemailer = require('nodemailer');
const User = require('../models/User');
const RoutineLog = require('../models/RoutineLog');
const Pet = require('../models/Pet');

class NotificationService {
  constructor() {
    // Configure email transporter (use environment variables in production)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
  }

  /**
   * Send notification when AI detects urgent pet status
   * @param {string} routineLogId - ID of the routine log with urgent status
   */
  async sendUrgentAlert(routineLogId) {
    try {
      // Get routine log details
      const routineLog = await RoutineLog.findById(routineLogId)
        .populate('petId')
        .populate('trainerId');

      if (!routineLog) {
        throw new Error('Routine log not found');
      }

      // Check if status requires urgent notification
      const urgentStatuses = ['injured', 'sick', 'abnormal'];
      if (!urgentStatuses.includes(routineLog.aiStatus)) {
        return { success: false, message: 'Status does not require urgent notification' };
      }

      // Get pet owner details
      const pet = await Pet.findById(routineLog.petId).populate('ownerId');
      if (!pet || !pet.ownerId) {
        throw new Error('Pet owner not found');
      }

      // Get admin users
      const adminUsers = await User.find({ role: 'admin' });

      // Prepare notification content
      const notificationData = {
        petName: pet.name,
        petType: pet.type,
        status: routineLog.aiStatus,
        aiMessage: routineLog.aiMessage,
        trainerName: routineLog.trainerId.name || 'Trainer',
        timestamp: routineLog.createdAt,
        photoUrl: routineLog.photoUrl
      };

      // Send notifications to different recipients
      const notifications = [];

      // 1. Send to pet owner
      const ownerNotification = await this.sendEmailToOwner(pet.ownerId, notificationData);
      notifications.push({ recipient: 'owner', ...ownerNotification });

      // 2. Send to admin users
      for (const admin of adminUsers) {
        const adminNotification = await this.sendEmailToAdmin(admin, notificationData);
        notifications.push({ recipient: 'admin', adminId: admin._id, ...adminNotification });
      }

      // 3. Send to trainer (if different from the assigned trainer)
      const assignedTrainerId = routineLog.petId.trainerId;
      if (assignedTrainerId && routineLog.trainerId._id.toString() !== assignedTrainerId.toString()) {
        const assignedTrainer = await User.findById(assignedTrainerId);
        if (assignedTrainer) {
          const trainerNotification = await this.sendEmailToTrainer(assignedTrainer, notificationData);
          notifications.push({ recipient: 'trainer', trainerId: assignedTrainer._id, ...trainerNotification });
        }
      }

      return {
        success: true,
        message: 'Urgent alerts sent successfully',
        notifications: notifications
      };

    } catch (error) {
      console.error('Error sending urgent alert:', error);
      return {
        success: false,
        message: 'Failed to send urgent alert',
        error: error.message
      };
    }
  }

  /**
   * Send email to pet owner
   */
  async sendEmailToOwner(owner, data) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: owner.email,
        subject: `🚨 Urgent Alert: ${data.petName}'s Health Status`,
        html: this.generateOwnerEmailTemplate(data)
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send email to admin user
   */
  async sendEmailToAdmin(admin, data) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: `🚨 Admin Alert: Urgent Pet Health Issue - ${data.petName}`,
        html: this.generateAdminEmailTemplate(data)
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send email to trainer
   */
  async sendEmailToTrainer(trainer, data) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: trainer.email,
        subject: `🚨 Alert: ${data.petName} Health Status Update`,
        html: this.generateTrainerEmailTemplate(data)
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate email template for pet owners
   */
  generateOwnerEmailTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Urgent Pet Health Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #ff4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .alert-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .pet-info { background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚨 Urgent Health Alert</h1>
          <p>Important update about your pet's well-being</p>
        </div>
        
        <div class="content">
          <div class="alert-box">
            <h2>⚠️ Immediate Attention Required</h2>
            <p>Our AI system has detected a potential health issue with <strong>${data.petName}</strong>.</p>
          </div>

          <div class="pet-info">
            <h3>Pet Details:</h3>
            <ul>
              <li><strong>Name:</strong> ${data.petName}</li>
              <li><strong>Type:</strong> ${data.petType}</li>
              <li><strong>Status:</strong> <span style="color: #ff4444; font-weight: bold;">${data.status.toUpperCase()}</span></li>
              <li><strong>Detected:</strong> ${new Date(data.timestamp).toLocaleString()}</li>
            </ul>
          </div>

          <div>
            <h3>AI Analysis:</h3>
            <p><em>"${data.aiMessage}"</em></p>
          </div>

          <div>
            <h3>Reported By:</h3>
            <p>${data.trainerName} (Trainer)</p>
          </div>

          <div>
            <h3>Recommended Actions:</h3>
            <ul>
              <li>📞 Contact your veterinarian immediately</li>
              <li>🏥 Visit an emergency pet clinic if needed</li>
              <li>📱 Monitor your pet closely for any changes</li>
              <li>💬 Contact the trainer for more details</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated message from the Pet Care Platform. Please do not reply to this email.</p>
          <p>If you believe this is an error, please contact our support team immediately.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate email template for admin users
   */
  generateAdminEmailTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Admin Alert: Urgent Pet Health Issue</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #ff4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .alert-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .admin-info { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚨 Admin Alert</h1>
          <p>Urgent pet health issue detected</p>
        </div>
        
        <div class="content">
          <div class="alert-box">
            <h2>⚠️ Platform Alert: Urgent Pet Health Issue</h2>
            <p>Immediate admin attention required for the following case:</p>
          </div>

          <div class="admin-info">
            <h3>Incident Details:</h3>
            <ul>
              <li><strong>Pet Name:</strong> ${data.petName}</li>
              <li><strong>Pet Type:</strong> ${data.petType}</li>
              <li><strong>Status:</strong> <span style="color: #ff4444; font-weight: bold;">${data.status.toUpperCase()}</span></li>
              <li><strong>AI Analysis:</strong> "${data.aiMessage}"</li>
              <li><strong>Detected:</strong> ${new Date(data.timestamp).toLocaleString()}</li>
              <li><strong>Reporting Trainer:</strong> ${data.trainerName}</li>
            </ul>
          </div>

          <div>
            <h3>Admin Actions Required:</h3>
            <ul>
              <li>👀 Monitor the situation through admin dashboard</li>
              <li>📞 Contact the pet owner to offer support</li>
              <li>🤝 Coordinate with the trainer for follow-up</li>
              <li>📊 Document the incident for platform records</li>
              <li>🔔 Consider platform-wide health alerts if needed</li>
            </ul>
          </div>

          <div>
            <p><strong>Access Admin Dashboard:</strong></p>
            <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3000/admin-dashboard'}" 
               style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View in Admin Dashboard
            </a>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated admin alert from the Pet Care Platform.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate email template for trainers
   */
  generateTrainerEmailTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pet Health Status Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #ff4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .alert-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚨 Health Status Alert</h1>
          <p>Pet health update notification</p>
        </div>
        
        <div class="content">
          <div class="alert-box">
            <h2>⚠️ Pet Health Alert</h2>
            <p>Important update about ${data.petName}'s health status:</p>
          </div>

          <div>
            <h3>Alert Details:</h3>
            <ul>
              <li><strong>Pet:</strong> ${data.petName} (${data.petType})</li>
              <li><strong>Status:</strong> <span style="color: #ff4444; font-weight: bold;">${data.status.toUpperCase()}</span></li>
              <li><strong>AI Analysis:</strong> "${data.aiMessage}"</li>
              <li><strong>Detected:</strong> ${new Date(data.timestamp).toLocaleString()}</li>
            </ul>
          </div>

          <div>
            <h3>Next Steps:</h3>
            <ul>
              <li>📞 Contact the pet owner immediately</li>
              <li>📋 Document your observations</li>
              <li>🏥 Recommend veterinary consultation</li>
              <li>📊 Update pet records with this incident</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated message from the Pet Care Platform.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Test email configuration
   */
  async testEmailConfiguration() {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send test to self
        subject: 'Test Email - Pet Care Platform',
        html: '<h1>Test Email</h1><p>This is a test email from the Pet Care Platform notification system.</p>'
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new NotificationService();
