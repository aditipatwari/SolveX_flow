import { Notification } from '../models/Notification.js';
import { FollowUp } from '../models/FollowUp.js';

export const handleJobStatusChange = async (job) => {
  try {
    // 1. Rule: Job Completed
    if (job.status === 'completed') {
      console.log(`[Automation Engine] Triggering completion rules for job #${job.id || job._id}`);
      
      // A. Generate Invoice Event Notification
      await Notification.create({
        title: 'Invoice Generated',
        message: `Stripe invoice processed successfully for ${job.serviceType} ($${job.serviceType.toLowerCase().includes('compressor') ? '420' : '150'}).`
      });

      // B. Schedule Feedback Call (1 day later)
      const oneDayLater = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await FollowUp.create({
        customer: job.customer,
        job: job._id,
        type: 'feedback-call',
        scheduledDate: oneDayLater,
        status: 'pending'
      });

      // C. Schedule Maintenance Reminder (6 months later)
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      await FollowUp.create({
        customer: job.customer,
        job: job._id,
        type: 'maintenance-reminder',
        scheduledDate: sixMonthsLater,
        status: 'pending'
      });

      // D. Notify Customer Notification Simulation
      await Notification.create({
        title: 'Customer Notified',
        message: `AC completed receipt email dispatched to customer.`
      });
    }

    // 2. Rule: Job Failed / Low Rating / SLA Exceeded
    if (job.status === 'failed') {
      console.log(`[Automation Engine] Triggering SLA escalation rules for job #${job.id || job._id}`);
      
      // A. Create Escalation Task
      await Notification.create({
        title: 'SLA Escalation Alert',
        message: `Job #${job.id || job._id} failed check-in. Dispatch crew flagged for priority review.`
      });

      // B. Notify Owner
      await Notification.create({
        title: 'Owner Dispatch Alarm',
        message: `Alex Rivera notified: SLA target breach registered for crew.`
      });
    }

    // 3. Rule: Job Cancelled
    if (job.status === 'cancelled') {
      console.log(`[Automation Engine] Triggering cancellation rules for job #${job.id || job._id}`);
      
      await Notification.create({
        title: 'Workorder Cancelled',
        message: `Job #${job.id || job._id} cancelled. Calendar slots released for nearest dispatch crews.`
      });
    }

  } catch (error) {
    console.error(`[Automation Engine] Error executing rules: ${error.message}`);
  }
};

export default {
  handleJobStatusChange
};
