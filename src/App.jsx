import { useLayoutEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppNativo from './components/client/AppNativo/AppNativo';
import LoadingModal from './components/common/Modals/LoadingModal/LoadingModal';
import AdminRoutes from './routes/admin/AdminRoutes';
import ClientRoutes from './routes/clients/ClientRoutes';
import { getStoredColor, showColor } from './utils/themeMode';

function App() {
  const isLoading = useSelector((state) => state.loading.isLoading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const isUserView = useSelector((state) => state.auth.isUserView);
  const isAdminView = isAuthenticated && isAdmin && !isUserView;

  useLayoutEffect(() => {
    showColor(isAdminView ? 'padrao' : getStoredColor());
  }, [isAdminView]);

  return (
    <Router>
      <div className="App">
        <ToastContainer autoClose={2000} />
        <AppNativo />
        {isLoading && <LoadingModal />}
        <Routes>
          {
            isAuthenticated && isAdmin && !isUserView?
            <Route path="/*" element={<AdminRoutes />} />
            :
            <Route path="/*" element={<ClientRoutes />} />
          }
          </Routes>
      </div>
    </Router>
  );
}

export default App;
