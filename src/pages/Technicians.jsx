import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Mail,
  Phone,
  Star,
  User,
  PhoneCall
} from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/Progress';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/Modal';
import { Label, Input, FormHelperText, Select } from '../components/FormControl';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';
import { EmptyState } from '../components/EmptyState';

export const Technicians = () => {
  const { currentTemplate, technicians, createTechnician, jobs } = useApp();
  const { addNotification } = useNotifications();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [techName, setTechName] = useState('');
  const [techEmail, setTechEmail] = useState('');
  const [techPhone, setTechPhone] = useState('');
  const [techRole, setTechRole] = useState(() => {
    if (currentTemplate.id === 'clinic') return 'Resident Doctor';
    if (currentTemplate.id === 'salon') return 'Senior Hair Stylist';
    if (currentTemplate.id === 'pestControl') return 'Exterminator Specialist';
    if (currentTemplate.id === 'carService') return 'Master Auto Mechanic';
    return 'HVAC Service Tech';
  });
  const [formError, setFormError] = useState(false);

  // Sync default role value on template shift
  useEffect(() => {
    if (currentTemplate.id === 'clinic') setTechRole('Resident Doctor');
    else if (currentTemplate.id === 'salon') setTechRole('Senior Hair Stylist');
    else if (currentTemplate.id === 'pestControl') setTechRole('Exterminator Specialist');
    else if (currentTemplate.id === 'carService') setTechRole('Master Auto Mechanic');
    else setTechRole('HVAC Service Tech');
  }, [currentTemplate]);

  // Filter technicians
  const filteredTechs = technicians.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute active workload for each technician dynamically from jobs list
  const getDynamicWorkload = (name) => {
    return jobs.filter(j => j.technician === name && j.status === 'in-progress').length;
  };

  const getWorkloadProgress = (workloadCount) => {
    // 0 = 0%, 1 = 33%, 2 = 66%, 3+ = 100%
    return Math.min(workloadCount * 33.3, 100);
  };

  const getWorkloadVariant = (workloadCount) => {
    if (workloadCount >= 3) return 'danger';
    if (workloadCount >= 2) return 'warning';
    return 'success';
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!techName || !techEmail || !techPhone) {
      setFormError(true);
      return;
    }

    const randomId = 't' + Math.floor(100 + Math.random() * 900).toString();
    const newTech = {
      id: randomId,
      name: techName,
      email: techEmail,
      phone: techPhone,
      role: techRole,
      status: 'active',
      rating: 5.0
    };

    createTechnician(newTech);
    setIsModalOpen(false);
    setFormError(false);

    // Reset values
    setTechName('');
    setTechEmail('');
    setTechPhone('');

    addNotification({
      title: `${currentTemplate.terminology.technician} Added`,
      description: `${newTech.name} has been added to dispatches.`,
      type: 'success',
      category: 'workflow'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`${currentTemplate.terminology.technician} Registry`}
        description={`Monitor ${currentTemplate.terminology.technician.toLowerCase()} availability schedules, workload distribution, and performance stats.`}
        breadcrumbs={[
          { label: 'SolveX Flow', to: '/' },
          { label: currentTemplate.terminology.technician, active: true }
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Register {currentTemplate.terminology.technician}
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 bg-primary-50 text-primary-600 border border-primary-100/50 rounded-lg flex items-center justify-center font-bold text-base">
            {technicians.length}
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active {currentTemplate.terminology.technician}s</p>
            <p className="text-xs text-gray-700 font-semibold mt-0.5">Dispatched specialists</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-lg flex items-center justify-center font-bold text-base">
            {technicians.filter(t => t.status === 'active').length}
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Available {currentTemplate.terminology.technician}s</p>
            <p className="text-xs text-gray-700 font-semibold mt-0.5">Online & GPS connected</p>
          </div>
        </div>
      </div>

      {/* Control Search Bar */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs flex items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search by ${currentTemplate.terminology.technician.toLowerCase()} name, role, email...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs font-normal pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-250 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Technician Cards Grid */}
      {filteredTechs.length === 0 ? (
        <EmptyState
          title={`No ${currentTemplate.terminology.technician.toLowerCase()}s matched`}
          description="Try adjusting your filter search terms or register a new crew member."
          icon={UserCheck}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechs.map((tech) => {
            const activeWorkload = getDynamicWorkload(tech.name);
            const workloadPct = getWorkloadProgress(activeWorkload);
            const workloadVar = getWorkloadVariant(activeWorkload);

            return (
              <Card key={tech.id} hoverable={true} className="flex flex-col h-full">
                <CardHeader className="pb-3 border-b-0 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary-50 text-primary-700 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-primary-100">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-gray-900">{tech.name}</CardTitle>
                      <CardDescription className="text-xs font-medium text-gray-500 mt-0">
                        {tech.role}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="success" styleType="subtle" showDot={true}>
                    Online
                  </Badge>
                </CardHeader>

                <CardContent className="py-2 flex-1 space-y-4">
                  {/* Contacts */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{tech.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{tech.phone}</span>
                    </div>
                  </div>

                  {/* Dynamic Workload progress */}
                  <div className="space-y-1.5 border-t border-gray-50 pt-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-gray-500">Active Workload:</span>
                      <span className="text-gray-800">
                        {activeWorkload} {activeWorkload === 1 ? currentTemplate.terminology.service : currentTemplate.terminology.servicePlural} dispatched
                      </span>
                    </div>
                    <ProgressBar
                      value={workloadPct || 5} // default small line to show track
                      variant={workloadVar}
                      size="sm"
                    />
                  </div>
                </CardContent>

                <CardFooter className="pt-3 pb-4 bg-gray-50/20 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                    <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
                    <span>{tech.rating?.toFixed(1) || '5.0'}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 text-[11px] font-semibold border-gray-250"
                    leftIcon={<PhoneCall className="h-3.5 w-3.5" />}
                    onClick={() => alert(`Calling ${tech.name} at ${tech.phone}...`)}
                  >
                    Call {currentTemplate.terminology.technician}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Register Technician Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <ModalHeader onClose={() => setIsModalOpen(false)}>
          <ModalTitle>Register {currentTemplate.terminology.technician}</ModalTitle>
          <p className="text-[11px] text-gray-400 mt-1 font-normal leading-none">Add new crew {currentTemplate.terminology.technician.toLowerCase()} details to dispatch database.</p>
        </ModalHeader>
        <form onSubmit={handleAddSubmit}>
          <ModalContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="tech-name" error={formError && !techName}>{currentTemplate.terminology.technician} Full Name</Label>
              <Input
                id="tech-name"
                placeholder="e.g. Dave Miller"
                value={techName}
                onChange={(e) => setTechName(e.target.value)}
                error={formError && !techName}
                leftIcon={<User className="h-4 w-4" />}
              />
              {formError && !techName && <FormHelperText error>Name is required</FormHelperText>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="tech-email" error={formError && !techEmail}>Email Address</Label>
              <Input
                id="tech-email"
                type="email"
                placeholder="specialist@solvexflow.com"
                value={techEmail}
                onChange={(e) => setTechEmail(e.target.value)}
                error={formError && !techEmail}
                leftIcon={<Mail className="h-4 w-4" />}
              />
              {formError && !techEmail && <FormHelperText error>Email is required</FormHelperText>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="tech-phone" error={formError && !techPhone}>Phone Number</Label>
              <Input
                id="tech-phone"
                placeholder="+1 (555) 219-9088"
                value={techPhone}
                onChange={(e) => setTechPhone(e.target.value)}
                error={formError && !techPhone}
                leftIcon={<Phone className="h-4 w-4" />}
              />
              {formError && !techPhone && <FormHelperText error>Phone number is required</FormHelperText>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="tech-role">Capability Role</Label>
              <Select id="tech-role" value={techRole} onChange={(e) => setTechRole(e.target.value)}>
                {currentTemplate.id === 'clinic' ? (
                  <>
                    <option value="Doctor of Dental Surgery">Doctor of Dental Surgery</option>
                    <option value="Consulting Orthodontist">Consulting Orthodontist</option>
                    <option value="Lead Dental Hygienist">Lead Dental Hygienist</option>
                  </>
                ) : currentTemplate.id === 'salon' ? (
                  <>
                    <option value="Master Hair Stylist">Master Hair Stylist</option>
                    <option value="Color Specialists Lead">Color Specialists Lead</option>
                    <option value="Cosmetics Stylist Spec">Cosmetics Stylist Spec</option>
                  </>
                ) : currentTemplate.id === 'carService' ? (
                  <>
                    <option value="Master Auto Mechanic">Master Auto Mechanic</option>
                    <option value="OBD Diagnostics Tech">OBD Diagnostics Tech</option>
                    <option value="Garage Lead / Mechanic">Garage Lead / Mechanic</option>
                  </>
                ) : currentTemplate.id === 'pestControl' ? (
                  <>
                    <option value="Extermination Specialist">Extermination Specialist</option>
                    <option value="Thermal Scan Analyst">Thermal Scan Analyst</option>
                    <option value="Pest Safety Inspector">Pest Safety Inspector</option>
                  </>
                ) : currentTemplate.id === 'applianceRepair' ? (
                  <>
                    <option value="Appliance Repair Technician">Appliance Repair Technician</option>
                    <option value="Electronic Board Specialist">Electronic Board Specialist</option>
                    <option value="Support Tech Dispatcher">Support Tech Dispatcher</option>
                  </>
                ) : (
                  <>
                    <option value="Senior HVAC Tech">Senior HVAC Tech</option>
                    <option value="Master HVAC Specialist">Master HVAC Specialist</option>
                    <option value="Operations Lead / Tech">Operations Lead / Tech</option>
                  </>
                )}
              </Select>
            </div>
          </ModalContent>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Register {currentTemplate.terminology.technician}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default Technicians;
