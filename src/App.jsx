import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Zap,
  Sliders
} from 'lucide-react';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { EmptyState } from './components/EmptyState';
import { PageHeader } from './components/PageHeader';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load page views with named exports mapped to defaults
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Showcase = lazy(() => import('./pages/Showcase').then(module => ({ default: module.Showcase })));
const Jobs = lazy(() => import('./pages/Jobs').then(module => ({ default: module.Jobs })));
const Workflow = lazy(() => import('./pages/Workflow').then(module => ({ default: module.Workflow })));
const Customers = lazy(() => import('./pages/Customers').then(module => ({ default: module.Customers })));
const Technicians = lazy(() => import('./pages/Technicians').then(module => ({ default: module.Technicians })));
const Rules = lazy(() => import('./pages/Rules').then(module => ({ default: module.Rules })));
const Knowledge = lazy(() => import('./pages/Knowledge').then(module => ({ default: module.Knowledge })));

const PageLoadingFallback = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex justify-between items-center pb-6 border-b border-gray-100">
      <div className="space-y-2">
        <div className="h-5 w-40 bg-gray-200/80 rounded" />
        <div className="h-3 w-64 bg-gray-200/80 rounded" />
      </div>
      <div className="h-10 w-24 bg-gray-200/80 rounded" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-20 bg-gray-200/80 rounded-xl" />
      ))}
    </div>
    <div className="h-64 bg-gray-200/80 rounded-xl" />
  </div>
);

// Helper component for simple routes to show empty state foundation
const PagePlaceholder = ({ title, icon, description }) => {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={`Configure and manage the ${title.toLowerCase()} configurations.`}
        breadcrumbs={[
          { label: 'SolveX Flow', to: '/' },
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

export function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <Router>
          <DashboardLayout>
            <ErrorBoundary>
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  {/* Core dashboard route */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Design system showcase */}
                  <Route path="/showcase" element={<Showcase />} />

                  {/* Jobs and dispatch flows */}
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/workflow/:id" element={<Workflow />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/specialists" element={<Technicians />} />
                  <Route path="/automation" element={<Rules />} />
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
              </Suspense>
            </ErrorBoundary>
          </DashboardLayout>
        </Router>
      </NotificationProvider>
    </AppProvider>
  );
}

export default App;
