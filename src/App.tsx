import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { MySkillsPage } from './pages/MySkillsPage';
import { EvidenceVaultPage } from './pages/EvidenceVaultPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { MentorDashboardPage } from './pages/MentorDashboardPage';
import { PublicPassportPage } from './pages/PublicPassportPage';
import { DiscoverStudentsPage } from './pages/DiscoverStudentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="skills" element={<MySkillsPage />} />
          <Route path="evidence" element={<EvidenceVaultPage />} />
          <Route path="assessments" element={<AssessmentsPage />} />
          <Route path="mentor" element={<MentorDashboardPage />} />
          <Route path="mentor/review/:id" element={<MentorDashboardPage />} />
          <Route path="passport/:id" element={<PublicPassportPage />} />
          <Route path="discover" element={<DiscoverStudentsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="admin" element={<AdminPanelPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

