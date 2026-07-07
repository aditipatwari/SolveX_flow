import { GoogleGenerativeAI } from '@google/generative-ai';
import { Job } from '../models/Job.js';
import { FollowUp } from '../models/FollowUp.js';
import { WorkflowEvent } from '../models/WorkflowEvent.js';
import { getAnalyticsSummary } from './analyticsService.js';

// Setup Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey || 'MOCK_API_KEY');

const systemInstruction = `
You are the SolveX Operations Copilot, an AI-powered assistant for service business dispatches.
Your goal is to help operators monitor technician schedules, customer follow-ups, delayed jobs, and SLA benchmarks.

STRICT CONSTRAINTS:
1. NEVER answer general knowledge questions, write creative stories, or chat about topics unrelated to the business data. If asked, politely decline by stating: "I am only authorized to answer operational queries regarding SolveX business data."
2. Answer queries ONLY using the provided live business database context.
3. Be highly concise, professional, and actionable. Frame your findings as bullet points and include suggested actions.
4. Format all responses using Markdown.
`;

const generateMockAIResponse = (prompt, context) => {
  const query = prompt.toLowerCase();
  
  if (query.includes('delay')) {
    return `### SolveX Copilot Insights (MOCK DATA MODE)
*   **Active Delay**: Job #1028 (Emma Watson - Thermostat Installation) has missed its technician check-in timeline.
*   **Details**: Assigned crew Sarah Connor is en route. Travel duration has exceeded the 2-hour SLA benchmark.
*   **Suggested Action**: [Call Specialist Sarah Connor] or [Reschedule Workorder] using the dispatch panel.`;
  }
  if (query.includes('follow') || query.includes('call')) {
    return `### SolveX Copilot Insights (MOCK DATA MODE)
*   **Due Follow-ups**: There are currently 3 pending calls in your queue:
    1.  **Robert Downey** (AC Installation Satisfaction check-in) - Due: Today, 4:30 PM
    2.  **Scarlett Johansson** (Compressor Warranty confirmation) - Due: Tomorrow, 10:00 AM
    3.  **Chris Evans** (Duct Cleaning booking reminder) - Due: July 9, 2:00 PM
*   **Suggested Action**: Dial [Robert Downey] to confirm installation quality.`;
  }
  if (query.includes('workload') || query.includes('technician')) {
    return `### SolveX Copilot Insights (MOCK DATA MODE)
*   **Crew Workload Distribution**:
    *   **Sarah Connor**: 2 active dispatches (high capacity load)
    *   **Dave Miller**: 2 active dispatches
    *   **Alex Rivera**: 1 pending workorder
*   **Suggested Action**: Route any new Zone B AC diagnostics to Alex Rivera to balance workloads.`;
  }
  if (query.includes('maintenance') || query.includes('due')) {
    return `### SolveX Copilot Insights (MOCK DATA MODE)
*   **Maintenance Schedules**: Customer **Alice Cooper** is scheduled for an AC preventive maintenance service call.
*   **Suggested Action**: Auto-dispatch notification email template scheduled to send in 3 days.`;
  }
  
  return `### SolveX Operations Copilot (MOCK DATA MODE)
I am your operational dashboard assistant. Here is a summary of active metrics:
*   **Active Jobs**: ${context.activeJobsCount}
*   **Delayed Jobs**: ${context.delayedJobsCount}
*   **Revenue Today**: $${context.totalRevenue}.00
*   **Pending Follow-ups**: ${context.pendingFollowupsCount}

*(Please configure your GEMINI_API_KEY in the server/.env file to receive live generative operations analysis!)*`;
};

export const generateCopilotResponse = async (userPrompt) => {
  const analytics = await getAnalyticsSummary();
  const jobs = await Job.find().populate('customer');
  const followups = await FollowUp.find().populate('customer');
  const events = await WorkflowEvent.find().populate('job');

  const businessContext = {
    analytics,
    jobs: jobs.map(j => ({
      id: j._id,
      customer: j.customer?.name,
      service: j.serviceType,
      priority: j.priority,
      stage: j.currentStage,
      status: j.status,
      technician: j.technician,
      updatedAt: j.updatedAt
    })),
    followups: followups.map(f => ({
      customer: f.customer?.name,
      type: f.type,
      scheduledDate: f.scheduledDate,
      status: f.status
    })),
    recentEvents: events.slice(-10).map(e => ({
      jobId: e.job?._id,
      stage: e.stage,
      notes: e.notes,
      timestamp: e.timestamp,
      performedBy: e.performedBy
    }))
  };

  // Check if GEMINI_API_KEY is defined and valid
  const apiKeyMissing = !apiKey || apiKey === 'your_gemini_key' || apiKey.trim() === '';
  if (apiKeyMissing) {
    console.log('[AI Service] Gemini API Key is missing. Defaulting to mock responder.');
    return generateMockAIResponse(userPrompt, analytics);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction
    });

    const promptText = `
Here is the live business database context:
${JSON.stringify(businessContext, null, 2)}

User Question: "${userPrompt}"
`;

    const result = await model.generateContent(promptText);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(`[AI Service] Error calling Gemini API: ${error.message}`);
    return `Error communicating with Operations Copilot: ${error.message}. Fallback to mock context:\n\n${generateMockAIResponse(userPrompt, analytics)}`;
  }
};

export default {
  generateCopilotResponse
};
