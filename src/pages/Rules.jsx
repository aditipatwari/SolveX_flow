import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  Settings2,
  CheckCircle,
  AlertCircle,
  Plus,
  Clock,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Edit2
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Toggle } from '../components/FormControl';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/Modal';
import { Label, Input, Select, Textarea } from '../components/FormControl';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/Table';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';

export const Rules = () => {
  const { currentTemplate } = useApp();
  const { addNotification } = useNotifications();

  // Playbooks Local State
  const [playbooks, setPlaybooks] = useState([
    {
      id: 'pb-1',
      name: 'New Booking',
      desc: 'Send confirmation messages to customer and dispatch job request.',
      trigger: 'New Booking Scheduled',
      actions: ['Send Confirmation Email', 'Assign Technician', 'Create Ticket'],
      status: true,
      lastExecuted: '2 mins ago',
      executionCount: 142
    },
    {
      id: 'pb-2',
      name: 'Service Completed',
      desc: 'Process Stripe billing, email receipt, and queue review feedback requests.',
      trigger: 'Job Completed Stage 3',
      actions: ['Bill via Stripe Gateway', 'Send SMS Feedback Link'],
      status: true,
      lastExecuted: '12 mins ago',
      executionCount: 512
    },
    {
      id: 'pb-3',
      name: 'Payment Received',
      desc: 'Sync financial ledger sheet and notify service manager of collection.',
      trigger: 'Stripe Payment Successful',
      actions: ['Append to Google Sheets', 'Slack Team Alert'],
      status: true,
      lastExecuted: '1 hour ago',
      executionCount: 840
    },
    {
      id: 'pb-4',
      name: 'Low Rating Recovery',
      desc: 'Auto-escalate negative feedback to customer success team for recovery outreach.',
      trigger: 'Review Score < 3 Stars',
      actions: ['Create CRM Support Ticket', 'Notify Operations Manager'],
      status: true,
      lastExecuted: 'Yesterday',
      executionCount: 18
    },
    {
      id: 'pb-5',
      name: 'Maintenance Reminder',
      desc: 'Outreach to existing customers for quarterly filters replacement or wellness checks.',
      trigger: '90 Days Post Service',
      actions: ['Send Re-booking Email Offer', 'Assign Follow-up Ticket'],
      status: true,
      lastExecuted: '5 hours ago',
      executionCount: 92
    },
    {
      id: 'pb-6',
      name: 'Customer Win Back',
      desc: 'Send promotional voucher discounts to clients inactive for over 6 months.',
      trigger: '180 Days Inactive',
      actions: ['Email Promotional Voucher', 'Tag Account as Winback'],
      status: false,
      lastExecuted: 'Never',
      executionCount: 0
    },
    {
      id: 'pb-7',
      name: 'Daily AI Brief',
      desc: 'Summarize outstanding tickets, dispatch routes, and generate weather SLA warnings.',
      trigger: 'Scheduled: Daily 08:00 AM',
      actions: ['Generate Gemini AI Summary', 'Slack Ops Briefing Report'],
      status: true,
      lastExecuted: 'Today, 08:00 AM',
      executionCount: 310
    },
    {
      id: 'pb-8',
      name: 'Technician Assignment',
      desc: 'Trigger auto-routing algorithms based on proximity and workload constraints.',
      trigger: 'Job Created (Auto-Assign)',
      actions: ['Locate Proximity Tech', 'Push App Notification'],
      status: true,
      lastExecuted: '3 mins ago',
      executionCount: 916
    }
  ]);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editTrigger, setEditTrigger] = useState('');
  const [editActions, setEditActions] = useState('');

  // History State
  const [history] = useState([
    { id: 'h-1', time: 'Just now', playbook: 'Technician Assignment', trigger: 'Job #4109 Created', actions: 'Auto-assigned Sarah Connor, Push alert sent', status: 'success', latency: '42ms' },
    { id: 'h-2', time: '2 mins ago', playbook: 'New Booking', trigger: 'Alice Cooper registered', actions: 'SMS confirmation scheduled, DB synced', status: 'success', latency: '89ms' },
    { id: 'h-3', time: '12 mins ago', playbook: 'Service Completed', trigger: 'Job #1024 complete', actions: 'Stripe charge $150 captured, survey emailed', status: 'success', latency: '124ms' },
    { id: 'h-4', time: '1 hour ago', playbook: 'Payment Received', trigger: 'Stripe webhook payment', actions: 'Google sheet updated, slack notify triggered', status: 'success', latency: '210ms' },
    { id: 'h-5', time: '4 hours ago', playbook: 'Low Rating Recovery', trigger: 'Customer feedback: 2 stars', actions: 'CRM ticket #990 created, Ops lead notified', status: 'failed', latency: '380ms' }
  ]);

  // Translate labels dynamically depending on template vocabulary terms
  const translatePlaybook = (pb) => {
    let name = pb.name;
    let desc = pb.desc;
    let trigger = pb.trigger;
    let actions = [...pb.actions];

    const customer = currentTemplate.terminology.customer;
    const technician = currentTemplate.terminology.technician;
    const service = currentTemplate.terminology.service;
    const servicePlural = currentTemplate.terminology.servicePlural;

    // Translation checks
    if (name === 'New Booking') {
      name = `New ${service}`;
      desc = `Send confirmation messages to ${customer.toLowerCase()} and dispatch ${service.toLowerCase()} request.`;
      trigger = `New ${service} Scheduled`;
      actions = actions.map(act => act.replace('Technician', technician));
    } else if (name === 'Service Completed') {
      name = `${service} Completed`;
      desc = `Process Stripe billing, email receipt, and queue review feedback requests.`;
      trigger = `${service} Completed Stage 3`;
    } else if (name === 'Low Rating Recovery') {
      desc = `Auto-escalate negative feedback to ${customer.toLowerCase()} success team for recovery outreach.`;
      trigger = `${customer} feedback rating < 3`;
    } else if (name === 'Maintenance Reminder') {
      desc = `Outreach to existing ${customer.toLowerCase()}s for quarterly ${service.toLowerCase()} wellness checks.`;
      trigger = `90 Days Post ${service}`;
      actions = actions.map(act => act.replace('Ticket', `${service} Ticket`));
    } else if (name === 'Customer Win Back') {
      name = `${customer} Win Back`;
      desc = `Send promotional voucher discounts to ${customer.toLowerCase()}s inactive for over 6 months.`;
      trigger = `${customer} inactive for 6 months`;
    } else if (name === 'Technician Assignment') {
      name = `${technician} Assignment`;
      desc = `Trigger auto-routing algorithms based on proximity and workload constraints.`;
      trigger = `${service} Created (Auto-Assign)`;
      actions = actions.map(act => act.replace('Tech', technician));
    }

    return {
      ...pb,
      name,
      desc,
      trigger,
      actions
    };
  };

  const handleToggleStatus = (id) => {
    setPlaybooks(prev =>
      prev.map(pb => {
        if (pb.id === id) {
          const newStatus = !pb.status;
          addNotification({
            title: `Playbook ${newStatus ? 'Enabled' : 'Disabled'}`,
            description: `"${pb.name}" playbook status updated.`,
            type: newStatus ? 'success' : 'warning',
            category: 'workflow'
          });
          return { ...pb, status: newStatus };
        }
        return pb;
      })
    );
  };

  const handleOpenEdit = (pb) => {
    setSelectedPlaybook(pb);
    setEditName(pb.name);
    setEditDesc(pb.desc);
    setEditTrigger(pb.trigger);
    setEditActions(pb.actions.join(', '));
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editName || !editTrigger) return;

    setPlaybooks(prev =>
      prev.map(pb => {
        if (pb.id === selectedPlaybook.id) {
          return {
            ...pb,
            name: editName,
            desc: editDesc,
            trigger: editTrigger,
            actions: editActions.split(',').map(a => a.trim()).filter(Boolean)
          };
        }
        return pb;
      })
    );

    setIsEditModalOpen(false);
    addNotification({
      title: 'Playbook Updated',
      description: `Changes to "${editName}" have been deployed.`,
      type: 'success',
      category: 'workflow'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Automation Center"
        description="Build and manage event-triggered playbooks, webhook callbacks, and auto-dispatch rules."
        breadcrumbs={[
          { label: 'SolveX Flow', to: '/' },
          { label: 'Automations', active: true }
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => alert('Launching visual workflow designer...')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create Playbook
          </Button>
        }
      />

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 p-4">
          <div className="h-10 w-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shrink-0 border border-primary-100">
            <Play className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Executions</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-gray-900 leading-none">2,842</span>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +18.4%
              </span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Success Rate</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-gray-900 leading-none">99.9%</span>
              <span className="text-[10px] text-gray-400 font-semibold">0.1% latency</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Playbooks</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-gray-900 leading-none">
                {playbooks.filter(p => p.status).length} / {playbooks.length}
              </span>
              <span className="text-[10px] text-blue-500 font-semibold">Tuned operational</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Time Saved (Est)</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-gray-900 leading-none">42.5 hrs</span>
              <span className="text-[10px] text-gray-400 font-semibold">vs manual outreach</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Playbook Library Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Playbook Library</h3>
          <span className="text-[10px] text-gray-400 font-semibold">Zapier & Make Engine Integration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {playbooks.map(pb => {
            const translated = translatePlaybook(pb);
            return (
              <Card key={pb.id} className="flex flex-col h-full border border-gray-100/80 shadow-2xs hover:shadow-xs transition-shadow">
                <CardHeader className="pb-2 flex-row justify-between items-start border-b-0 space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Zap className={`h-4 w-4 ${pb.status ? 'text-primary-600' : 'text-gray-400'}`} />
                      {translated.name}
                    </CardTitle>
                    <CardDescription className="text-[11px] leading-relaxed line-clamp-2 h-8">
                      {translated.desc}
                    </CardDescription>
                  </div>
                  <Toggle
                    checked={pb.status}
                    onChange={() => handleToggleStatus(pb.id)}
                  />
                </CardHeader>

                <CardContent className="py-2 flex-1 space-y-3">
                  {/* Triggers Section */}
                  <div className="p-2 bg-gray-50/50 rounded-lg border border-gray-100/40 text-xs">
                    <span className="text-[9px] font-bold text-gray-400 uppercase block tracking-wider">When Trigger Fires</span>
                    <p className="text-gray-800 font-semibold mt-0.5 truncate">{translated.trigger}</p>
                  </div>

                  {/* Actions Section */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase block tracking-wider">Then Execute Actions</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {translated.actions.map((act, actIdx) => (
                        <React.Fragment key={actIdx}>
                          <Badge variant="blue" styleType="subtle" className="text-[9px] font-medium py-0.5">
                            {act}
                          </Badge>
                          {actIdx < translated.actions.length - 1 && (
                            <ArrowRight className="h-2.5 w-2.5 text-gray-300 self-center" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 pb-4 bg-gray-50/20 flex items-center justify-between border-t border-gray-50/50 text-[10px] text-gray-400">
                  <div className="flex flex-col">
                    <span>Runs: <b className="text-gray-700 font-semibold tabular-nums">{pb.executionCount}</b></span>
                    <span>Last run: <b className="text-gray-700 font-semibold">{translated.lastExecuted}</b></span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 border-gray-200 text-xs font-semibold"
                    leftIcon={<Edit2 className="h-3 w-3" />}
                    onClick={() => handleOpenEdit(pb)}
                  >
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Execution Logs Table */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Trigger Execution Logs</CardTitle>
            <CardDescription>Live telemetry stream of automation playbook logs.</CardDescription>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">Webhooks SLA Queue</span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow hoverable={false}>
                <TableHead>Execution Time</TableHead>
                <TableHead>Active Playbook</TableHead>
                <TableHead>Target Event payload</TableHead>
                <TableHead>Triggered Actions</TableHead>
                <TableHead align="center">Latency</TableHead>
                <TableHead align="center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-gray-550 tabular-nums">{log.time}</TableCell>
                  <TableCell className="font-semibold text-xs text-gray-800">{log.playbook}</TableCell>
                  <TableCell className="text-xs text-gray-600 font-normal">{log.trigger}</TableCell>
                  <TableCell className="text-xs text-gray-500 font-normal">{log.actions}</TableCell>
                  <TableCell align="center" className="text-xs font-medium text-gray-600 font-mono">{log.latency}</TableCell>
                  <TableCell align="center">
                    <Badge variant={log.status === 'success' ? 'success' : 'danger'} styleType="subtle">
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Playbook Modal */}
      {selectedPlaybook && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="md">
          <ModalHeader onClose={() => setIsEditModalOpen(false)}>
            <ModalTitle>Configure Playbook Rule</ModalTitle>
            <p className="text-[11px] text-gray-400 mt-1 font-normal leading-none">Modify trigger parameters and serial executing action targets.</p>
          </ModalHeader>
          <form onSubmit={handleEditSubmit}>
            <ModalContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="pb-name">Playbook Trigger Name</Label>
                <Input
                  id="pb-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="pb-desc">Workflow Description</Label>
                <Textarea
                  id="pb-desc"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="pb-trigger">Webhook Trigger Condition</Label>
                <Input
                  id="pb-trigger"
                  value={editTrigger}
                  onChange={(e) => setEditTrigger(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="pb-actions">Serial Execution Actions (Comma Separated)</Label>
                <Input
                  id="pb-actions"
                  value={editActions}
                  onChange={(e) => setEditActions(e.target.value)}
                />
                <p className="text-[10px] text-gray-400">Specify Zapier/Make callbacks separated by commas.</p>
              </div>
            </ModalContent>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Deploy Playbook
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Rules;
