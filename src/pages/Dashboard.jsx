import React, { useState } from 'react';
import {
  Calendar,
  Wrench,
  CheckCircle,
  DollarSign,
  PhoneCall,
  Star,
  Plus,
  Sparkles,
  ArrowRight,
  User,
  Clock,
  AlertCircle,
  Activity,
  Mail,
  Zap
} from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { StatusBadge } from '../components/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/Table';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/Modal';
import { Alert } from '../components/Alert';
import { Timeline, TimelineItem } from '../components/Timeline';
import { Label, Input, Select, Textarea, Toggle, FormHelperText } from '../components/FormControl';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';

export const Dashboard = () => {
  const { currentTemplate, user, jobs, setJobs, customers, technicians } = useApp();
  const { addNotification } = useNotifications();

  // Dialog & Simulator states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [simulateAlert, setSimulateAlert] = useState(true);

  // Form states inside modal
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [newJobName, setNewJobName] = useState('');
  const [newJobEmail, setNewJobEmail] = useState('');
  const [newJobService, setNewJobService] = useState('AC Service');
  const [newJobPrice, setNewJobPrice] = useState('120.00');
  const [newJobNotes, setNewJobNotes] = useState('');
  const [autoRouting, setAutoRouting] = useState(true);
  const [selectedTechId, setSelectedTechId] = useState('t1');
  const [formError, setFormError] = useState(false);

  const [followups, setFollowups] = useState([
    { id: 'f1', customer: 'Robert Downey', phone: '+1 (555) 304-9844', reason: 'AC Installation Satisfaction Call', due: 'Today, 4:30 PM', assigned: 'Alex Rivera' },
    { id: 'f2', customer: 'Scarlett Johansson', phone: '+1 (555) 832-2300', reason: 'Compressor Warranty Validation', due: 'Tomorrow, 10:00 AM', assigned: 'Sarah Connor' },
    { id: 'f3', customer: 'Chris Evans', phone: '+1 (555) 762-1100', reason: 'Duct Cleaning Followup Booking', due: 'July 9, 2:00 PM', assigned: 'Dave Miller' }
  ]);

  const [activities, setActivities] = useState([
    { id: 'a1', title: 'Workorder Resolved', time: '15 mins ago', description: 'Dave Miller completed ticket #1024. Billed $150.00.', type: 'completed', icon: CheckCircle },
    { id: 'a2', title: 'Technician Dispatched', time: '1 hour ago', description: 'Sarah Connor dispatched to Bob Marley (#1025).', type: 'in-progress', icon: Wrench },
    { id: 'a3', title: 'Stripe Invoice Settled', time: '3 hours ago', description: 'Invoice #INV-9284 settled for $420.00.', type: 'completed', icon: DollarSign },
    { id: 'a4', title: 'SLA Warning Triggered', time: 'Yesterday', description: 'Job #1028 missed technician check-in SLA timeline.', type: 'failed', icon: AlertCircle }
  ]);

  const handleSelectJob = (id) => {
    if (selectedJobs.includes(id)) {
      setSelectedJobs(selectedJobs.filter(jId => jId !== id));
    } else {
      setSelectedJobs([...selectedJobs, id]);
    }
  };

  const handleSelectAllJobs = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map(j => j.id));
    }
  };

  const handleCreateJobSubmit = (e) => {
    e.preventDefault();
    if (!newJobName || !newJobEmail) {
      setFormError(true);
      return;
    }

    const assignedTechObj = technicians.find(t => t.id === selectedTechId);
    const assignedTechName = autoRouting ? 'Sarah Connor' : (assignedTechObj ? assignedTechObj.name : 'Dave Miller');

    const randomId = Math.floor(1029 + Math.random() * 9000).toString();
    const newJob = {
      id: randomId,
      customer: newJobName,
      email: newJobEmail,
      service: newJobService,
      technician: assignedTechName,
      price: `$${parseFloat(newJobPrice).toFixed(2)}`,
      status: 'pending',
      priority: 'medium',
      stage: 0,
      eta: '1 hour',
      date: new Date().toISOString().split('T')[0],
      address: customers.find(c => c.id === selectedCustomerId)?.address || '100 Main St',
      timeline: [
        {
          title: 'Workorder Created',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          desc: `Ticket created for ${newJobName} at address. Assigned technician: ${assignedTechName}.`
        }
      ]
    };

    setJobs([newJob, ...jobs]);
    setIsCreateModalOpen(false);
    setFormError(false);

    // Reset fields
    setSelectedCustomerId('');
    setNewJobName('');
    setNewJobEmail('');
    setNewJobNotes('');

    // Trigger toast notification
    addNotification({
      title: 'Job Created',
      description: `Job #${randomId} scheduled for ${newJobName}.`,
      type: 'success',
      category: 'workflow'
    });

    // Add activity log
    setActivities([
      {
        id: Date.now().toString(),
        title: 'New Job Scheduled',
        time: 'Just now',
        description: `Job #${randomId} created for ${newJobName} (${newJobService}).`,
        type: 'pending',
        icon: Calendar
      },
      ...activities
    ]);
  };

  const handleResolveFollowup = (id, customer) => {
    setFollowups(followups.filter(f => f.id !== id));
    addNotification({
      title: 'Follow-up Resolved',
      description: `Called ${customer} successfully. Logged details in CRM.`,
      type: 'success',
      category: 'customer'
    });
  };

  const handleTriggerSimAlert = () => {
    addNotification({
      title: 'Weather Warning Auto-Route',
      description: 'AC emergency calls rose 35% in Zone C. Auto-dispatch active.',
      type: 'warning',
      category: 'workflow'
    });
    setSimulateAlert(false);
  };

  return (
    <div className="space-y-6">
      {/* Home Header */}
      <PageHeader
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        description={`Here is what is happening in your ${currentTemplate.name} workspace today.`}
        breadcrumbs={[
          { label: 'SolveX Flow', to: '/' },
          { label: 'Dashboard', active: true }
        ]}
        actions={
          <div className="flex gap-2">
            {simulateAlert && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTriggerSimAlert}
                leftIcon={<Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />}
              >
                Weather SLA Alert
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create {currentTemplate.terminology.service}
            </Button>
          </div>
        }
      />

      {/* SLA Alert banner */}
      {!simulateAlert && (
        <Alert
          variant="warning"
          title="High Urgency Dispatch Protocol Active"
          description={`Zone C is experiencing delays, increasing ${currentTemplate.terminology.technician.toLowerCase()} response lags.`}
          onClose={() => setSimulateAlert(true)}
          action={
            <Button variant="secondary" size="sm" className="bg-amber-100 hover:bg-amber-200 text-amber-900 border-transparent">
              Review Dispatch Map
            </Button>
          }
        />
      )}

      {/* Six Premium Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title={currentTemplate.dashboardCards.todayLabel}
          value={jobs.length.toString()}
          icon={Calendar}
          change="+12.5%"
          changeType="positive"
          timeframe="vs yesterday"
          iconClassName="bg-primary-50 text-primary-600 border border-primary-100/50"
        />
        <StatCard
          title={currentTemplate.dashboardCards.activeLabel}
          value={jobs.filter(j => j.status === 'in-progress').length.toString()}
          icon={Wrench}
          change="On Track"
          changeType="neutral"
          timeframe="vs SLA target"
          iconClassName="bg-blue-50 text-blue-600 border border-blue-100/50"
        />
        <StatCard
          title={currentTemplate.dashboardCards.completedLabel}
          value={jobs.filter(j => j.status === 'completed').length.toString()}
          icon={CheckCircle}
          change="+25.0%"
          changeType="positive"
          timeframe="vs yesterday"
          iconClassName="bg-emerald-50 text-emerald-600 border border-emerald-100/50"
        />
        <StatCard
          title={currentTemplate.dashboardCards.revenueLabel}
          value={
            currentTemplate.id === 'clinic' ? '$450' : 
            currentTemplate.id === 'salon' ? '$345' : 
            currentTemplate.id === 'pestControl' ? '$590' : 
            '$1,280'
          }
          icon={DollarSign}
          change="+18.2%"
          changeType="positive"
          timeframe="vs yesterday"
          iconClassName="bg-indigo-50 text-indigo-600 border border-indigo-100/50"
        />
        <StatCard
          title={`${currentTemplate.terminology.customer} Follow-ups`}
          value={followups.length.toString()}
          icon={PhoneCall}
          change="-50.0%"
          changeType="positive"
          timeframe="overdue resolved"
          iconClassName="bg-rose-50 text-rose-600 border border-rose-100/50"
        />
        <StatCard
          title={currentTemplate.dashboardCards.satisfactionLabel}
          value="98.4%"
          icon={Star}
          change="+0.8%"
          changeType="positive"
          timeframe="vs last week"
          iconClassName="bg-amber-50 text-amber-600 border border-amber-100/50"
        />
      </div>

      {/* Main content columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Span): Recent Jobs, Follow-ups, AI Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Jobs Table */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Dispatch {currentTemplate.terminology.servicePlural}</CardTitle>
                <CardDescription>Monitor ongoing {currentTemplate.terminology.technician.toLowerCase()} appointments and SLA compliance levels.</CardDescription>
              </div>
              <span className="text-[10px] text-gray-400 font-medium select-none">Active Workspace Queue</span>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow hoverable={false}>
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        checked={selectedJobs.length === jobs.length}
                        onChange={handleSelectAllJobs}
                        className="rounded border-gray-305 text-primary-600 focus:ring-primary-500/20"
                      />
                    </TableHead>
                    <TableHead>{currentTemplate.terminology.service} ID</TableHead>
                    <TableHead>{currentTemplate.terminology.customer}</TableHead>
                    <TableHead>Requested {currentTemplate.terminology.service}</TableHead>
                    <TableHead>{currentTemplate.terminology.technician}</TableHead>
                    <TableHead align="right">Billed Amount</TableHead>
                    <TableHead align="center">SLA State</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => {
                    const isChecked = selectedJobs.includes(job.id);
                    return (
                      <TableRow key={job.id} active={isChecked}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSelectJob(job.id)}
                            className="rounded border-gray-305 text-primary-600 focus:ring-primary-500/20"
                          />
                        </TableCell>
                        <TableCell numeric>{job.id}</TableCell>
                        <TableCell className="font-semibold text-gray-850">{job.customer}</TableCell>
                        <TableCell className="text-gray-500">{job.service}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-gray-650 font-medium">
                            <div className="h-4.5 w-4.5 bg-gray-100 rounded-full flex items-center justify-center font-bold text-[9px] text-gray-500">
                              {job.technician.split(' ').map(n => n[0]).join('')}
                            </div>
                            {job.technician}
                          </div>
                        </TableCell>
                        <TableCell align="right" numeric>{job.price}</TableCell>
                        <TableCell align="center">
                          <StatusBadge status={job.status} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                onClick={() => alert('Navigating to job-dispatch view...')}
              >
                View all scheduled dispatches
              </Button>
            </CardFooter>
          </Card>

          {/* Grid layout for Follow-ups & AI Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Upcoming Followups */}
            <Card className="flex flex-col">
              <CardHeader>
                <div>
                  <CardTitle>Upcoming Follow-ups</CardTitle>
                  <CardDescription>Call customers to ensure service satisfaction post-dispatch.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                {followups.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-xs font-normal">
                    All follow-ups completed for today!
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {followups.map((f) => (
                      <div key={f.id} className="p-4 hover:bg-gray-50/30 transition-colors flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-gray-850 text-xs">{f.customer}</span>
                            <span className="text-[9px] text-gray-400 font-semibold uppercase">{f.phone}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 font-normal">{f.reason}</p>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                            <Clock className="h-3 w-3" />
                            <span>Due: {f.due}</span>
                            <span className="mx-1">•</span>
                            <span>Rep: {f.assigned}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2.5 text-[11px] font-semibold border-gray-250 shrink-0"
                          onClick={() => handleResolveFollowup(f.id, f.customer)}
                        >
                          Resolve
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Proactive Recommendations */}
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle>AI Proactive Recommendations</CardTitle>
                    <CardDescription>Automated insights to increase SLA compliance and upsells.</CardDescription>
                  </div>
                  <Badge variant="purple" styleType="subtle" showDot={true} dotPulse={true}>
                    Live Engine
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {currentTemplate.aiSuggestions.map((sug, idx) => (
                  <div key={idx} className="flex gap-3 p-3.5 bg-violet-50/30 border border-violet-100/50 rounded-xl">
                    <div className="p-1.5 bg-violet-100 text-violet-700 rounded-lg h-7 w-7 flex items-center justify-center shrink-0">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-violet-950">{sug.title}</h4>
                      <p className="text-[11px] text-violet-900/80 leading-relaxed font-normal">
                        {sug.message}
                      </p>
                      <div className="pt-1.5 flex gap-2">
                        <Button
                          variant="text"
                          className="text-[11px] font-semibold text-violet-750 hover:text-violet-900"
                          onClick={() => {
                            alert('Applying AI operations copilot recommendations override...');
                          }}
                        >
                          Resolve Action
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

        </div>

        {/* Right Column (1 Span): Recent Activities Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="h-full">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Logged Activities</CardTitle>
                <CardDescription>Live event timeline of dispatched field teams.</CardDescription>
              </div>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <Timeline>
                {activities.map((act, idx) => (
                  <TimelineItem
                    key={act.id}
                    title={act.title}
                    time={act.time}
                    icon={act.icon}
                    active={idx < 2}
                    isLast={idx === activities.length - 1}
                  >
                    <p className="text-gray-500 font-normal leading-normal">{act.description}</p>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-gray-500 hover:text-gray-900 justify-center font-semibold"
                onClick={() => alert('Opening full activity log database...')}
              >
                View full activities audit
              </Button>
            </CardFooter>
          </Card>
        </div>

      </div>

      {/* Create Job Modal Overlay */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} size="md">
        <ModalHeader onClose={() => setIsCreateModalOpen(false)}>
          <ModalTitle>Create {currentTemplate.terminology.service} Schedule</ModalTitle>
          <p className="text-[11px] text-gray-400 mt-1 font-normal leading-none">Register and schedule new {currentTemplate.terminology.technician.toLowerCase()} appointments.</p>
        </ModalHeader>
        <form onSubmit={handleCreateJobSubmit}>
          <ModalContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="cust-name" error={formError && !newJobName}>Select {currentTemplate.terminology.customer}</Label>
              <Select
                id="cust-name"
                value={selectedCustomerId}
                onChange={(e) => {
                  const cId = e.target.value;
                  setSelectedCustomerId(cId);
                  if (cId) {
                    const c = customers.find(item => item.id === cId);
                    if (c) {
                      setNewJobName(c.name);
                      setNewJobEmail(c.email);
                    }
                  } else {
                    setNewJobName('');
                    setNewJobEmail('');
                  }
                }}
              >
                <option value="">-- Choose {currentTemplate.terminology.customer} --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
              {formError && !newJobName && <FormHelperText error>Selection is required</FormHelperText>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="cust-email">Email Address</Label>
              <Input
                id="cust-email"
                type="email"
                placeholder="client@example.com"
                value={newJobEmail}
                onChange={(e) => setNewJobEmail(e.target.value)}
                error={formError && !newJobEmail}
                leftIcon={<Mail className="h-4 w-4" />}
              />
              {formError && !newJobEmail && <FormHelperText error>Email is required</FormHelperText>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="cust-service">Service Target</Label>
                <Select
                  id="cust-service"
                  value={newJobService}
                  onChange={(e) => setNewJobService(e.target.value)}
                >
                  <option value="Standard Inspection">Standard Inspection</option>
                  <option value="Premium Complete Service">Premium Complete Service</option>
                  <option value="Routine Consultation">Routine Consultation</option>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="cust-price">Billed Price ($)</Label>
                <Input
                  id="cust-price"
                  type="number"
                  placeholder="120.00"
                  value={newJobPrice}
                  onChange={(e) => setNewJobPrice(e.target.value)}
                  leftIcon={<DollarSign className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="cust-notes">Additional Notes</Label>
              <Textarea
                id="cust-notes"
                placeholder="Key Lockbox combinations, access codes..."
                value={newJobNotes}
                onChange={(e) => setNewJobNotes(e.target.value)}
              />
            </div>

            <div className="space-y-3 pt-2">
              <Toggle
                checked={autoRouting}
                onChange={setAutoRouting}
                label={`Auto-assign nearest qualified ${currentTemplate.terminology.technician.toLowerCase()}`}
              />

              {!autoRouting && (
                <div className="space-y-1 pt-1 animate-fadeIn">
                  <Label htmlFor="c-tech">Assign {currentTemplate.terminology.technician}</Label>
                  <Select
                    id="c-tech"
                    value={selectedTechId}
                    onChange={(e) => setSelectedTechId(e.target.value)}
                  >
                    {technicians.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.role})</option>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          </ModalContent>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Schedule {currentTemplate.terminology.service}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
