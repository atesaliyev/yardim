import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import PanelLayout from './components/panel/PanelLayout';
import Login from './pages/panel/Login';
import Dashboard from './pages/admin/Dashboard';
import Guides from './pages/admin/Guides';
import Categories from './pages/admin/Categories';
import Topics from './pages/admin/Topics';
import Users from './pages/admin/Users';
import Settings from './pages/admin/Settings';
import Ads from './pages/admin/Ads';
import Home from './pages/Home';
import PublicCategories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import GuideDetail from './pages/GuideDetail';
import TopicDetail from './pages/TopicDetail';
import GuidesPage from './pages/Guides';
import AskPage from './pages/Ask';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/panel');

  return (
    <>
      {!isAdminRoute && <Header />}
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/kategoriler" element={<PublicCategories />} />
        <Route path="/kategori/:kategori" element={<CategoryDetail />} />
        <Route path="/rehber/:slug" element={<GuideDetail />} />
        <Route path="/kategori/:kategori/:konu/:sayfa?" element={<TopicDetail />} />
        <Route path="/rehberler" element={<GuidesPage />} />
        <Route path="/soru-sor" element={<AskPage />} />

        {/* Admin Panel Routes */}
        <Route path="/panel/login" element={<Login />} />
        <Route path="/panel" element={<PanelLayout />}>
          <Route index element={<Navigate to="/panel/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="guides" element={<Guides />} />
          <Route path="categories" element={<Categories />} />
          <Route path="topics" element={<Topics />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="ads" element={<Ads />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;