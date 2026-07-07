import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Search,
  Plus,
  Inbox,
  SlidersHorizontal,
  ChevronRight,
  Mail,
  MapPin,
  DollarSign
} from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/Progress';
import { Label, Input, Select, Toggle, Textarea, FormHelperText } from '../components/FormControl';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';

export const Jobs = () => {
  const { jobs, setJobs, customers, technicians, currentTemplate } = useApp();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal creation states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newService, setNewService] = useState('AC Service');
  const [newPrice, setNewPrice] = useState('120.00');
  const [newPriority, setNewPriority] = useState('medium');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [autoRoute, setAutoRoute] = useState(true);
  const [selectedTechId, setSelectedTechId] = useState('t2'); // default to Sarah Connor
  const [formError, setFormError] = useState(false);

  // Compute metrics totals
  const totalCount = jobs.length;
  const activeCount = jobs.filter(j => j.status === 'in-progress').length;
  const pendingCount = jobs.filter(j => j.status === 'pending').length;
  const completedCount = jobs.filter(j => j.status === 'completed').length;

  // Filter logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.includes(searchTerm);

    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getStageName = (stageIndex) => {
    const stages = currentTemplate.workflowStages;
    return stages[stageIndex] || 'Pending Setup';
  };

  const getProgressPercentage = (stageIndex) => {
    // 0 = 25%, 1 = 50%, 2 = 75%, 3 = 100%
    return (stageIndex + 1) * 25;
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!newCustName || !newCustEmail || !newAddress) {
      setFormError(true);
      return;
    }

    const assignedTechObj = technicians.find(t => t.id === selectedTechId);
    const assignedTechName = autoRoute ? 'Sarah Connor' : (assignedTechObj ? assignedTechObj.name : 'Dave Miller');

    const randomId = Math.floor(1029 + Math.random() * 9000).toString();
    const job = {
      id: randomId,
      customer: newCustName,
      email: newCustEmail,
      service: newService,
      technician: assignedTechName,
      price: `$${parseFloat(newPrice).toFixed(2)}`,
      status: 'pending',
      priority: newPriority,
      stage: 0,
      eta: '1 hour',
      date: new Date().toISOString().split('T')[0],
      address: newAddress,
      timeline: [
        {
          title: 'Workorder Created',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          desc: `Ticket created for ${newCustName} at address. Assigned technician: ${assignedTechName}.`
        }
      ]
    };

    setJobs([job, ...jobs]);
    setIsModalOpen(false);
    setFormError(false);

    // Reset values
    setSelectedCustomerId('');
    setNewCustName('');
    setNewCustEmail('');
    setNewAddress('');
    setNewNotes('');

    addNotification({
      title: 'Job Dispatched',
      description: `Job #${randomId} is queued for ${newCustName}.`,
      type: 'success',
      category: 'workflow'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`${currentTemplate.terminology.servicePlural} & Dispatch Queue`}
        description={`Dispatch ${currentTemplate.terminology.technician.toLowerCase()}s, audit active SLAs, and manage ${currentTemplate.terminology.customer.toLowerCase()} service flows in real-time.`}
        breadcrumbs={[
          { label: 'SolveX Flow', to: '/' },
          { label: currentTemplate.terminology.servicePlural, active: true }
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Schedule {currentTemplate.terminology.service}
          </Button>
        }
      />

      {/* Mini Summary Dashboard Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 select-none">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 bg-gray-50 text-gray-500 border border-gray-200/40 rounded-lg flex items-center justify-center font-bold text-base">
            {totalCount}
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total {currentTemplate.terminology.servicePlural}</p>
            <p className="text-xs text-gray-700 font-semibold mt-0.5">All scheduled flows</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 bg-blue-50 text-blue-600 border border-blue-100/50 rounded-lg flex items-center justify-center font-bold text-base">
            {activeCount}
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{currentTemplate.dashboardCards.activeLabel}</p>
            <p className="text-xs text-gray-700 font-semibold mt-0.5">En route or diagnostic</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 bg-amber-50 text-amber-600 border border-amber-100/50 rounded-lg flex items-center justify-center font-bold text-base">
            {pendingCount}
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Pending {currentTemplate.terminology.servicePlural}</p>
            <p className="text-xs text-gray-700 font-semibold mt-0.5">Awaiting dispatch</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-lg flex items-center justify-center font-bold text-base">
            {completedCount}
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-500 tracking-wider uppercase">{currentTemplate.dashboardCards.completedLabel}</p>
            <p className="text-xs text-gray-700 font-semibold mt-0.5">Resolved in-time today</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search by ${currentTemplate.terminology.customer.toLowerCase()}, ${currentTemplate.terminology.technician.toLowerCase()}, ID...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs font-normal pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-250 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter selectors */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs font-medium text-gray-600 bg-white border border-gray-250 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="critical">Critical Priority</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium text-gray-600 bg-white border border-gray-250 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">All Stages</option>
            <option value="pending">Pending</option>
            <option value="in-progress">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="failed">Failed SLA</option>
          </select>
        </div>
      </div>

      {/* Grid List of Job Cards */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          title="No dispatches found"
          description="Try adjusting your active search filters or schedule a new technician route."
          icon={Inbox}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const isCompleted = job.status === 'completed';
            const progressVal = getProgressPercentage(job.stage);

            return (
              <Card
                key={job.id}
                hoverable={true}
                onClick={() => navigate(`/workflow/${job.id}`)}
                className="cursor-pointer group flex flex-col h-full"
              >
                {/* Card Header details */}
                <CardHeader className="pb-3 border-b-0 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-400 font-mono font-medium">#{job.id}</span>
                    <CardTitle className="text-gray-900 group-hover:text-primary-600 transition-colors">
                      {job.customer}
                    </CardTitle>
                    <CardDescription className="text-xs font-medium text-gray-500 mt-0">
                      {job.service}
                    </CardDescription>
                  </div>
                  {/* Priority Badge */}
                  <Badge
                    variant={job.priority === 'critical' ? 'danger' : job.priority === 'medium' ? 'warning' : 'neutral'}
                    styleType="subtle"
                    showDot={true}
                  >
                    {job.priority}
                  </Badge>
                </CardHeader>

                {/* Card Main content details */}
                <CardContent className="py-2 flex-1 space-y-4">
                  {/* Address */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Service Location</span>
                    <p className="text-xs text-gray-650 truncate font-medium">{job.address}</p>
                  </div>

                  {/* Technician & ETA */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Assigned {currentTemplate.terminology.technician}</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-4.5 w-4.5 bg-gray-100 rounded-full flex items-center justify-center font-bold text-[9px] text-gray-500 shrink-0">
                          {job.technician.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs text-gray-700 font-medium truncate">{job.technician}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Target ETA</span>
                      <div className="flex items-center gap-1.5 mt-1 text-gray-700">
                        <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs font-medium tabular-nums">{job.eta}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress segment */}
                  <div className="space-y-1.5 border-t border-gray-50 pt-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-gray-500">Current Stage:</span>
                      <span className="text-gray-800">{getStageName(job.stage)}</span>
                    </div>
                    <ProgressBar
                      value={progressVal}
                      variant={job.status === 'failed' ? 'danger' : isCompleted ? 'success' : 'primary'}
                      size="sm"
                    />
                  </div>
                </CardContent>

                {/* Card Footer action button */}
                <CardFooter className="pt-3 pb-4 bg-gray-50/20 flex items-center justify-between">
                  <StatusBadge status={job.status} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2.5 text-[11px] font-semibold text-primary-600 hover:text-primary-700 group-hover:bg-primary-50/50"
                    rightIcon={<ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />}
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid triggering card onClick twice
                      navigate(`/workflow/${job.id}`);
                    }}
                  >
                    Open Workflow
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Schedule Dispatch Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <ModalHeader onClose={() => setIsModalOpen(false)}>
          <ModalTitle>Create Dispatch Schedule</ModalTitle>
          <p className="text-[11px] text-gray-400 mt-1 font-normal leading-none">Register and schedule new technician workorder dispatches.</p>
        </ModalHeader>
        <form onSubmit={handleCreateJob}>
          <ModalContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="c-name" error={formError && !newCustName}>Select Customer Profile</Label>
              <Select
                id="c-name"
                value={selectedCustomerId}
                onChange={(e) => {
                  const cId = e.target.value;
                  setSelectedCustomerId(cId);
                  if (cId) {
                    const c = customers.find(item => item.id === cId);
                    if (c) {
                      setNewCustName(c.name);
                      setNewCustEmail(c.email);
                      setNewAddress(c.address);
                    }
                  } else {
                    setNewCustName('');
                    setNewCustEmail('');
                    setNewAddress('');
                  }
                }}
              >
                <option value="">-- Choose Customer --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
              {formError && !newCustName && <FormHelperText error>Please select a customer</FormHelperText>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="c-email" error={formError && !newCustEmail}>Email Address</Label>
              <Input
                id="c-email"
                type="email"
                placeholder="john.smith@example.com"
                value={newCustEmail}
                onChange={(e) => setNewCustEmail(e.target.value)}
                error={formError && !newCustEmail}
                leftIcon={<Mail className="h-4 w-4" />}
              />
              {formError && !newCustEmail && <FormHelperText error>Email is required</FormHelperText>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="c-address" error={formError && !newAddress}>Service Address</Label>
              <Input
                id="c-address"
                placeholder="e.g. 742 Evergreen Terrace, Springfield"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                error={formError && !newAddress}
                leftIcon={<MapPin className="h-4 w-4 text-gray-400" />}
              />
              {formError && !newAddress && <FormHelperText error>Address is required</FormHelperText>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="c-service">Service Target</Label>
                <Select id="c-service" value={newService} onChange={(e) => setNewService(e.target.value)}>
                  <option value="AC Preventive Maintenance">AC Service</option>
                  <option value="Compressor Overhaul">Compressor Overhaul</option>
                  <option value="Filter Cleaning">Filter Cleaning</option>
                  <option value="Duct Overhaul & Clean">Duct Overhaul</option>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="c-priority">Urgency Priority</Label>
                <Select id="c-priority" value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Urgency</option>
                  <option value="critical">Critical Emergency</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="c-price">Billed Price ($)</Label>
                <Input
                  id="c-price"
                  type="number"
                  placeholder="120.00"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  leftIcon={<DollarSign className="h-4 w-4" />}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="c-date">Schedule Date</Label>
                <Input id="c-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} leftIcon={<Calendar className="h-4 w-4" />} />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="c-notes">Additional Notes</Label>
              <Textarea
                id="c-notes"
                placeholder="Add special roof access info or entry pin-codes..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
              />
            </div>

            <div className="space-y-3 pt-2">
              <Toggle checked={autoRoute} onChange={setAutoRoute} label="Auto-route nearest crew via GPS" />
              
              {!autoRoute && (
                <div className="space-y-1 pt-1 animate-fadeIn">
                  <Label htmlFor="c-tech">Assign Crew Technician</Label>
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
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Queue Dispatch
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default Jobs;
