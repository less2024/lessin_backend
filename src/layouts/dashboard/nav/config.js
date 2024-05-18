// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
const icon2 = (name,title) => <img src={`/assets/icons/navbar/${name}.png`} title={`${title}`} alt={`${title}`} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon2('ico_kpi','dashboard'),
  },
  {
    title: 'Cursos',
    path: '/dashboard/courses',
    icon: icon2('ico_cursos','Cursos'),
  },
  {
    title: 'Mentorias',
    path: '/dashboard/mentoring',
    icon: icon2('ico_mentorias','Mentorias'),
  },
  {
    title: 'Categorías',
    path: '/dashboard/categorias',
    icon: icon2('ico_categoria','Categorías'),
  },
  {
    title: 'Docentes',
    path: '/dashboard/docentes',
    icon: icon2('ico_docente','Docentes'),
  },
  {
    title: 'Adm. de clientes',
    path: '/dashboard/users',
    icon: icon2('ico_admin_cli','Adm. de clientes'),
  },
  {
    title: 'Clientes',
    path: '/dashboard/clients',
    icon: icon2('ico_clientes','Clientes'),
  },
  {
    title: 'Página',
    path: '/dashboard/paginaweb',
    icon: icon2('ico_pagina','Página'),
  },
  /*
  {
    title: 'SSO',
    path: '/dashboard/app',
    icon: icon2('ico_sso','SSO'),
  }
  */
];

export default navConfig;
