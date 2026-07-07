import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Clock,
  User,
  AlertCircle,
  ArrowLeft,
  Mail,
  MapPin,
  DollarSign,
  Phone,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  SlidersHorizontal
} from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { StatusBadge } from '../components/StatusBadge';
import { StepsIndicator } from '../components/Progress';
import { Timeline, TimelineItem } from '../components/Timeline';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';
import { EmptyState } from '../components/EmptyState';
import { Alert } from '../components/Alert';

export const Workflow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTemplate, jobs, setJobs, updateJobStage } = useApp();
  const { addNotification } = useNotifications();

  // Find the selected job
  const job = jobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-2xs">
        <EmptyState
          title="Workorder not found"
          description="The selected reference does not exist in the active queue database."
          actionLabel="Return to Queue"
          onActionClick={() => navigate('/jobs')}
          icon={AlertCircle}
        />
      </div>
    );
  }

  const steps = currentTemplate.workflowStages.map(stage => ({ label: stage }));

  const handleAdvance = () => {
    if (job.stage < 3) {
      const nextStage = job.stage + 1;
      updateJobStage(job.id, nextStage);
      
      const stageLabels = currentTemplate.workflowStages;
      addNotification({
        title: 'Workflow Updated',
        description: `Job #${job.id} advanced to ${stageLabels[nextStage]}.`,
        type: 'info',
        category: 'workflow'
      });
    }
  };

  const handleReset = () => {
    setJobs(prevJobs =>
      prevJobs.map(j => {
        if (j.id === job.id) {
          return {
            ...j,
            stage: 0,
            status: 'pending',
            eta: '1 hour',
            timeline: [
              {
                title: 'Workflow Reset',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                desc: 'Workorder was reset back to Dispatch Preparation stage.'
              },
              ...j.timeline
            ]
          };
        }
        return j;
      })
    );

    addNotification({
      title: 'Workflow Reset',
      description: `Job #${job.id} reset to dispatch stage.`,
      type: 'warning',
      category: 'workflow'
    });
  };

  const handleCancel = () => {
    setJobs(prevJobs =>
      prevJobs.map(j => {
        if (j.id === job.id) {
          return {
            ...j,
            status: 'cancelled',
            timeline: [
              {
                title: 'Job Cancelled',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                desc: 'Workflow terminated. Workorder marked as cancelled.'
              },
              ...j.timeline
            ]
          };
        }
        return j;
      })
    );

    addNotification({
      title: 'Job Cancelled',
      description: `Job #${job.id} has been marked as cancelled.`,
      type: 'warning',
      category: 'workflow'
    });
  };

  const getStageHeaderDesc = (stageIndex, status) => {
    if (status === 'cancelled') return 'This dispatch has been officially cancelled.';
    if (status === 'failed') return 'This workorder has missed its response SLA timing.';
    const descriptions = [
      'Preparing tools & scheduling technician dispatch details.',
      'Technician is travelling to the service location.',
      'Technician is currently performing service diagnostics.',
      'Workorder complete. Invoice synced with Stripe account.'
    ];
    return descriptions[stageIndex] || '';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`${currentTemplate.terminology.service} Workflow - #${job.id}`}
        description={`Manage operational routing and SLA checkpoints for ${job.customer}.`}
        breadcrumbs={[
          { label: currentTemplate.terminology.servicePlural, href: '/jobs' },
          { label: `${currentTemplate.terminology.service} #${job.id}`, active: true }
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/jobs')}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Queue
            </Button>
            {job.status !== 'cancelled' && job.status !== 'completed' && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleCancel}
              >
                Cancel {currentTemplate.terminology.service}
              </Button>
            )}
            {job.stage > 0 && job.status !== 'completed' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                Reset
              </Button>
            )}
            {job.stage < 3 && job.status !== 'cancelled' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleAdvance}
                rightIcon={<ChevronRight className="h-4 w-4" />}
              >
                Advance Stage
              </Button>
            )}
          </div>
        }
      />

      {/* Interactive Flow Stepper Panel */}
      <Card className="overflow-hidden">
        <CardContent className="p-6 bg-gray-50/20">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between text-xs select-none font-semibold text-gray-500 uppercase tracking-wider">
              <span>SLA Target Progression</span>
              <span className="text-gray-900 font-bold">{getStageHeaderDesc(job.stage, job.status)}</span>
            </div>
            
            {job.status !== 'cancelled' && job.status !== 'failed' ? (
              <div className="pt-2">
                <StepsIndicator steps={steps} currentStep={job.stage} />
              </div>
            ) : (
              <Alert
                variant={job.status === 'failed' ? 'danger' : 'warning'}
                title={job.status === 'failed' ? 'SLA Target Exceeded' : 'Workflow Cancelled'}
                description={job.status === 'failed' ? 'This task missed its technician dispatch schedule.' : 'This job is cancelled. Reset the stage above to reactivate.'}
                icon={AlertTriangle}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grid Layout: Left Info Columns & Right Timeline Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 span): Details, Technician Profile, Billing */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>{currentTemplate.terminology.customer} Service Profile</CardTitle>
                <CardDescription>Scheduled location contact metadata and priorities.</CardDescription>
              </div>
              <StatusBadge status={job.status} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Contact items */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <User className="h-4 w-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">{currentTemplate.terminology.customer} Name</p>
                      <p className="font-semibold text-gray-800 mt-1">{job.customer}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Notification Email</p>
                      <p className="font-medium text-gray-650 mt-1">{job.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Site Address</p>
                      <p className="font-medium text-gray-650 mt-1">{job.address}</p>
                    </div>
                  </div>
                </div>

                {/* Dispatch specifics */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <Wrench className="h-4 w-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Requested Capability</p>
                      <p className="font-semibold text-gray-800 mt-1">{job.service}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Operational Target ETA</p>
                      <p className="font-semibold text-gray-800 mt-1 tabular-nums">{job.eta}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <SlidersHorizontal className="h-4 w-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Priority Tier</p>
                      <div className="mt-1">
                        <Badge
                          variant={job.priority === 'critical' ? 'danger' : job.priority === 'medium' ? 'warning' : 'neutral'}
                          styleType="subtle"
                          showDot={true}
                        >
                          {job.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Assigned Technician & SLA Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tech details */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Assigned {currentTemplate.terminology.technician} Profile</CardTitle>
                  <CardDescription>Authorized {currentTemplate.terminology.technician.toLowerCase()} monitoring stats.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center font-bold text-lg text-primary-600 shrink-0">
                  {job.technician.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-gray-900">{job.technician}</h4>
                  <p className="text-xs text-gray-500 font-normal">Active Field Specialist • GPS Active</p>
                  <div className="flex gap-2.5 pt-1">
                    <Button variant="text" size="sm" className="text-[11px] font-semibold flex items-center gap-1.5" leftIcon={<Phone className="h-3 w-3" />}>
                      Call Specialist
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Invoice details */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Invoice Summary</CardTitle>
                  <CardDescription>Billed service quote synced with Stripe.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="h-12 w-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-lg font-bold text-gray-900 tabular-nums">{job.price}</h4>
                    <span className="text-[10px] text-gray-400 font-medium">SLA Code: HVAC-S</span>
                  </div>
                  <p className="text-xs text-gray-500 font-normal">Auto-Invoice upon Complete</p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Stripe billing connected securely</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>

        {/* Right Column: Workflow Activity Log (Timeline) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="h-full">
            <CardHeader>
              <div>
                <CardTitle>Workflow Activity Logs</CardTitle>
                <CardDescription>Real-time audit records of this workorder ticket.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {job.timeline && job.timeline.length > 0 ? (
                <Timeline>
                  {job.timeline.map((log, idx) => (
                    <TimelineItem
                      key={idx}
                      title={log.title}
                      time={log.time}
                      active={idx === 0}
                      isLast={idx === job.timeline.length - 1}
                    >
                      <p>{log.desc}</p>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <div className="text-center text-gray-400 text-xs py-8">
                  No activity logged yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Workflow;
