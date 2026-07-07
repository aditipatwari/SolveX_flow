import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Play,
  ArrowRight,
  MessageSquare,
  Wrench,
  Mail,
  Calendar,
  HelpCircle,
  Activity,
  CheckCircle,
  FileText,
  User,
  Sliders,
  DollarSign
} from 'lucide-react';

// Import our design system components
import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { StatusBadge } from '../components/StatusBadge';
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell } from '../components/Table';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/Modal';
import { Alert } from '../components/Alert';
import { ProgressBar, ProgressRing, StepsIndicator } from '../components/Progress';
import { Timeline, TimelineItem } from '../components/Timeline';
import { Label, Input, Select, Textarea, Checkbox, Radio, Toggle, FormHelperText } from '../components/FormControl';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { useNotifications } from '../context/NotificationContext';

export const Showcase = () => {
  const { addNotification } = useNotifications();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('buttons');

  // Interactive component states
  const [btnLoading, setBtnLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [skeletonCount, setSkeletonCount] = useState(3);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formService, setFormService] = useState('ac');
  const [formNotes, setFormNotes] = useState('');
  const [formAgree, setFormAgree] = useState(false);
  const [formAutoAssign, setFormAutoAssign] = useState(true);
  const [formPriority, setFormPriority] = useState('medium');
  const [formError, setFormError] = useState(false);

  // Table states
  const [selectedRows, setSelectedRows] = useState([]);
  const tableJobs = [
    { id: '1024', customer: 'Alice Cooper', service: 'AC Preventive Maintenance', amount: '$150.00', status: 'completed', date: '2026-07-06' },
    { id: '1025', customer: 'Bob Marley', service: 'Compressor Repair & Leak Check', amount: '$420.00', status: 'in-progress', date: '2026-07-07' },
    { id: '1026', customer: 'Charlie Brown', service: 'Air Filter Cleaning & Replacement', amount: '$75.00', status: 'pending', date: '2026-07-07' },
    { id: '1027', customer: 'David Beckham', service: 'Duct Cleaning & Sanitization', amount: '$310.00', status: 'cancelled', date: '2026-07-05' },
    { id: '1028', customer: 'Emma Watson', service: 'Thermostat Installation', amount: '$120.00', status: 'failed', date: '2026-07-04' }
  ];

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rId => rId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === tableJobs.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tableJobs.map(j => j.id));
    }
  };

  const triggerMockNotification = (type) => {
    if (type === 'success') {
      addNotification({
        title: 'Form Data Saved',
        description: 'Your changes have been synced with Stripe securely.',
        type: 'success',
        category: 'sales'
      });
    } else {
      addNotification({
        title: 'Action Triggered',
        description: 'The operation completed successfully.',
        type: 'info',
        category: 'workflow'
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      setFormError(true);
      return;
    }
    setFormError(false);
    setIsModalOpen(false);
    triggerMockNotification('success');
  };

  const steps = [
    { label: 'Dispatch Job' },
    { label: 'En Route' },
    { label: 'Working' },
    { label: 'Complete & Invoice' }
  ];

  const navigationTabs = [
    { id: 'buttons', label: 'Buttons & Badges' },
    { id: 'forms', label: 'Form Controls' },
    { id: 'tables', label: 'Data Tables' },
    { id: 'overlays', label: 'Modals & Alerts' },
    { id: 'progress', label: 'Progress & Logs' },
    { id: 'states', label: 'States & Skeletons' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <PageHeader
        title="Design System Playground"
        description="A premium collection of reusable components built for SolveX Flow, inspired by Stripe and Linear UI styles."
        breadcrumbs={[
          { label: 'SolveX Flow', to: '/' },
          { label: 'Design System', active: true }
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Open Form Modal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => triggerMockNotification('info')}
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              Simulate Action
            </Button>
          </div>
        }
      />

      {/* Tabs Navigation */}
      <div className="border-b border-gray-150 pb-px flex items-center gap-1.5 overflow-x-auto select-none no-scrollbar">
        {navigationTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-all duration-150 whitespace-nowrap focus:outline-none ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Panel */}
      <div className="mt-6">
        
        {/* TAB 1: Buttons & Badges */}
        {activeTab === 'buttons' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Button Showcase */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Action Buttons</CardTitle>
                  <CardDescription>Visual variants with elegant border shadows and active press effects.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Visual Variants</p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button variant="primary">Primary Accent</Button>
                    <Button variant="secondary">Secondary Slate</Button>
                    <Button variant="outline">Outline Border</Button>
                    <Button variant="purple">Brand Violet</Button>
                    <Button variant="danger">Destructive Danger</Button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">States & Interactions</p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                      variant="primary"
                      isLoading={btnLoading}
                      onClick={() => {
                        setBtnLoading(true);
                        setTimeout(() => setBtnLoading(false), 2000);
                      }}
                      leftIcon={<Play className="h-4 w-4" />}
                    >
                      {btnLoading ? 'Running...' : 'Click to Load'}
                    </Button>
                    <Button variant="outline" leftIcon={<Mail className="h-4 w-4" />}>Left Icon</Button>
                    <Button variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>Right Icon</Button>
                    <Button variant="outline" disabled>Disabled State</Button>
                    <Button variant="ghost">Ghost Accent</Button>
                    <Button variant="text">Plain Text Action</Button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Button Sizes</p>
                  <div className="flex flex-wrap items-end gap-2.5">
                    <Button variant="secondary" size="sm">Small Size (sm)</Button>
                    <Button variant="secondary" size="md">Medium standard (md)</Button>
                    <Button variant="secondary" size="lg">Large variant (lg)</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badge Showcase */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Badges & Statuses</CardTitle>
                  <CardDescription>Clean styles with optional indicator dots and pulse animations.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Badge Styles</p>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-400 w-16">Subtle:</span>
                      <Badge variant="primary" styleType="subtle">Primary</Badge>
                      <Badge variant="neutral" styleType="subtle">Neutral</Badge>
                      <Badge variant="success" styleType="subtle">Success</Badge>
                      <Badge variant="warning" styleType="subtle">Warning</Badge>
                      <Badge variant="danger" styleType="subtle">Danger</Badge>
                      <Badge variant="info" styleType="subtle">Info</Badge>
                      <Badge variant="purple" styleType="subtle">Purple</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-400 w-16">Solid:</span>
                      <Badge variant="primary" styleType="solid">Primary</Badge>
                      <Badge variant="neutral" styleType="solid">Neutral</Badge>
                      <Badge variant="success" styleType="solid">Success</Badge>
                      <Badge variant="warning" styleType="solid">Warning</Badge>
                      <Badge variant="danger" styleType="solid">Danger</Badge>
                      <Badge variant="info" styleType="solid">Info</Badge>
                      <Badge variant="purple" styleType="solid">Purple</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-400 w-16">Outline:</span>
                      <Badge variant="primary" styleType="outline">Primary</Badge>
                      <Badge variant="neutral" styleType="outline">Neutral</Badge>
                      <Badge variant="success" styleType="outline">Success</Badge>
                      <Badge variant="warning" styleType="outline">Warning</Badge>
                      <Badge variant="danger" styleType="outline">Danger</Badge>
                      <Badge variant="info" styleType="outline">Info</Badge>
                      <Badge variant="purple" styleType="outline">Purple</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Indicator Dots & Sizing</p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge variant="success" styleType="subtle" showDot={true}>Active Status</Badge>
                    <Badge variant="primary" styleType="subtle" showDot={true} dotPulse={true}>Syncing</Badge>
                    <Badge variant="danger" styleType="outline" showDot={true}>Failed Node</Badge>
                    <Badge variant="neutral" styleType="subtle" size="md">Medium size (md)</Badge>
                    <Badge variant="purple" styleType="subtle" size="sm">Small size (sm)</Badge>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">StatusBadge Wrappers</p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <StatusBadge status="completed" />
                    <StatusBadge status="in-progress" />
                    <StatusBadge status="pending" />
                    <StatusBadge status="cancelled" />
                    <StatusBadge status="failed" />
                    <StatusBadge status="warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: Form Controls */}
        {activeTab === 'forms' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Standard Form Fields</CardTitle>
                  <CardDescription>Premium inputs styled with responsive focus rings and aligned validation helpers.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  {/* Grid Name / Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" error={formError && !formName}>Customer Full Name</Label>
                      <Input
                        id="name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="John Doe"
                        leftIcon={<User className="h-4 w-4" />}
                        error={formError && !formName}
                      />
                      <FormHelperText error={formError && !formName}>
                        {formError && !formName ? 'Name is required' : 'Enter billing customer legal name.'}
                      </FormHelperText>
                    </div>

                    <div>
                      <Label htmlFor="email" error={formError && !formEmail}>Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="john@example.com"
                        leftIcon={<Mail className="h-4 w-4" />}
                        error={formError && !formEmail}
                      />
                      <FormHelperText error={formError && !formEmail}>
                        {formError && !formEmail ? 'Email is required' : 'Notification alerts will be sent here.'}
                      </FormHelperText>
                    </div>
                  </div>

                  {/* Dropdown Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="service">Requested Service Type</Label>
                      <Select
                        id="service"
                        value={formService}
                        onChange={(e) => setFormService(e.target.value)}
                      >
                        <option value="ac">AC Preventive Maintenance</option>
                        <option value="compressor">Compressor Overhaul</option>
                        <option value="filter">Air Filter Replacements</option>
                        <option value="duct">Duct Cleaning</option>
                      </Select>
                      <FormHelperText>Select core technician capability group.</FormHelperText>
                    </div>

                    <div>
                      <Label htmlFor="date-input">Preferred Schedule Date</Label>
                      <Input
                        id="date-input"
                        type="date"
                        leftIcon={<Calendar className="h-4 w-4" />}
                        defaultValue="2026-07-08"
                      />
                      <FormHelperText>Target dispatch calendar block.</FormHelperText>
                    </div>
                  </div>

                  {/* Textarea */}
                  <div>
                    <Label htmlFor="notes">Technical Dispatch Notes</Label>
                    <Textarea
                      id="notes"
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="Describe job constraints (e.g. key lockbox codes, roof accessibility details)..."
                    />
                    <FormHelperText>Detail instructions visible to dispatched crews.</FormHelperText>
                  </div>

                  {/* Priority Radio Buttons */}
                  <div className="space-y-1.5">
                    <Label>Urgency Priority</Label>
                    <div className="flex items-center gap-4">
                      <Radio
                        name="priority"
                        label="Low Priority"
                        checked={formPriority === 'low'}
                        onChange={() => setFormPriority('low')}
                      />
                      <Radio
                        name="priority"
                        label="Medium standard"
                        checked={formPriority === 'medium'}
                        onChange={() => setFormPriority('medium')}
                      />
                      <Radio
                        name="priority"
                        label="Critical Emergency"
                        checked={formPriority === 'critical'}
                        onChange={() => setFormPriority('critical')}
                      />
                    </div>
                  </div>

                  {/* Switches & Checkbox list */}
                  <div className="border-t border-gray-100 pt-4 space-y-3.5">
                    <div>
                      <Toggle
                        checked={formAutoAssign}
                        onChange={setFormAutoAssign}
                        label="Auto-assign nearest qualified technician"
                      />
                      <span className="block text-[10px] text-gray-400 pl-11">Uses geographic routing parameters.</span>
                    </div>

                    <div>
                      <Checkbox
                        label="I authorize SolveX Flow to log dispatch details & process payments."
                        checked={formAgree}
                        onChange={(e) => setFormAgree(e.target.checked)}
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" onClick={() => {
                  setFormName('');
                  setFormEmail('');
                  setFormNotes('');
                  setFormAgree(false);
                  setFormError(false);
                }}>
                  Reset Form
                </Button>
                <Button variant="primary" onClick={handleFormSubmit}>
                  Process Dispatch
                </Button>
              </CardFooter>
            </Card>

            {/* Read-only / Disabled States Example */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Disabled / Read-only States</CardTitle>
                  <CardDescription>Consistent styling for secure, locked, or processing inputs.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Locked Profile Handle</Label>
                  <Input value="solvex_sys_daemon" disabled leftIcon={<User className="h-4 w-4" />} />
                </div>
                <div>
                  <Label>Locked Priority Settings</Label>
                  <Select disabled>
                    <option>SLA Tier-1 (Premium)</option>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: Data Tables */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 tracking-tight">Active Workorders Queue</h3>
                <p className="text-xs text-gray-500 mt-1">Manage, filter, and audit active dispatch schedules.</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="primary" styleType="subtle" showDot={true}>
                  {selectedRows.length} Selected
                </Badge>
                {selectedRows.length > 0 && (
                  <Button variant="danger" size="sm" onClick={() => setSelectedRows([])}>
                    Clear Selection
                  </Button>
                )}
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow hoverable={false}>
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === tableJobs.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500/20"
                    />
                  </TableHead>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Requested Service</TableHead>
                  <TableHead align="right">Billed Amount</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead align="center">SLA Status</TableHead>
                  <TableHead className="w-20" align="right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableJobs.map((job) => {
                  const isChecked = selectedRows.includes(job.id);
                  return (
                    <TableRow key={job.id} active={isChecked}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectRow(job.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500/20"
                        />
                      </TableCell>
                      <TableCell numeric>{job.id}</TableCell>
                      <TableCell className="font-semibold text-gray-850">{job.customer}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-gray-550 font-normal">
                          {job.service}
                        </div>
                      </TableCell>
                      <TableCell align="right" numeric>{job.amount}</TableCell>
                      <TableCell className="font-medium text-gray-500">{job.date}</TableCell>
                      <TableCell align="center">
                        <StatusBadge status={job.status} />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-2 h-7 text-xs text-gray-400 hover:text-gray-900"
                          onClick={() => {
                            triggerMockNotification('info');
                            alert(`Modifying job #${job.id}`);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow hoverable={false}>
                  <TableCell colSpan={4} className="font-semibold text-gray-800">Total Account Volume</TableCell>
                  <TableCell align="right" numeric className="font-bold text-gray-900">$1,075.00</TableCell>
                  <TableCell colSpan={3} />
                </TableRow>
              </TableFooter>
            </Table>

            {/* Pagination demo footer */}
            <div className="flex items-center justify-between px-2 pt-2 text-xs text-gray-500 select-none">
              <span>Showing 5 of 5 entries</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Overlays & Alerts */}
        {activeTab === 'overlays' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Modal launcher Card */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Dialog overlays</CardTitle>
                  <CardDescription>Spring physics modal wrapper with body scroll locking.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-8 bg-gray-50/50 border border-gray-150 border-dashed rounded-xl text-center">
                <Sliders className="h-8 w-8 text-gray-400 mb-3" />
                <h4 className="text-xs font-semibold text-gray-850 mb-1">Click to trigger interactive modal portal</h4>
                <p className="text-[11px] text-gray-400 max-w-sm mb-5">Supports keyboard escape hooks, clicks outside overlays to dismiss, and is clean of background layouts.</p>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Launch Configuration Modal
                </Button>
              </CardContent>
            </Card>

            {/* Inline Alert Showcase */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inline Banners</h3>
                  <p className="text-[11px] text-gray-500">Dismissible notifications and semantic status notices.</p>
                </div>
                {(!alertOpen) && (
                  <Button variant="text" size="sm" onClick={() => setAlertOpen(true)}>
                    Restore Alert Example
                  </Button>
                )}
              </div>

              {alertOpen && (
                <Alert
                  variant="warning"
                  title="Unsaved Billing Settings"
                  description="Your business information is missing a default tax entity ID. Please sync with Stripe before processing customer invoices."
                  onClose={() => setAlertOpen(false)}
                  action={
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="bg-amber-100 hover:bg-amber-200 text-amber-900 border-transparent">
                        Sync Stripe Entity
                      </Button>
                      <Button variant="ghost" size="sm" className="text-amber-850 hover:bg-amber-100/50">
                        Dismiss
                      </Button>
                    </div>
                  }
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Alert
                  variant="success"
                  title="Database Synchronized"
                  description="All technician GPS locations and local offline jobs synced successfully. (5 mins ago)"
                />
                <Alert
                  variant="info"
                  title="Automatic Route Optimizing"
                  description="SolveX is computing path updates for 3 technician workorders in Zone B."
                />
                <Alert
                  variant="danger"
                  title="Dispatch Out of Bounds"
                  description="Crew AC-44 is scheduled to travel beyond standard service lines. Overwrite clearance required."
                  action={
                    <Button variant="primary" size="sm" className="bg-rose-600 hover:bg-rose-700 border-rose-700 text-white mt-1">
                      Grant Clearance
                    </Button>
                  }
                />
                <Alert
                  variant="info"
                  icon={HelpCircle}
                  title="SLA Rules Update"
                  description="Default threshold is now 60 minutes for AC repair diagnostics. Review SLA guidelines."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Progress & Logs */}
        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Progress indicators */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Linear & Ring Progress</CardTitle>
                    <CardDescription>Track queue volume, loading, and system resources.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Linear Bars */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1 font-semibold text-gray-700">
                        <span>Technician Dispatch Capacity</span>
                        <span className="tabular-nums">64%</span>
                      </div>
                      <ProgressBar value={64} variant="primary" size="md" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1 font-semibold text-gray-700">
                        <span>Invoice Collection Goal</span>
                        <span className="tabular-nums">90%</span>
                      </div>
                      <ProgressBar value={90} variant="success" size="lg" showValue />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1 font-semibold text-gray-700">
                        <span>SLA Threshold Danger</span>
                        <span className="tabular-nums">15%</span>
                      </div>
                      <ProgressBar value={15} variant="danger" size="sm" />
                    </div>
                  </div>

                  {/* Circular Rings */}
                  <div className="border-t border-gray-100 pt-5 space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progress Circular Rings</p>
                    <div className="flex items-center justify-around">
                      <div className="flex flex-col items-center gap-1.5">
                        <ProgressRing value={75} radius={32} strokeWidth={5} variant="primary" />
                        <span className="text-[10px] font-semibold text-gray-500">Resource Load</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <ProgressRing value={98} radius={32} strokeWidth={5} variant="success" />
                        <span className="text-[10px] font-semibold text-gray-500">SLA Accuracy</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <ProgressRing value={25} radius={32} strokeWidth={5} variant="danger" />
                        <span className="text-[10px] font-semibold text-gray-500">Errors Count</span>
                      </div>
                    </div>
                  </div>

                  {/* Stepper indicators */}
                  <div className="border-t border-gray-100 pt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Multi-step Steppers</p>
                      <div className="flex gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                          disabled={currentStep === 0}
                        >
                          Prev
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                          disabled={currentStep === steps.length - 1}
                        >
                          Next
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 pt-4">
                      <StepsIndicator steps={steps} currentStep={currentStep} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Activity Timeline */}
            <div className="space-y-6">
              <Card className="h-full">
                <CardHeader>
                  <div>
                    <CardTitle>Activity Audit Trail</CardTitle>
                    <CardDescription>Chronological events tracking for active jobs.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Timeline>
                    <TimelineItem
                      title="Job Completed & Invoiced"
                      time="10:30 AM"
                      active={true}
                      icon={CheckCircle}
                      badge={<StatusBadge status="completed" />}
                    >
                      <p>Technician Dave Miller resolved HVAC compressor issues. Invoice #3299 ($420.00) issued via Stripe link.</p>
                    </TimelineItem>

                    <TimelineItem
                      title="On-site Inspection Completed"
                      time="09:15 AM"
                      active={true}
                      icon={Activity}
                    >
                      <p>Leak checks performed. Compressor motor replacement flagged under warranty. Mrs. Gable signed off approval.</p>
                    </TimelineItem>

                    <TimelineItem
                      title="Technician Dispatched"
                      time="08:30 AM"
                      icon={Wrench}
                    >
                      <p>Dave Miller assigned to ticket #1025. Expected travel route duration is 25 minutes.</p>
                    </TimelineItem>

                    <TimelineItem
                      title="Workorder Ticket Created"
                      time="07:45 AM"
                      isLast={true}
                      icon={FileText}
                    >
                      <p>New job booked via customer auto-portal. Service category: AC diagnostics overhaul.</p>
                    </TimelineItem>
                  </Timeline>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 6: States & Skeletons */}
        {activeTab === 'states' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Loading Skeleton Settings */}
            <Card className="lg:col-span-1">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Loading Skeletons</CardTitle>
                  <CardDescription>Elegant shimmers to reduce spinner usage in content sections.</CardDescription>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSkeletonCount(c => Math.max(1, c - 1))}
                    className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-500 hover:bg-gray-100 select-none"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setSkeletonCount(c => Math.min(5, c + 1))}
                    className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-500 hover:bg-gray-100 select-none"
                  >
                    +
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Profile Skeleton */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Profile Loader (avatar + lines)</p>
                  <div className="flex items-center gap-3">
                    <LoadingSkeleton variant="circle" />
                    <div className="flex-1 space-y-1.5">
                      <LoadingSkeleton variant="title" className="w-1/2" />
                      <LoadingSkeleton variant="line" className="w-5/6" />
                    </div>
                  </div>
                </div>

                {/* Multiple Lines Sim */}
                <div className="border-t border-gray-100 pt-4 space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">List rows ({skeletonCount} items)</p>
                  <LoadingSkeleton variant="line" count={skeletonCount} />
                </div>

                {/* Card Skeleton Block */}
                <div className="border-t border-gray-100 pt-4 space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rectangular Block (Card block)</p>
                  <LoadingSkeleton variant="rect" />
                </div>
              </CardContent>
            </Card>

            {/* EmptyState panels */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Empty State Panels</CardTitle>
                    <CardDescription>Default grid layouts depicting zero records, no metrics, or offline states.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EmptyState
                      title="No notifications logged"
                      description="You are caught up. Active dispatches will report workflow events here."
                      icon={MessageSquare}
                      className="p-5 border border-dashed rounded-xl"
                    />

                    <EmptyState
                      title="Stripe accounts not connected"
                      description="Link your business accounts to start syncing invoice payouts immediately."
                      icon={DollarSign}
                      actionLabel="Link Account"
                      onActionClick={() => triggerMockNotification('success')}
                      className="p-5 border border-dashed rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Form Modal Portal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <ModalHeader onClose={() => setIsModalOpen(false)}>
          <ModalTitle>Create Dispatch Schedule</ModalTitle>
          <p className="text-[11px] text-gray-400 mt-1 font-normal leading-none">Register and schedule new technician workorder dispatches.</p>
        </ModalHeader>
        <ModalContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="modal-name">Customer Full Name</Label>
            <Input
              id="modal-name"
              placeholder="e.g. John Smith"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              error={formError && !formName}
              leftIcon={<User className="h-4 w-4" />}
            />
            {formError && !formName && <FormHelperText error>Name is required</FormHelperText>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="modal-email">Email Address</Label>
            <Input
              id="modal-email"
              type="email"
              placeholder="e.g. john.smith@domain.com"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              error={formError && !formEmail}
              leftIcon={<Mail className="h-4 w-4" />}
            />
            {formError && !formEmail && <FormHelperText error>Email is required</FormHelperText>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="modal-service">Service Target</Label>
              <Select id="modal-service" value={formService} onChange={(e) => setFormService(e.target.value)}>
                <option value="ac">AC Overhaul</option>
                <option value="furnace">Furnace Tune-up</option>
                <option value="clean">Filter Cleaning</option>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="modal-date">Target Date</Label>
              <Input id="modal-date" type="date" defaultValue="2026-07-08" leftIcon={<Calendar className="h-4 w-4" />} />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="modal-notes">Additional Notes</Label>
            <Textarea
              id="modal-notes"
              placeholder="Key locks instructions..."
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Toggle checked={formAutoAssign} onChange={setFormAutoAssign} label="Auto-assign nearest technician" />
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Schedule Dispatch
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Showcase;
