import { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router';
import { LoginForm } from './components/forms/LoginForm';
import { MainPage } from './pages/MainPage';
import { AuthContext } from './context/authContext';
import { LandingPage } from './pages/LandingPage';
import { SignupForm } from './components/forms/SignupForm';
import { AvaliableProducts } from './components/products/AvaliableProductsList';
import { EndPage } from './pages/EndPage';
import { ToastContainer } from "react-toastify";
import { NotFound } from './pages/NotFound';
import { lazy, Suspense } from 'react';


const AdminDashboard = lazy(() => import('./components/adminPanel/AdminDashboard'));

function App() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.state.isLoggedIn;
  const isAdmin = authCtx.state.isAdmin;
  const isOrderStarted = localStorage.getItem('orderId');
  console.log(isOrderStarted);
  return (
    <>
      <ToastContainer />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={isLoggedIn && isOrderStarted ? <Navigate to='/products' replace={true} /> : isLoggedIn ? <MainPage /> : <LandingPage />}></Route>
          <Route path='/login' element={isLoggedIn ? <Navigate to='/' /> : <LoginForm />}></Route>
          <Route path='/signup' element={isLoggedIn ? <Navigate to='/' /> : <SignupForm />}></Route>
          <Route path='/products' element={<AvaliableProducts />}></Route>
          <Route path='/admin-panel' element={isAdmin ? <AdminDashboard /> : <NotFound />}></Route>
          <Route path='/next-order/:id' element={isLoggedIn ? <EndPage /> : <NotFound />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
