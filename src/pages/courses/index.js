import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState,useContext  } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';

import InsertLinkIcon from '@mui/icons-material/InsertLink';
import ErrorIcon from '@mui/icons-material/Error';

// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';

// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';


// Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre', alignRight: false },
  { id: 'company', label: 'Categoria', alignRight: false },
  { id: 'role', label: 'Docente', alignRight: false },
  { id: 'status', label: 'Estado', alignRight: false },
  { id: 'link', label: 'link', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.title.rendered.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Cursos() {

  const { jwt  } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [cursos,setCursos] = useState([]);
  const [catList,setCatList] = useState([]);

  const [idCurso,setIdCurso] = useState();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleOpenMenu2 = (id) => {
    setIdCurso(id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = cursos.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  //const baseUrl = 'https://api.lessin.pe/wp-json/wp/v2/cursos?per_page=100';
  const baseUrl = 'https://api.lessin.pe/wp-json/wp/v2/cursos?per_page=100&status=pending,publish'
  const getCursos = ()=>{
    axios.get(baseUrl,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+jwt
      }
    }).then((data)=>{
      setCursos(data.data);
    });
  }

  const baseUrlCat  = 'https://api.lessin.pe/wp-json/wp/v2/categoria';
  const getCat = ()=>{
    axios.get(baseUrlCat).then((data)=>{

      setCatList(data.data);
    });
  }

  const eliminarCurso=(id) =>{
    axios.delete('https://api.lessin.pe/wp-json/wp/v2/cursos/'+id,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+jwt
      }
    }).then((data)=>{
      getCursos();
      setOpen(null);
    }).catch((error) => {
      console.log('error',error)
    });
  } 

  const editRedirect = (id) =>{
    navigate(`/dashboard/courses/edit-course/${id}`)
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cursos.length) : 0;

  const filteredUsers = applySortFilter(cursos, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  useEffect(()=>{
    getCursos();
    getCat();
  },[]);

  return (
    <>
      <Helmet>
        <title> Dashboard | Lessin </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Cursos
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Iconify icon="eva:plus-fill" />}
            component={RouterLink}
            to={'/dashboard/courses/new-course'}
          >
            Nuevo Curso
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} searchText="Buscar por nombre" />

          <Scrollbar>
            <TableContainer sx={{ minWidth: '100%',maxWidth:'100%' }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={cursos.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    //const { id, name, role, status,category, avatarUrl } = row;
                    const { id, title,name, acf, slug,status,date,categoria } = row;
                    const selectedUser = selected.indexOf(title.rendered) !== -1;
                    var categoryName =  '';
                    if(catList.length>0){
                      catList.map((item)=>{
                        if(parseInt(categoria[0]) === parseInt(item.id)){
                          return categoryName = item.name;
                        }
                      })
                    }
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>

                        {false &&
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        }
                        <TableCell component="th" scope="row" padding="left" >
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={title.rendered} src={acf.pcurso_profesor_foto ? acf.pcurso_profesor_foto : ''} />
                            <Typography variant="subtitle2" noWrap>
                              {title.rendered}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{categoryName}</TableCell>
                        <TableCell align="left">{acf.pcurso_profesor}</TableCell>
                        <TableCell align="left">
                          <Label color={(status === 'pending' && 'error') || 'success'}>{status ==='pending' ? 'Borrador':'Publicado'}</Label>
                        </TableCell>
                        <TableCell align="left">
                          {status ==='pending' ?
                            <IconButton  >
                              <ErrorIcon />
                            </IconButton>                          
                          :
                            <IconButton target="_blank" onClick={()=>{window.open('https://lessin.pe/cursos/'+slug, '_blank')}}>
                              <InsertLinkIcon />
                            </IconButton>
                          }
                        </TableCell>

                        <TableCell align="right" onClick={()=>{handleOpenMenu2(id)}}>
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={cursos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={()=>editRedirect(idCurso)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}  onClick={()=>eliminarCurso(idCurso)}  >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }}/>
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
