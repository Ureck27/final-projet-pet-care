const mongoose = require('mongoose');
const Project = require('../models/Project');
const ProjectMessage = require('../models/ProjectMessage');
const User = require('../models/User');
require('dotenv').config();

const createSampleProjects = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Find any existing user to use for sample projects
    let user = await User.findOne();
    if (!user) {
      console.log('No users found in database. Please create a user first through the app.');
      return;
    }
    console.log(`Using existing user: ${user.email}`);

    // Create sample projects
    const sampleProjects = [
      {
        name: 'Pet Training Program',
        subtitle: 'Basic Obedience Training',
        progress: 60,
        status: 'inProgress',
        accentColor: '#f59e0b',
        bgColorClass: 'bg-amber-50 dark:bg-amber-900/20',
        participants: [
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&q=80&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=64&q=80&auto=format&fit=crop',
        ],
        daysLeft: 2,
        ownerId: user._id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        tags: ['training', 'obedience', 'dog'],
        description: 'Comprehensive training program for basic obedience commands',
        priority: 'high'
      },
      {
        name: 'Pet Health Check',
        subtitle: 'Veterinary Appointment',
        progress: 50,
        status: 'upcoming',
        accentColor: '#6366f1',
        bgColorClass: 'bg-indigo-50 dark:bg-indigo-900/20',
        participants: [
          'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=64&q=80&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=64&q=80&auto=format&fit=crop',
        ],
        daysLeft: 'Due Friday',
        ownerId: user._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        tags: ['health', 'veterinary', 'checkup'],
        description: 'Regular health checkup and vaccination update',
        priority: 'medium'
      },
      {
        name: 'Grooming Schedule',
        subtitle: 'Monthly Care Routine',
        progress: 100,
        status: 'completed',
        accentColor: '#10b981',
        bgColorClass: 'bg-emerald-50 dark:bg-emerald-900/20',
        participants: [
          'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=64&q=80&auto=format&fit=crop',
        ],
        daysLeft: 0,
        ownerId: user._id,
        completedAt: new Date(),
        tags: ['grooming', 'care', 'monthly'],
        description: 'Monthly grooming and hygiene maintenance',
        priority: 'low'
      }
    ];

    // Insert projects
    const createdProjects = await Project.insertMany(sampleProjects);
    console.log(`Created ${createdProjects.length} sample projects`);

    // Create sample messages for each project
    for (const project of createdProjects) {
      const messages = [
        {
          projectId: project._id,
          senderId: user._id,
          senderName: 'Dr. Sarah Johnson',
          senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&q=80&auto=format&fit=crop',
          text: 'Your pet\'s vaccination schedule is due next week. Please book an appointment.',
          messageType: 'reminder',
          priority: 'high',
          starred: true
        },
        {
          projectId: project._id,
          senderId: user._id,
          senderName: 'Mike Thompson',
          senderAvatar: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=96&q=80&auto=format&fit=crop',
          text: 'Training session went great! Your dog is making excellent progress.',
          messageType: 'update',
          priority: 'medium',
          starred: false
        }
      ];

      await ProjectMessage.insertMany(messages);
    }

    console.log('Created sample messages for all projects');
    console.log('Sample data creation completed successfully!');

  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createSampleProjects();
