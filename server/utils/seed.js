import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Mongoose Models
import { Customer } from '../models/Customer.js';
import { Job } from '../models/Job.js';
import { WorkflowEvent } from '../models/WorkflowEvent.js';
import { FollowUp } from '../models/FollowUp.js';
import { Notification } from '../models/Notification.js';

// Setup dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/solvex_flow';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB.');

    // Clear existing data
    await Customer.deleteMany();
    await Job.deleteMany();
    await WorkflowEvent.deleteMany();
    await FollowUp.deleteMany();
    await Notification.deleteMany();
    console.log('[Seeder] Wiped all collections.');

    // 1. Create Customers
    const customers = await Customer.create([
      { name: 'Alice Cooper', phone: '+1 (555) 304-9844', email: 'alice@cooper.com', address: '742 Evergreen Terrace, Springfield', healthScore: 95 },
      { name: 'Bob Marley', phone: '+1 (555) 832-2300', email: 'bob@marley.com', address: '1203 Diablo Ave, San Jose', healthScore: 100 },
      { name: 'Charlie Brown', phone: '+1 (555) 762-1100', email: 'charlie@peanuts.com', address: '409 Pumpkin Patch Road, Pinecrest', healthScore: 90 },
      { name: 'David Beckham', phone: '+1 (555) 543-0909', email: 'david@beckham.com', address: '32 Wembley Way, London Line', healthScore: 80 },
      { name: 'Robert Downey', phone: '+1 (555) 902-8811', email: 'robert@downey.com', address: '109 Malibu Road, Cliffside', healthScore: 100 },
      { name: 'Scarlett Johansson', phone: '+1 (555) 201-9988', email: 'scarlett@johansson.com', address: '66 Avengers Ave, New York', healthScore: 100 },
      { name: 'Chris Evans', phone: '+1 (555) 762-4422', email: 'chris@evans.com', address: '1776 Liberty St, Boston', healthScore: 95 }
    ]);
    console.log(`[Seeder] Seeded ${customers.length} Customers.`);

    // Map by name for easier lookup
    const custMap = {};
    customers.forEach(c => {
      custMap[c.name] = c._id;
    });

    // 2. Create Jobs
    const jobs = [
      { customer: custMap['Alice Cooper'], technician: 'Dave Miller', serviceType: 'AC Preventive Maintenance', priority: 'low', currentStage: 3, status: 'completed' },
      { customer: custMap['Bob Marley'], technician: 'Sarah Connor', serviceType: 'Compressor Repair', priority: 'critical', currentStage: 2, status: 'in-progress' },
      { customer: custMap['Charlie Brown'], technician: 'Alex Rivera', serviceType: 'Air Filter Replacements', priority: 'medium', currentStage: 0, status: 'pending' },
      { customer: custMap['David Beckham'], technician: 'Dave Miller', serviceType: 'Duct Overhaul & Clean', priority: 'low', currentStage: 0, status: 'cancelled' },
      { customer: custMap['Robert Downey'], technician: 'Sarah Connor', serviceType: 'Thermostat Installation', priority: 'medium', currentStage: 2, status: 'failed' }
    ];

    const seededJobs = await Job.create(jobs);
    console.log(`[Seeder] Seeded ${seededJobs.length} Jobs.`);

    // 3. Create Workflow Events for Timeline tracking
    const today = new Date();
    const eventTime = (offsetHours) => new Date(today.getTime() - offsetHours * 60 * 60 * 1000);

    const workflowEvents = [
      // Alice Cooper (Completed)
      { job: seededJobs[0]._id, stage: 0, notes: 'Workorder registered via portal.', timestamp: eventTime(4), performedBy: 'System Auto Portal' },
      { job: seededJobs[0]._id, stage: 1, notes: 'Technician Dave Miller dispatched.', timestamp: eventTime(3), performedBy: 'Alex Rivera' },
      { job: seededJobs[0]._id, stage: 2, notes: 'Dave Miller checked-in. Diagnostic complete.', timestamp: eventTime(2), performedBy: 'Dave Miller' },
      { job: seededJobs[0]._id, stage: 3, notes: 'Job marked resolved. Invoice auto-generated.', timestamp: eventTime(1), performedBy: 'Dave Miller' },
      
      // Bob Marley (In Progress - Stage 2: Diagnostics)
      { job: seededJobs[1]._id, stage: 0, notes: 'Workorder registered. Premium urgency tier.', timestamp: eventTime(3), performedBy: 'System Auto Portal' },
      { job: seededJobs[1]._id, stage: 1, notes: 'Technician Sarah Connor dispatched.', timestamp: eventTime(2), performedBy: 'Alex Rivera' },
      { job: seededJobs[1]._id, stage: 2, notes: 'On-site diagnostic checked. Leak located.', timestamp: eventTime(1), performedBy: 'Sarah Connor' },

      // Charlie Brown (Pending - Stage 0)
      { job: seededJobs[2]._id, stage: 0, notes: 'Workorder created. Dispatch awaiting crew assign.', timestamp: eventTime(2), performedBy: 'Alex Rivera' },

      // David Beckham (Cancelled)
      { job: seededJobs[3]._id, stage: 0, notes: 'Job created.', timestamp: eventTime(10), performedBy: 'System Auto Portal' },
      { job: seededJobs[3]._id, stage: 0, notes: 'Workorder cancelled per customer request.', timestamp: eventTime(9), performedBy: 'Alex Rivera' },

      // Robert Downey (Failed SLA)
      { job: seededJobs[4]._id, stage: 0, notes: 'Job created.', timestamp: eventTime(26), performedBy: 'System Auto Portal' },
      { job: seededJobs[4]._id, stage: 1, notes: 'Sarah Connor dispatched.', timestamp: eventTime(25), performedBy: 'Alex Rivera' },
      { job: seededJobs[4]._id, stage: 2, notes: 'Check-in window overdue. SLA threshold breached.', timestamp: eventTime(23), performedBy: 'System Workflow Engine' }
    ];

    await WorkflowEvent.create(workflowEvents);
    console.log(`[Seeder] Seeded ${workflowEvents.length} Workflow Events.`);

    // 4. Create Follow-ups
    const followUps = [
      { customer: custMap['Robert Downey'], job: seededJobs[4]._id, type: 'feedback-call', scheduledDate: new Date(today.getTime() + 2 * 60 * 60 * 1000), status: 'pending' },
      { customer: custMap['Scarlett Johansson'], job: seededJobs[1]._id, type: 'satisfaction-check', scheduledDate: new Date(today.getTime() + 18 * 60 * 60 * 1000), status: 'pending' },
      { customer: custMap['Chris Evans'], job: seededJobs[0]._id, type: 'maintenance-reminder', scheduledDate: new Date(today.getTime() + 48 * 60 * 60 * 1000), status: 'pending' }
    ];

    await FollowUp.create(followUps);
    console.log(`[Seeder] Seeded ${followUps.length} FollowUps.`);

    // 5. Create Notification Logs
    const notifications = [
      { title: 'Database Initialized', message: 'SolveX Flow core seeding successfully run.', read: false },
      { title: 'SLA Deviation Trigger', message: 'Job #1028 missed technician check-in SLA timeline.', read: true }
    ];

    await Notification.create(notifications);
    console.log(`[Seeder] Seeded initial Notification logs.`);

    console.log('[Seeder] Database seeding finished successfully.');
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error(`[Seeder] Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
