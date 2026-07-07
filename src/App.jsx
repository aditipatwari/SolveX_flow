import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Zap,
  Sliders
} from 'lucide-react';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Showcase } from './pages/Showcase';
import { Jobs } from './pages/Jobs';
import { Workflow } from './pages/Workflow';
import { Customers } from './pages/Customers';
import { Technicians } from './pages/Technicians';
import { Rules } from './pages/Rules';
import { Knowledge } from './pages/Knowledge';
import { EmptyState } from './components/EmptyState';
import { PageHeader } from './components/PageHeader';

// Helper component for simple routes to show empty state foundation
const PagePlaceholder = ({ title, icon, description }) => {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={`Configure and manage the ${title.toLowerCase()} configurations.`}
        breadcrumbs={[
          { label: 'SolveX Flow', href: '#' },
          { label: title, active: true }
        ]}
      />
      <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-2xs">
        <EmptyState
          title={`No ${title.toLowerCase()} configured`}
          description={description}
          icon={icon}
          actionLabel={`Add ${title.replace(/s$/, '')}`}
          onActionClick={() => alert(`Creating a new ${title.replace(/s$/, '')}...`)}
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <Router>
          <DashboardLayout>
            <Routes>
              {/* Core dashboard route */}
              <Route path="/" element={<Dashboard />} />

              {/* Design system showcase */}
              <Route path="/showcase" element={<Showcase />} />

              {/* Jobs and dispatch flows */}
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/workflow/:id" element={<Workflow />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/technicians" element={<Technicians />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route
                path="/settings"
                element={
                  <PagePlaceholder
                    title="Settings"
                    icon={Sliders}
                    description="Update business details, notification preferences, integration Webhooks, and API keys."
                  />
                }
              />
            </Routes>
          </DashboardLayout>
        </Router>
      </NotificationProvider>
    </AppProvider>
  );
}

export default App;
