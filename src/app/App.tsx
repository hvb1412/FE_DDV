import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router';
import { LandingPage } from '@/app/public/landing/LandingPage';
import { LoginPage } from '@/app/public/auth/LoginPage';
import { RegisterPage } from '@/app/public/auth/RegisterPage';
import { DoctorSidebar } from '@/app/doctor/DoctorSidebar';
import { DoctorDashboard } from '@/app/doctor/dashboard/DoctorDashboard';
import { DoctorPatientList } from '@/app/doctor/patients/DoctorPatientList';
import { DoctorPatientProfile } from '@/app/doctor/patients/DoctorPatientProfile';
import { DoctorConsultation } from '@/app/doctor/consultations/DoctorConsultation';
import { DoctorCreateMenu } from '@/app/doctor/nutrition-plans/DoctorCreateMenu';
import { DoctorReferences } from '@/app/doctor/references/DoctorReferences';
import { DoctorNotifications } from '@/app/doctor/notifications/DoctorNotifications';
import { DoctorMenuApproval } from '@/app/doctor/nutrition-plans/DoctorMenuApproval';
import { DoctorPatientReminders } from '@/app/doctor/patients/DoctorPatientReminders';
import { DoctorChat } from '@/app/doctor/consultations/DoctorChat';
import { DoctorProfile } from '@/app/doctor/profile/DoctorProfile';
import { DoctorAppointments } from '@/app/doctor/schedules/DoctorAppointments';
import { Toaster } from '@/app/shared/components/ui/sonner';
import { DoctorTopBar } from '@/app/doctor/DoctorTopBar';
import { ThemeProvider } from '@/app/shared/stores/themeStore';
import { AppointmentProvider } from '@/app/shared/stores/appointmentStore';

import { PatientLayout } from '@/app/patient/PatientLayout';
import { PatientHome } from '@/app/patient/home/PatientHome';
import { PatientMenu } from '@/app/patient/meal-plans/PatientMenu';
import { PatientHealth } from '@/app/patient/health-tracking/PatientHealth';
import { PatientChat } from '@/app/patient/consultations/PatientChat';
import { PatientLearning } from '@/app/patient/learning/PatientLearning';
import { PatientRewards } from '@/app/patient/learning/PatientRewards';
import { PatientAppointments } from '@/app/patient/appointments/PatientAppointments';
import { PatientMyReminders } from '@/app/patient/reminders/PatientMyReminders';
import { PatientNotifications } from '@/app/patient/notifications/PatientNotifications';
import { PatientMyProfile } from '@/app/patient/profile/PatientMyProfile';
import { PatientSettings } from '@/app/patient/profile/PatientSettings';
import { PatientSupport } from '@/app/patient/support/PatientSupport';

import { UserLayout } from '@/app/user/UserLayout';
import { UserHome } from '@/app/user/home/UserHome';
import { UserDishSearch } from '@/app/user/browse-food/UserDishSearch';
import { UserMenuBuilder } from '@/app/user/recipes/UserMenuBuilder';
import { UserSupport } from '@/app/user/support/UserSupport';
import { UserSettings } from '@/app/user/profile/UserSettings';
import { UserProfile } from '@/app/user/profile/UserProfile';
import { UserNotifications } from '@/app/user/notifications/UserNotifications';

// Admin
import { AdminSidebar } from '@/app/admin/AdminSidebar';
import { AdminTopBar } from '@/app/admin/AdminTopBar';
import { AdminDashboard } from '@/app/admin/dashboard/AdminDashboard';
import { AdminUsers } from '@/app/admin/users/AdminUsers';
import { AdminDoctors } from '@/app/admin/users/AdminDoctors';
import { AdminAppointments } from '@/app/admin/appointments/AdminAppointments';
import { AdminContent } from '@/app/admin/content/AdminContent';
import { AdminFoodDB } from '@/app/admin/content/AdminFoodDB';
import { AdminReports } from '@/app/admin/reports/AdminReports';
import { AdminNotifications } from '@/app/admin/notifications/AdminNotifications';
import { AdminSettings } from '@/app/admin/settings/AdminSettings';

