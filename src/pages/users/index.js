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
  Modal,
  Box,
  TextField,
  Grid,
} from '@mui/material';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// components
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
  { id: 'name', label: 'Cliente', alignRight: false },
  { id: '', label: '' },
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 650,
  width:'90%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius:2,
  p: 4,
};

export default function Users() {

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

  const baseUrl  = 'https://api.lessin.pe/wp-json/wp/v2/users?per_page=100';
  const getUsers = ()=>{
    axios.get(baseUrl).then((data)=>{
      setCursos(data.data);
    });
  }

  const eliminarCurso=(id) =>{
    axios.delete('https://api.lessin.pe/wp-json/wp/v2/users'+'/'+id+'?reassign=1&force=true',
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+jwt
      }
    }).then((data)=>{
      getUsers();
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


  // Modal
  const [openCu ,setOpenCu] = useState(false);
  const handleOpenCu = () => setOpenCu(true);
  const handleCloseCu = () => setOpenCu(false);

  const [selectClients, setSelectClients] = useState('');

  const handleSelectClient = (event) => {
    setSelectClients(event.target.value);
  };

  const baseUrlCli  = 'https://api.lessin.pe/wp-json/wp/v2/clientes';
  const [clientsList,setClientsList] = useState();
  const getClientes = ()=>{
    axios.get(baseUrlCli).then((data)=>{
      setClientsList(data.data);
    });
  }

  const [userForm,setUserForm] = useState({
    username:'',
    password:''
  });

  const handleRegForm = (e)=>{
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value
    })
  }

  const registerUser =()=>{
    axios.post('https://api.lessin.pe/wp-json/wp/v2/users',
    {
      username:userForm.username,
      email:userForm.username+'@'+selectClients.slug+'.com',
      password:userForm.password,
      roles:"subscriber",
      acf: {
          uc_id: selectClients.id,
          nombre: selectClients.slug
      }
    },
    {
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ jwt
      }
    })
      .then(()=>{
        console.log('usuario creado')
        setOpenCu(false);
        setUserForm({
          username:'',
          password:''
        })
        getUsers();
      }).catch((errr)=>{
        console.log(errr)
      })
  }


  useEffect(()=>{
    getUsers();
    getClientes();
  },[]);

  return (
    <>
      <Helmet>
        <title> Usuarios | Lessin </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Usuarios
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenCu}
          >
            Nuevo usuario
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
                    const { id, name} = row;
                    const selectedUser = selected.indexOf(name) !== -1;
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        {false &&
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        }
                        <TableCell component="th" scope="row" padding="left">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={''} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{name}</TableCell>

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

      <Modal
        open={openCu}
        onClose={handleCloseCu}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 sx={{mt:0}}>Crear usuario</h2>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField id="outlined-basic" onChange={handleRegForm} name="username" fullWidth label="Usuario" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField id="outlined-basic" onChange={handleRegForm} name="password" fullWidth label="Clave" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Clientes</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectClients}
                  label="ClientesList"
                  onChange={handleSelectClient}
                >
                  {clientsList &&
                    clientsList.length > 0 &&
                    clientsList.map((item)=>{
                      return(
                        <MenuItem value={item}>{item.title.rendered}</MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' onClick={registerUser}>
                Registrar
              </Button>
            </Grid>
          </Grid>
        </Box>

      </Modal>

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
