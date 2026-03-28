// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import Accounts from './pages/Accounts';
// import Transactions from './pages/Transactions';
// import Profile from './pages/Profile';
// import Layout from './component/Layout';
// import AIAssistant from './pages/AIAssistant';

// const Protected = ({ children }) => {
//   const { user, loading } = useAuth();
//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-navy-950">
//       <div className="text-center">
//         <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//         <p className="text-navy-300 font-body">Loading PaisaBank...</p>
//       </div>
//     </div>
//   );
//   return user ? children : <Navigate to="/login" />;
// };

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/" element={<Protected><Layout /></Protected>}>
//             <Route index element={<Dashboard />} />
//             <Route path="accounts" element={<Accounts />} />
//             <Route path="transactions" element={<Transactions />} />
//             <Route path="ai" element={<AIAssistant />} />
//             <Route path="profile" element={<Profile />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Layout       from './component/Layout';
import AdminLayout  from './component/Adminlayout';

import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';
import Accounts     from './pages/Accounts';
import Transactions from './pages/Transactions';
import AIAssistant  from './pages/AIAssistant';
import Profile      from './pages/Profile';

import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminUsers        from './pages/admin/AdminUsers';
import AdminAccounts     from './pages/admin/AdminAccounts';
import AdminTransactions from './pages/admin/AdminTransactions';

/* ── Loading Screen ── */
function Loader() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', backgroundColor:'#020714' }}>
      <div style={{ width:40, height:40, border:'3px solid rgba(245,158,11,0.2)', borderTopColor:'#f59e0b', borderRadius:'50%', animation:'spin 0.7s linear infinite', marginBottom:16 }}/>
      <p style={{ color:'#475569', fontFamily:'sans-serif', fontSize:'0.9rem' }}>Loading paisa-bank-app…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Guards ── */
function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminGuard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function GuestGuard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return !user ? children : <Navigate to="/" replace />;
}

/* ── Routes ── */
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<GuestGuard><Login    /></GuestGuard>} />
      <Route path="/register" element={<GuestGuard><Register /></GuestGuard>} />

      {/* User — nested under Layout */}
      <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
        <Route index             element={<Dashboard    />} />
        <Route path="accounts"   element={<Accounts     />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="ai"         element={<AIAssistant  />} />
        <Route path="profile"    element={<Profile      />} />
      </Route>

      {/* Admin — nested under AdminLayout */}
      <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route index                   element={<AdminDashboard    />} />
        <Route path="users"            element={<AdminUsers        />} />
        <Route path="accounts"         element={<AdminAccounts     />} />
        <Route path="transactions"     element={<AdminTransactions />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}