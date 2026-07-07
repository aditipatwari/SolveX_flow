import { Job } from '../models/Job.js';
import { FollowUp } from '../models/FollowUp.js';
import { WorkflowEvent } from '../models/WorkflowEvent.js';
import { getAnalyticsSummary } from '../services/analyticsService.js';

export const getDashboardData = async (req, res, next) => {
  try {
    const summary = await getAnalyticsSummary();

    // Get today's jobs (created or updated today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayJobsCount = await Job.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd }
    });

    // Get active jobs (status in-progress)
    const activeJobs = await Job.find({ status: 'in-progress' }).populate('customer');

    // Get completed jobs
    const completedJobsCount = await Job.countDocuments({ status: 'completed' });

    // Get upcoming followups
    const upcomingFollowups = await FollowUp.find({ status: 'pending' })
      .populate('customer')
      .populate('job')
      .limit(5);

    // Get recent activities (last 10 workflow events)
    const recentActivities = await WorkflowEvent.find()
      .populate({
        path: 'job',
        populate: { path: 'customer' }
      })
      .sort({ timestamp: -1 })
      .limit(10);

    // Generate AI recommendations/alerts contextually
    const aiAlerts = [];
    if (summary.delayedJobsCount > 0) {
      aiAlerts.push({
        id: 'rec-delay',
        type: 'danger',
        title: 'SLA Response Breach Alert',
        message: `${summary.delayedJobsCount} active workorders have breached response SLA targets. We recommend reviewing dispatch routes immediately.`
      });
    } else {
      aiAlerts.push({
        id: 'rec-ok',
        type: 'info',
        title: 'Operations SLA Nominal',
        message: 'All dispatched crews are checking in within normal SLA windows.'
      });
    }

    if (summary.completionRate < 90) {
      aiAlerts.push({
        id: 'rec-complete',
        type: 'warning',
        title: 'Completion Rate Warning',
        message: `Current completion rate is ${summary.completionRate}%, below target 90%. Recommend load-balancing crew assignments.`
      });
    }

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          todaysJobs: todayJobsCount || summary.totalJobs, // fallback if new day
          activeJobs: summary.activeJobsCount,
          completedJobs: completedJobsCount,
          revenueToday: summary.totalRevenue,
          followupsDue: summary.pendingFollowupsCount,
          customerSatisfaction: '98%' // simulated standard score
        },
        activeJobs,
        upcomingFollowups,
        recentActivities: recentActivities.map(act => ({
          id: act._id,
          title: act.notes || 'Stage Updated',
          time: act.timestamp,
          description: `${act.job?.technician || 'Technician'} updated job #${act.job?._id || ''} for ${act.job?.customer?.name || 'Customer'}.`,
          type: act.job?.status || 'pending'
        })),
        aiAlerts
      }
    });

  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardData
};
