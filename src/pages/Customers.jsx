import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  User
} from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/Table';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/Modal';
import { Label, Input, FormHelperText } from '../components/FormControl';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';
import { EmptyState } from '../components/EmptyState';

export const Customers = () => {
  const { currentTemplate, customers, createCustomer } = useApp();
  const { addNotification } = useNotifications();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [formError, setFormError] = useState(false);

  // Filter customers list
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute metrics
  const totalCust = customers.length;
  const avgHealth = Math.round(
    customers.reduce((acc, c) => acc + (c.healthScore || 100), 0) / (totalCust || 1)
  );

  const getHealthBadgeVariant = (score) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'warning';
    return 'danger';
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!custName || !custEmail || !custPhone || !custAddress) {
      setFormError(true);
      return;
    }

    const randomId = 'c' + Math.floor(100 + Math.random() * 900).toString();
    const newCust = {
      id: randomId,
      name: custName,
      email: custEmail,
      phone: custPhone,
      address: custAddress,
      healthScore: 100
    };

    createCustomer(newCust);
    setIsModalOpen(false);
    setFormError(false);

    // Reset values
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustAddress('');

    addNotification({
      title: `${currentTemplate.terminology.customer} Added`,
      description: `${newCust.name} added to directory.`,
      type: 'success',
      category: 'customer'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`${currentTemplate.terminology.customer} Directory`}
        description={`Manage ${currentTemplate.terminology.customer.toLowerCase()} service profiles, history logs, and communication channels.`}
        breadcrumbs={[
          { label: 'SolveX Flow', href: '#' },
          { label: currentTemplate.terminology.customer, active: true }
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add {currentTemplate.terminology.customer}
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 bg-primary-50 text-primary-600 border border-primary-100/50 rounded-lg flex items-center justify-center font-bold text-base">
            {totalCust}
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Accounts</p>
            <p className="text-xs text-gray-700 font-semibold mt-0.5">Active directory records</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-lg flex items-center justify-center font-bold text-base">
            {avgHealth}%
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Average Health Compliance</p>
            <p className="text-xs text-gray-700 font-semibold mt-0.5">Calculated loyalty status</p>
          </div>
        </div>
      </div>

      {/* Control Search Bar */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs flex items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search by ${currentTemplate.terminology.customer.toLowerCase()} name, phone, address, or email...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs font-normal pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-250 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          title={`No ${currentTemplate.terminology.customer.toLowerCase()}s matched`}
          description={`Try adjusting your filter search text or register a new ${currentTemplate.terminology.customer.toLowerCase()} account.`}
          icon={Users}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow hoverable={false}>
              <TableHead>{currentTemplate.terminology.customer}</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Billing Address</TableHead>
              <TableHead align="center">Health score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((cust) => (
              <TableRow key={cust.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 bg-primary-50 text-primary-700 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                      {cust.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-semibold text-gray-900">{cust.name}</span>
                  </div>
                </TableCell>
                <TableCell numeric className="text-gray-650 font-medium">
                  {cust.phone}
                </TableCell>
                <TableCell className="text-gray-500">
                  {cust.email}
                </TableCell>
                <TableCell className="text-gray-500 font-normal max-w-xs truncate">
                  {cust.address}
                </TableCell>
                <TableCell align="center">
                  <Badge
                    variant={getHealthBadgeVariant(cust.healthScore)}
                    styleType="subtle"
                    showDot={true}
                  >
                    {cust.healthScore}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add Customer Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <ModalHeader onClose={() => setIsModalOpen(false)}>
          <ModalTitle>Register New Account</ModalTitle>
          <p className="text-[11px] text-gray-400 mt-1 font-normal leading-none">Register and save new {currentTemplate.terminology.customer.toLowerCase()} contact info.</p>
        </ModalHeader>
        <form onSubmit={handleAddSubmit}>
          <ModalContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="cust-name" error={formError && !custName}>{currentTemplate.terminology.customer} Full Name</Label>
              <Input
                id="cust-name"
                placeholder="e.g. Robert Downey"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                error={formError && !custName}
                leftIcon={<User className="h-4 w-4" />}
              />
              {formError && !custName && <FormHelperText error>Name is required</FormHelperText>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="cust-email" error={formError && !custEmail}>Email Address</Label>
              <Input
                id="cust-email"
                type="email"
                placeholder="robert@downey.com"
                value={custEmail}
                onChange={(e) => setCustEmail(e.target.value)}
                error={formError && !custEmail}
                leftIcon={<Mail className="h-4 w-4" />}
              />
              {formError && !custEmail && <FormHelperText error>Email is required</FormHelperText>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="cust-phone" error={formError && !custPhone}>Phone Number</Label>
              <Input
                id="cust-phone"
                placeholder="+1 (555) 902-8811"
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                error={formError && !custPhone}
                leftIcon={<Phone className="h-4 w-4" />}
              />
              {formError && !custPhone && <FormHelperText error>Phone number is required</FormHelperText>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="cust-address" error={formError && !custAddress}>Billing / Service Address</Label>
              <Input
                id="cust-address"
                placeholder="109 Malibu Road, Cliffside"
                value={custAddress}
                onChange={(e) => setCustAddress(e.target.value)}
                error={formError && !custAddress}
                leftIcon={<MapPin className="h-4 w-4 text-gray-400" />}
              />
              {formError && !custAddress && <FormHelperText error>Address is required</FormHelperText>}
            </div>
          </ModalContent>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Register {currentTemplate.terminology.customer}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
