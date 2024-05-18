import { Navigate, useRoutes } from 'react-router-dom';


// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';

//Courses 
import Courses from './pages/courses/index';
import NewCourse from './pages/courses/NewCourse';
import EditCourse from './pages/courses/EditCourse';

// Docente
import Docentes from './pages/docentes/Docentes';
import NewDocente from './pages/docentes/NewDocente';
import EditDocente from './pages/docentes/EditDocente';

// Clientes
import Clientes from './pages/clients/index';
import EditClient from './pages/clients/EditClient';

import NewClient from './pages/clients/NewClient';

// Pagina Web
import PaginaWeb from './pages/Pagina';

// Categorias
import Categorias from './pages/categorias';
import Users from './pages/users';
import Mentoring from './pages/mentoring';
import NewMentoring from './pages/mentoring/NewMentoring';
import EditMentoring from './pages/mentoring/EditMentoring';


// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" /> },
        { path: 'app', element: <DashboardAppPage /> },
        //{ path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },

        { path: 'courses', element: <Courses />},
        { path: 'courses/new-course', element: <NewCourse />},
        { path: 'courses/edit-course/:id', element: <EditCourse />},
        
        { path: 'docentes',element: <Docentes />},
        { path: 'docentes/nuevo-docente', element: <NewDocente />},
        { path: 'docentes/editar-docente/:id', element: <EditDocente />},

        { path: 'mentoring', element: <Mentoring /> },
        { path: 'mentoring/new-mentoring', element: <NewMentoring />},
        { path: 'mentoring/edit-mentoring/:id', element: <EditMentoring /> },

        { path: 'clients', element: <Clientes />},
        { path: 'clients/new-client', element: <NewClient />},
        { path: 'clients/edit-client/:id', element: <EditClient />},

        { path: 'users', element: <Users /> },

        { path: 'paginaweb', element: <PaginaWeb />},

        { path: 'categorias', element: <Categorias />},
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
      
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
