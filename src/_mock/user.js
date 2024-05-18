import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------



const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.fullName(),
  company: faker.company.name(),
  isVerified: faker.datatype.boolean(),
  status: sample(['Activo', 'Inactivo']),
  category: sample([
    'Administración y finanzas',
    'Cuidado y nutrición',
    'Desarrollo personal',
    'Diseño Gráfico',
    'Fotografia y Video',
    'Marketing',
    'Programación',
    'Salud y bienestar'
  ]),
  role: sample([
    'Comunicación Asertiva',
    'Branding',
    'Microsoft Excel Intermedio',
    'Liderazgo que inspira',
    'Liderazgo personal ¡Auto lidérate!',
    'Curso de Psicología Infantil',
    'Introducción al HTML',
    'Curso de Primeros Auxilios',
    'Curso de Inyectables',
    'Adobe Photoshop básico',
  ]),
}));

export default users;
