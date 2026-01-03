import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Layout from './components/layout/Layout';

// Auth pages
import Login from './features/auth/Login';
import Register from './features/auth/Register';

import Dashboard from './features/dashboard/Dashboard';
import CampaignsList from './features/campaigns/CampaignsList';
import CampaignNew from './features/campaigns/CampaignNew';
import CampaignDetail from './features/campaigns/CampaignDetail';
import Templates from './features/templates/Templates';
import Contacts from './features/contacts/Contacts';
import Persons from './features/persons/Persons';
import AuditLogs from './features/audit/AuditLogs';
import AdminUsers from './features/admin/AdminUsers';
import QueueStatus from './features/queue/QueueStatus';
import Autoresponders from './features/autoresponders/Autoresponders';

import { Box, CircularProgress } from '@mui/material';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
}

// Auth route wrapper (redirects to home if authenticated)
function AuthRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  const { init } = useAuthStore();
  
  useEffect(() => {
    init();
  }, [init]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/campaigns" element={<ProtectedRoute><CampaignsList /></ProtectedRoute>} />
        <Route path="/campaigns/new" element={<ProtectedRoute><CampaignNew /></ProtectedRoute>} />
        <Route path="/campaigns/:id" element={<ProtectedRoute><CampaignDetail /></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
        <Route path="/persons" element={<ProtectedRoute><Persons /></ProtectedRoute>} />
        <Route path="/audit" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
        <Route path="/autoresponders" element={<ProtectedRoute><Autoresponders /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/queue" element={<ProtectedRoute><QueueStatus /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
