import React, { createContext, useState, useContext, useEffect } from 'react';

// Import template configurations
import acService from '../templates/acService.json';
import pestControl from '../templates/pestControl.json';
import carService from '../templates/carService.json';
import clinic from '../templates/clinic.json';
import salon from '../templates/salon.json';
import applianceRepair from '../templates/applianceRepair.json';

const AppContext = createContext(undefined);

export const templatesMap = {
  acService,
  pestControl,
  carService,
  clinic,
  salon,
  applianceRepair
};

export const templatesList = Object.values(templatesMap);

// Define contextual mock datasets per template to make transitions look realistic
const templateMockData = {
  acService: {
    jobs: [
      { id: '1024', customer: 'Alice Cooper', email: 'alice@cooper.com', service: 'AC Preventive Maintenance', technician: 'Dave Miller', price: '$150.00', status: 'completed', priority: 'low', stage: 3, eta: 'Completed', date: '2026-07-06', address: '742 Evergreen Terrace, Springfield', timeline: [{ title: 'Job Completed', time: '10:30 AM', desc: 'SLA verification cleared.' }] },
      { id: '1025', customer: 'Bob Marley', email: 'bob@marley.com', service: 'Compressor Repair', technician: 'Sarah Connor', price: '$420.00', status: 'in-progress', priority: 'critical', stage: 2, eta: '25 mins', date: '2026-07-07', address: '1203 Diablo Ave, San Jose', timeline: [{ title: 'Diagnostics Checked', time: '12:45 PM', desc: 'Identified core coil leak.' }] },
      { id: '1026', customer: 'Charlie Brown', email: 'charlie@peanuts.com', service: 'Air Filter Replacements', technician: 'Alex Rivera', price: '$75.00', status: 'pending', priority: 'medium', stage: 0, eta: '1 hour', date: '2026-07-07', address: '409 Pumpkin Patch Road, Pinecrest', timeline: [{ title: 'Workorder Created', time: '07:45 AM', desc: 'Awaiting scheduling.' }] },
      { id: '1027', customer: 'David Beckham', email: 'david@beckham.com', service: 'Duct Overhaul & Clean', technician: 'Dave Miller', price: '$310.00', status: 'cancelled', priority: 'low', stage: 0, eta: '--', date: '2026-07-05', address: '32 Wembley Way, London Line', timeline: [{ title: 'Cancelled', time: 'Yesterday', desc: 'Customer requested next month.' }] }
    ],
    technicians: [
      { id: 't1', name: 'Dave Miller', email: 'dave@solvexflow.com', phone: '+1 (555) 219-9088', role: 'Senior HVAC Tech', status: 'active', rating: 4.9 },
      { id: 't2', name: 'Sarah Connor', email: 'sarah@solvexflow.com', phone: '+1 (555) 431-8977', role: 'Master HVAC Specialist', status: 'active', rating: 4.8 },
      { id: 't3', name: 'Alex Rivera', email: 'alex@solvexflow.com', phone: '+1 (555) 510-0909', role: 'Operations Lead / Tech', status: 'active', rating: 5.0 }
    ],
    customers: [
      { id: 'c1', name: 'Alice Cooper', phone: '+1 (555) 304-9844', email: 'alice@cooper.com', address: '742 Evergreen Terrace, Springfield', healthScore: 95 },
      { id: 'c2', name: 'Bob Marley', phone: '+1 (555) 832-2300', email: 'bob@marley.com', address: '1203 Diablo Ave, San Jose', healthScore: 100 },
      { id: 'c3', name: 'Charlie Brown', phone: '+1 (555) 762-1100', email: 'charlie@peanuts.com', address: '409 Pumpkin Patch Road, Pinecrest', healthScore: 90 },
      { id: 'c4', name: 'David Beckham', phone: '+1 (555) 543-0909', email: 'david@beckham.com', address: '32 Wembley Way, London Line', healthScore: 80 }
    ]
  },
  pestControl: {
    jobs: [
      { id: '2024', customer: 'Alice Cooper', email: 'alice@cooper.com', service: 'Termite Chemical Spraying', technician: 'Dave Miller', price: '$220.00', status: 'completed', priority: 'medium', stage: 3, eta: 'Completed', date: '2026-07-06', address: '742 Evergreen Terrace, Springfield', timeline: [{ title: 'Treatment Applied', time: '02:30 PM', desc: 'Fumigation complete.' }] },
      { id: '2025', customer: 'Bob Marley', email: 'bob@marley.com', service: 'Bedbug Heat Eradication', technician: 'Sarah Connor', price: '$380.00', status: 'in-progress', priority: 'critical', stage: 2, eta: '40 mins', date: '2026-07-07', address: '1203 Diablo Ave, San Jose', timeline: [{ title: 'Heat Scan', time: '11:00 AM', desc: 'Treatment in progress.' }] },
      { id: '2026', customer: 'Charlie Brown', email: 'charlie@peanuts.com', service: 'Rodent Trapping Setup', technician: 'Alex Rivera', price: '$90.00', status: 'pending', priority: 'low', stage: 0, eta: '2 hours', date: '2026-07-07', address: '409 Pumpkin Patch Road, Pinecrest', timeline: [{ title: 'Assessment Booked', time: '09:00 AM', desc: 'Awaiting dispatch.' }] }
    ],
    technicians: [
      { id: 't1', name: 'Dave Miller', email: 'dave@solvexflow.com', phone: '+1 (555) 219-9088', role: 'Extermination Specialist', status: 'active', rating: 4.7 },
      { id: 't2', name: 'Sarah Connor', email: 'sarah@solvexflow.com', phone: '+1 (555) 431-8977', role: 'Thermal Scan Analyst', status: 'active', rating: 4.9 },
      { id: 't3', name: 'Alex Rivera', email: 'alex@solvexflow.com', phone: '+1 (555) 510-0909', role: 'Pest Safety Inspector', status: 'active', rating: 5.0 }
    ],
    customers: [
      { id: 'c1', name: 'Alice Cooper', phone: '+1 (555) 304-9844', email: 'alice@cooper.com', address: '742 Evergreen Terrace, Springfield', healthScore: 95 },
      { id: 'c2', name: 'Bob Marley', phone: '+1 (555) 832-2300', email: 'bob@marley.com', address: '1203 Diablo Ave, San Jose', healthScore: 100 },
      { id: 'c3', name: 'Charlie Brown', phone: '+1 (555) 762-1100', email: 'charlie@peanuts.com', address: '409 Pumpkin Patch Road, Pinecrest', healthScore: 90 }
    ]
  },
  carService: {
    jobs: [
      { id: '3024', customer: 'Alice Cooper', email: 'alice@cooper.com', service: 'Synthetic Oil & Filter Check', technician: 'Dave Miller', price: '$85.00', status: 'completed', priority: 'low', stage: 3, eta: 'Completed', date: '2026-07-06', address: '742 Evergreen Terrace, Springfield', timeline: [{ title: 'Oil Replaced', time: '11:00 AM', desc: 'Standard filter exchanged.' }] },
      { id: '3025', customer: 'Bob Marley', email: 'bob@marley.com', service: 'Brake Rotor Repair', technician: 'Sarah Connor', price: '$260.00', status: 'in-progress', priority: 'critical', stage: 2, eta: '30 mins', date: '2026-07-07', address: '1203 Diablo Ave, San Jose', timeline: [{ title: 'Rotors Machined', time: '03:15 PM', desc: 'Calipers calibrated.' }] },
      { id: '3026', customer: 'Charlie Brown', email: 'charlie@peanuts.com', service: 'Engine OBD Diagnosis', technician: 'Alex Rivera', price: '$120.00', status: 'pending', priority: 'medium', stage: 0, eta: '1 hour', date: '2026-07-07', address: '409 Pumpkin Patch Road, Pinecrest', timeline: [{ title: 'Intake logged', time: '10:00 AM', desc: 'Awaiting bay opening.' }] }
    ],
    technicians: [
      { id: 't1', name: 'Dave Miller', email: 'dave@solvexflow.com', phone: '+1 (555) 219-9088', role: 'Master Auto Mechanic', status: 'active', rating: 4.8 },
      { id: 't2', name: 'Sarah Connor', email: 'sarah@solvexflow.com', phone: '+1 (555) 431-8977', role: 'OBD Diagnostics Tech', status: 'active', rating: 4.7 },
      { id: 't3', name: 'Alex Rivera', email: 'alex@solvexflow.com', phone: '+1 (555) 510-0909', role: 'Garage Lead / Mechanic', status: 'active', rating: 5.0 }
    ],
    customers: [
      { id: 'c1', name: 'Alice Cooper', phone: '+1 (555) 304-9844', email: 'alice@cooper.com', address: '742 Evergreen Terrace, Springfield', healthScore: 90 },
      { id: 'c2', name: 'Bob Marley', phone: '+1 (555) 832-2300', email: 'bob@marley.com', address: '1203 Diablo Ave, San Jose', healthScore: 100 },
      { id: 'c3', name: 'Charlie Brown', phone: '+1 (555) 762-1100', email: 'charlie@peanuts.com', address: '409 Pumpkin Patch Road, Pinecrest', healthScore: 95 }
    ]
  },
  clinic: {
    jobs: [
      { id: '4024', customer: 'Alice Cooper', email: 'alice@cooper.com', service: 'Annual Teeth Cleaning', technician: 'Dave Miller', price: '$120.00', status: 'completed', priority: 'low', stage: 3, eta: 'Completed', date: '2026-07-06', address: '742 Evergreen Terrace, Springfield', timeline: [{ title: 'Scaling Complete', time: '10:00 AM', desc: 'Polished teeth.' }] },
      { id: '4025', customer: 'Bob Marley', email: 'bob@marley.com', service: 'Root Canal Therapy', technician: 'Sarah Connor', price: '$650.00', status: 'in-progress', priority: 'critical', stage: 2, eta: '15 mins', date: '2026-07-07', address: '1203 Diablo Ave, San Jose', timeline: [{ title: 'Nerve Cleared', time: '01:00 PM', desc: 'Temporary crown placed.' }] },
      { id: '4026', customer: 'Charlie Brown', email: 'charlie@peanuts.com', service: 'Wisdom Tooth Consultation', technician: 'Alex Rivera', price: '$90.00', status: 'pending', priority: 'medium', stage: 0, eta: '10 mins', date: '2026-07-07', address: '409 Pumpkin Patch Road, Pinecrest', timeline: [{ title: 'X-Rays Registered', time: '08:45 AM', desc: 'Awaiting triage room.' }] }
    ],
    technicians: [
      { id: 't1', name: 'Dave Miller', email: 'dave@solvexflow.com', phone: '+1 (555) 219-9088', role: 'Doctor of Dental Surgery', status: 'active', rating: 4.9 },
      { id: 't2', name: 'Sarah Connor', email: 'sarah@solvexflow.com', phone: '+1 (555) 431-8977', role: 'Consulting Orthodontist', status: 'active', rating: 4.8 },
      { id: 't3', name: 'Alex Rivera', email: 'alex@solvexflow.com', phone: '+1 (555) 510-0909', role: 'Lead Dental Hygienist', status: 'active', rating: 5.0 }
    ],
    customers: [
      { id: 'c1', name: 'Alice Cooper', phone: '+1 (555) 304-9844', email: 'alice@cooper.com', address: '742 Evergreen Terrace, Springfield', healthScore: 98 },
      { id: 'c2', name: 'Bob Marley', phone: '+1 (555) 832-2300', email: 'bob@marley.com', address: '1203 Diablo Ave, San Jose', healthScore: 100 },
      { id: 'c3', name: 'Charlie Brown', phone: '+1 (555) 762-1100', email: 'charlie@peanuts.com', address: '409 Pumpkin Patch Road, Pinecrest', healthScore: 92 }
    ]
  },
  salon: {
    jobs: [
      { id: '5024', customer: 'Alice Cooper', email: 'alice@cooper.com', service: 'Haircut & Blowdry Wash', technician: 'Dave Miller', price: '$80.00', status: 'completed', priority: 'low', stage: 3, eta: 'Completed', date: '2026-07-06', address: '742 Evergreen Terrace, Springfield', timeline: [{ title: 'Wash Done', time: '03:15 PM', desc: 'Blowdry styled.' }] },
      { id: '5025', customer: 'Bob Marley', email: 'bob@marley.com', service: 'Hair Bleach & Balayage', technician: 'Sarah Connor', price: '$220.00', status: 'in-progress', priority: 'medium', stage: 2, eta: '50 mins', date: '2026-07-07', address: '1203 Diablo Ave, San Jose', timeline: [{ title: 'Color Setting', time: '04:00 PM', desc: 'Lighter tone lock applied.' }] },
      { id: '5026', customer: 'Charlie Brown', email: 'charlie@peanuts.com', service: 'Nails Gel Manicure', technician: 'Alex Rivera', price: '$45.00', status: 'pending', priority: 'low', stage: 0, eta: '15 mins', date: '2026-07-07', address: '409 Pumpkin Patch Road, Pinecrest', timeline: [{ title: 'Client arrived', time: '09:30 AM', desc: 'Awaiting seat.' }] }
    ],
    technicians: [
      { id: 't1', name: 'Dave Miller', email: 'dave@solvexflow.com', phone: '+1 (555) 219-9088', role: 'Master Hair Stylist', status: 'active', rating: 4.8 },
      { id: 't2', name: 'Sarah Connor', email: 'sarah@solvexflow.com', phone: '+1 (555) 431-8977', role: 'Color Specialists Lead', status: 'active', rating: 4.7 },
      { id: 't3', name: 'Alex Rivera', email: 'alex@solvexflow.com', phone: '+1 (555) 510-0909', role: 'Cosmetics Stylist Spec', status: 'active', rating: 5.0 }
    ],
    customers: [
      { id: 'c1', name: 'Alice Cooper', phone: '+1 (555) 304-9844', email: 'alice@cooper.com', address: '742 Evergreen Terrace, Springfield', healthScore: 96 },
      { id: 'c2', name: 'Bob Marley', phone: '+1 (555) 832-2300', email: 'bob@marley.com', address: '1203 Diablo Ave, San Jose', healthScore: 100 },
      { id: 'c3', name: 'Charlie Brown', phone: '+1 (555) 762-1100', email: 'charlie@peanuts.com', address: '409 Pumpkin Patch Road, Pinecrest', healthScore: 90 }
    ]
  },
  applianceRepair: {
    jobs: [
      { id: '6024', customer: 'Alice Cooper', email: 'alice@cooper.com', service: 'Refrigerator Fan Check', technician: 'Dave Miller', price: '$110.00', status: 'completed', priority: 'medium', stage: 3, eta: 'Completed', date: '2026-07-06', address: '742 Evergreen Terrace, Springfield', timeline: [{ title: 'Motor Replaced', time: '11:15 AM', desc: 'Compressor fan spinning.' }] },
      { id: '6025', customer: 'Bob Marley', email: 'bob@marley.com', service: 'Dryer Heating Element Swap', technician: 'Sarah Connor', price: '$190.00', status: 'in-progress', priority: 'critical', stage: 2, eta: '45 mins', date: '2026-07-07', address: '1203 Diablo Ave, San Jose', timeline: [{ title: 'Diagnostics Checked', time: '10:00 AM', desc: 'Element coil snapped.' }] },
      { id: '6026', customer: 'Charlie Brown', email: 'charlie@peanuts.com', service: 'Washing Machine Install', technician: 'Alex Rivera', price: '$140.00', status: 'pending', priority: 'low', stage: 0, eta: '2 hours', date: '2026-07-07', address: '409 Pumpkin Patch Road, Pinecrest', timeline: [{ title: 'Job Dispatch Booked', time: '08:00 AM', desc: 'Awaiting technician.' }] }
    ],
    technicians: [
      { id: 't1', name: 'Dave Miller', email: 'dave@solvexflow.com', phone: '+1 (555) 219-9088', role: 'Appliance Repair Technician', status: 'active', rating: 4.8 },
      { id: 't2', name: 'Sarah Connor', email: 'sarah@solvexflow.com', phone: '+1 (555) 431-8977', role: 'Electronic Board Specialist', status: 'active', rating: 4.7 },
      { id: 't3', name: 'Alex Rivera', email: 'alex@solvexflow.com', phone: '+1 (555) 510-0909', role: 'Support Tech Dispatcher', status: 'active', rating: 5.0 }
    ],
    customers: [
      { id: 'c1', name: 'Alice Cooper', phone: '+1 (555) 304-9844', email: 'alice@cooper.com', address: '742 Evergreen Terrace, Springfield', healthScore: 94 },
      { id: 'c2', name: 'Bob Marley', phone: '+1 (555) 832-2300', email: 'bob@marley.com', address: '1203 Diablo Ave, San Jose', healthScore: 100 },
      { id: 'c3', name: 'Charlie Brown', phone: '+1 (555) 762-1100', email: 'charlie@peanuts.com', address: '409 Pumpkin Patch Road, Pinecrest', healthScore: 92 }
    ]
  }
};

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Set default business template
  const [currentTemplate, setCurrentTemplate] = useState(() => {
    const saved = localStorage.getItem('solvex_template_id');
    return saved && templatesMap[saved] ? templatesMap[saved] : acService;
  });

  // Load contextual list datasets
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem(`solvex_jobs_${currentTemplate.id}`);
    return saved ? JSON.parse(saved) : (templateMockData[currentTemplate.id]?.jobs || templateMockData.acService.jobs);
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem(`solvex_customers_${currentTemplate.id}`);
    return saved ? JSON.parse(saved) : (templateMockData[currentTemplate.id]?.customers || templateMockData.acService.customers);
  });

  const [technicians, setTechnicians] = useState(() => {
    const saved = localStorage.getItem(`solvex_technicians_${currentTemplate.id}`);
    return saved ? JSON.parse(saved) : (templateMockData[currentTemplate.id]?.technicians || templateMockData.acService.technicians);
  });

  const [user, setUser] = useState({
    name: 'Alex Rivera',
    email: 'alex@solvexflow.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    role: 'Operations Manager',
    businessName: 'SolveX Flow Enterprise'
  });

  // Sync active template ID
  useEffect(() => {
    localStorage.setItem('solvex_template_id', currentTemplate.id);
  }, [currentTemplate]);

  // Sync lists to localStorage
  useEffect(() => {
    localStorage.setItem(`solvex_jobs_${currentTemplate.id}`, JSON.stringify(jobs));
  }, [jobs, currentTemplate]);

  useEffect(() => {
    localStorage.setItem(`solvex_customers_${currentTemplate.id}`, JSON.stringify(customers));
  }, [customers, currentTemplate]);

  useEffect(() => {
    localStorage.setItem(`solvex_technicians_${currentTemplate.id}`, JSON.stringify(technicians));
  }, [technicians, currentTemplate]);

  // Handle template switches
  const changeTemplate = (templateId) => {
    const targetTemplate = templatesMap[templateId];
    if (targetTemplate) {
      setCurrentTemplate(targetTemplate);
      
      // Load or default the data records for this template
      const savedJobs = localStorage.getItem(`solvex_jobs_${templateId}`);
      setJobs(savedJobs ? JSON.parse(savedJobs) : (templateMockData[templateId]?.jobs || []));

      const savedCustomers = localStorage.getItem(`solvex_customers_${templateId}`);
      setCustomers(savedCustomers ? JSON.parse(savedCustomers) : (templateMockData[templateId]?.customers || []));

      const savedTechs = localStorage.getItem(`solvex_technicians_${templateId}`);
      setTechnicians(savedTechs ? JSON.parse(savedTechs) : (templateMockData[templateId]?.technicians || []));
    }
  };

  // Collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateJobStage = (jobId, newStage) => {
    setJobs(prevJobs =>
      prevJobs.map(job => {
        if (job.id === jobId) {
          let status = 'pending';
          let eta = job.eta;
          const stages = currentTemplate.workflowStages;
          const stageName = stages[newStage] || 'Completed';
          const newTimelineItem = {
            title: `Stage Updated: ${stageName}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            desc: `Job advanced to ${stageName.toLowerCase()} stage.`
          };

          if (newStage === 1) {
            status = 'in-progress';
            eta = '15 mins';
          } else if (newStage === 2) {
            status = 'in-progress';
            eta = '5 mins';
          } else if (newStage === 3) {
            status = 'completed';
            eta = 'Completed';
          }

          return {
            ...job,
            stage: newStage,
            status,
            eta,
            timeline: [newTimelineItem, ...job.timeline]
          };
        }
        return job;
      })
    );
  };

  const createJob = (newJob) => {
    setJobs(prev => [newJob, ...prev]);
  };

  const createCustomer = (newCustomer) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const createTechnician = (newTech) => {
    setTechnicians(prev => [newTech, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      sidebarOpen,
      setSidebarOpen,
      currentTemplate,
      changeTemplate,
      templatesList,
      user,
      setUser,
      jobs,
      setJobs,
      customers,
      setCustomers,
      technicians,
      setTechnicians,
      updateJobStage,
      createJob,
      createCustomer,
      createTechnician
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