// Shared components
import { FoodRecognition } from '@/app/shared/components/FoodRecognition';
import { FoodSearch } from '@/app/shared/components/FoodSearch';
import { DishSearch } from '@/app/shared/components/DishSearch';
import { NutritionCalculator } from '@/app/shared/components/NutritionCalculator';
import { NutritionAssessment } from '@/app/shared/components/NutritionAssessment';
import { AIChat } from '@/app/shared/components/AIChat';
import { NutritionRecommendations } from '@/app/shared/components/NutritionRecommendations';

function DoctorLayout() {
  return (
    <div className="flex w-full h-screen bg-gray-50">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden app-main">
        <DoctorTopBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="flex w-full h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden app-main">
        <AdminTopBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
    <AppointmentProvider>
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* Entry: Login */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Doctor */}
        <Route element={<DoctorLayout />}>
          <Route path="/d" element={<DoctorDashboard />} />
          <Route path="/patients" element={<DoctorPatientList />} />
          <Route path="/patient/:id" element={<DoctorPatientProfile />} />
          <Route path="/consultation" element={<DoctorConsultation />} />
          <Route path="/appointments" element={<DoctorAppointments />} />
          <Route path="/create-menu" element={<DoctorCreateMenu />} />
          <Route path="/menu-approval" element={<DoctorMenuApproval />} />
          <Route path="/reminders" element={<DoctorPatientReminders />} />
          <Route path="/references" element={<DoctorReferences />} />
          <Route path="/notifications" element={<DoctorNotifications />} />
          <Route path="/chat" element={<DoctorChat />} />
          <Route path="/profile" element={<DoctorProfile />} />
        </Route>

        {/* Patient */}
        <Route path="/p" element={<PatientLayout />}>
          <Route path="home" element={<PatientHome />} />
          <Route path="menu" element={<PatientMenu />} />
          <Route path="scan" element={<FoodRecognition userRole="patient" />} />
          <Route path="health" element={<PatientHealth />} />
          <Route path="chat" element={<PatientChat />} />
          <Route path="calculator" element={<NutritionCalculator userRole="patient" />} />
          <Route path="food-search" element={<FoodSearch userRole="patient" />} />
          <Route path="assessment" element={<NutritionAssessment userRole="patient" />} />
          <Route path="qa" element={<AIChat userRole="patient" />} />
          <Route path="recommendations" element={<NutritionRecommendations />} />
          <Route path="learning" element={<PatientLearning />} />
          <Route path="rewards" element={<PatientRewards />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="reminders" element={<PatientMyReminders />} />
          <Route path="notifications" element={<PatientNotifications />} />
          <Route path="profile" element={<PatientMyProfile />} />
          <Route path="settings" element={<PatientSettings />} />
          <Route path="support" element={<PatientSupport />} />
        </Route>
        {/* User (Người dùng) */}
        <Route path="/u" element={<UserLayout />}>
          <Route path="home" element={<UserHome />} />
          <Route path="calculator" element={<NutritionCalculator userRole="user" />} />
          <Route path="food-search" element={<FoodSearch userRole="user" />} />
          <Route path="dish-search" element={<DishSearch />} />
          <Route path="menu-builder" element={<UserMenuBuilder />} />
          <Route path="recommendations" element={<NutritionRecommendations />} />
          <Route path="assessment" element={<NutritionAssessment userRole="user" />} />
          <Route path="qa" element={<AIChat userRole="user" />} />
          <Route path="recognition" element={<FoodRecognition userRole="user" />} />
          <Route path="support" element={<UserSupport />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="notifications" element={<UserNotifications />} />
        </Route>

        {/* Admin */}
        <Route path="/a" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="food-db" element={<AdminFoodDB />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </AppointmentProvider>
    </ThemeProvider>
  );
}
