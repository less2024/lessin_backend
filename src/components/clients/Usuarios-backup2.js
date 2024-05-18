import { useState,useContext,useEffect } from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import { useParams } from "react-router-dom";
import { faker } from '@faker-js/faker';

// @mui
import { 
    Card,
    Box,
    Stack,
    Button,
    TableContainer,
    Table,
    TableHead,
    Popover,
    MenuItem,
    Modal,
    Typography,
    TablePagination,
    TableRow,
    styled,
    TableBody,
    TextField ,
    TableCell,
    IconButton,
    Paper 
 } from '@mui/material';

// Iconos
import Iconify from '../../components/iconify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';



const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


 // Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";

import AddIcon from '@mui/icons-material/Add';
import { UserListHead, UserListToolbar } from 'src/sections/@dashboard/user';
import Scrollbar from '../scrollbar';

ClientUsuarios.propTypes = {
  updateState:PropTypes.func
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    borderRadius:2,
    boxShadow: 24,
    p: 4,
}

const TABLE_HEAD = [
    { id: 'usuario', label: 'Usuario', minWidth: 100 },
    //{ id: 'id', label: 'id', minWidth: 100 },
    { id: 'name', label: 'Nombres', minWidth: 200 },
    { id: 'dni', label: 'DNI', minWidth: 100 },
    { id: 'clave', label: 'Clave', minWidth: 100 },
    { id: 'correo', label: 'Correo', minWidth: 170 },
    { id: 'telefono', label: 'Teléfono', minWidth: 100 },
    { id: 'action', label: 'Action', minWidth: 100 }
];
  
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
      return filter(array, (_user) => _user.dni.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
  }

function ClientUsuarios({updateState,...other}) {

    const { jwt  } = useContext(UserContext);
    const { id } = useParams();

    const [totalUser,setTotalUser] = useState(null);

    const getUsuarios = (idcompany,selectRows,selectIni) =>{

        updateState(true)

        const rowsRequest = 50000;

        axios.post('https://api.lessin.pe/wp-json/usuarios/v1/clienteDash',{
            forcompany:id
        })

        .then((resp)=>{
            setTotalUser(resp.data[0])

            axios.post('https://api.lessin.pe/wp-json/usuarios/v1/cliente',
                {
                    idCliente:idcompany,
                    rows:rowsRequest,
                    desde:0
                },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                }
            }).then((respCli)=>{
                setRows(respCli.data)
                setRowsTmp(respCli.data)
                updateState(false)
                console.log('1')
                if( parseInt(resp.data[0].total) >= 50000){
                    axios.post('https://api.lessin.pe/wp-json/usuarios/v1/cliente',
                        {
                            idCliente:idcompany,
                            rows:rowsRequest,
                            desde:50000
                        },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwt}`
                        }
                    }).then((respCli2)=>{
                        const respUnify = [...respCli.data,...respCli2.data]
                        setRows(respUnify)
                        setRowsTmp(respUnify)
                        updateState(false)
                        console.log('2')
                        if( parseInt(resp.data[0].total) >= 100000){
                            axios.post('https://api.lessin.pe/wp-json/usuarios/v1/cliente',
                                {
                                    idCliente:idcompany,
                                    rows:rowsRequest,
                                    desde:100000
                                },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${jwt}`
                                }
                            }).then((respCli3)=>{
                                const respUnify2 = [...respCli.data,...respCli2.data,...respCli3.data]
                                setRows(respUnify2)
                                setRowsTmp(respUnify2)
                                updateState(false)
                                console.log('3')
                                if( parseInt(resp.data[0].total) >= 150000){
                                    axios.post('https://api.lessin.pe/wp-json/usuarios/v1/cliente',
                                        {
                                            idCliente:idcompany,
                                            rows:rowsRequest,
                                            desde:150000
                                        },
                                    {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${jwt}`
                                        }
                                    }).then((respCli4)=>{
                                        const respUnify3 = [...respCli.data,...respCli2.data,...respCli3.data,...respCli4.data]
                                        setRows(respUnify3)
                                        setRowsTmp(respUnify3)
                                        updateState(false)
                                        console.log('4')
                                        if( parseInt(resp.data[0].total) >= 200000){
                                            axios.post('https://api.lessin.pe/wp-json/usuarios/v1/cliente',
                                                {
                                                    idCliente:idcompany,
                                                    rows:rowsRequest,
                                                    desde:200000
                                                },
                                            {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwt}`
                                                }
                                            }).then((respCli5)=>{
                                                const respUnify4 = [...respCli.data,...respCli2.data,...respCli3.data,...respCli4.data,...respCli5.data]
                                                setRows(respUnify4)
                                                setRowsTmp(respUnify4)
                                                updateState(false)
                                                console.log('5')
                                                if( parseInt(resp.data[0].total) >= 250000){
                                                    axios.post('https://api.lessin.pe/wp-json/usuarios/v1/cliente',
                                                        {
                                                            idCliente:idcompany,
                                                            rows:rowsRequest,
                                                            desde:250000
                                                        },
                                                    {
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': `Bearer ${jwt}`
                                                        }
                                                    }).then((respCli6)=>{
                                                        const respUnify5 = [...respCli.data,...respCli2.data,...respCli3.data,...respCli4.data,...respCli5.data,...respCli6.data]
                                                        setRows(respUnify5)
                                                        setRowsTmp(respUnify5)
                                                        updateState(false)
                                                        console.log('6')
                                                        if( parseInt(resp.data[0].total) >= 300000){
                                                            axios.post('https://api.lessin.pe/wp-json/usuarios/v1/cliente',
                                                                {
                                                                    idCliente:idcompany,
                                                                    rows:rowsRequest,
                                                                    desde:300000
                                                                },
                                                            {
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    'Authorization': `Bearer ${jwt}`
                                                                }
                                                            }).then((respCli7)=>{
                                                                const respUnify6 = [...respCli.data,...respCli2.data,...respCli3.data,...respCli4.data,...respCli5.data,...respCli6.data,...respCli7.data]
                                                                setRows(respUnify6)
                                                                setRowsTmp(respUnify6)
                                                                updateState(false)
                                                                console.log('7')
                                                                if( parseInt(resp.data[0].total) >= 350000){
                                                                    axios.post('https://api.lessin.pe/wp-json/usuarios/v1/cliente',
                                                                        {
                                                                            idCliente:idcompany,
                                                                            rows:rowsRequest,
                                                                            desde:350000
                                                                        },
                                                                    {
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                            'Authorization': `Bearer ${jwt}`
                                                                        }
                                                                    }).then((respCli8)=>{
                                                                        const respUnify7 = [...respCli.data,...respCli2.data,...respCli3.data,...respCli4.data,...respCli5.data,...respCli6.data,...respCli7.data,...respCli8.data]
                                                                        setRows(respUnify7)
                                                                        setRowsTmp(respUnify7)
                                                                        updateState(false)
                                                                        console.log('8')
                                                                        if( parseInt(resp.data[0].total) >= 400000){
                                                                            axios.post('https://api.lessin.pe/wp-json/usuarios/v1/cliente',
                                                                                {
                                                                                    idCliente:idcompany,
                                                                                    rows:rowsRequest,
                                                                                    desde:400000
                                                                                },
                                                                            {
                                                                                headers: {
                                                                                    'Content-Type': 'application/json',
                                                                                    'Authorization': `Bearer ${jwt}`
                                                                                }
                                                                            }).then((respCli9)=>{
                                                                                const respUnify8 = [...respCli.data,...respCli2.data,...respCli3.data,...respCli4.data,...respCli5.data,...respCli6.data,...respCli7.data,...respCli8.data,...respCli9.data]
                                                                                setRows(respUnify8)
                                                                                setRowsTmp(respUnify8)
                                                                                updateState(false)
                                                                                console.log('9')
                                                                                if( parseInt(resp.data[0].total) >= 450000){
                                                                                    axios.post('https://api.lessin.pe/wp-json/usuarios/v1/cliente',
                                                                                        {
                                                                                            idCliente:idcompany,
                                                                                            rows:rowsRequest,
                                                                                            desde:450000
                                                                                        },
                                                                                    {
                                                                                        headers: {
                                                                                            'Content-Type': 'application/json',
                                                                                            'Authorization': `Bearer ${jwt}`
                                                                                        }
                                                                                    }).then((respCli10)=>{
                                                                                        const respUnify9 = [...respCli.data,...respCli2.data,...respCli3.data,...respCli4.data,...respCli5.data,...respCli6.data,...respCli7.data,...respCli8.data,...respCli9.data,respCli10.data]
                                                                                        setRows(respUnify9)
                                                                                        setRowsTmp(respUnify9)
                                                                                        updateState(false)
                                                                                        console.log('10')
                                                                                        if( parseInt(resp.data[0].total) >= 500000){
                                                                                            axios.post('https://api.lessin.pe/wp-json/usuarios/v1/cliente',
                                                                                                {
                                                                                                    idCliente:idcompany,
                                                                                                    rows:rowsRequest,
                                                                                                    desde:500000
                                                                                                },
                                                                                            {
                                                                                                headers: {
                                                                                                    'Content-Type': 'application/json',
                                                                                                    'Authorization': `Bearer ${jwt}`
                                                                                                }
                                                                                            }).then((respCli11)=>{
                                                                                                const respUnify10 = [...respCli.data,...respCli2.data,...respCli3.data,...respCli4.data,...respCli5.data,...respCli6.data,...respCli7.data,...respCli8.data,...respCli9.data,respCli10.data,respCli11.data]
                                                                                                setRows(respUnify10)
                                                                                                setRowsTmp(respUnify10)
                                                                                                updateState(false)
                                                                                                console.log('10')
                                                                        
                                                                                            }).catch((error)=>{
                                                                                                console.log(error)
                                                                                            })
                                                                                        }
                                                                
                                                                                    }).catch((error)=>{
                                                                                        console.log(error)
                                                                                    })
                                                                                }
                                                        
                                                                            }).catch((error)=>{
                                                                                console.log(error)
                                                                            })
                                                                        }
                                                
                                                                    }).catch((error)=>{
                                                                        console.log(error)
                                                                    })
                                                                }
                                        
                                                            }).catch((error)=>{
                                                                console.log(error)
                                                            })
                                                        }
                                
                                                    }).catch((error)=>{
                                                        console.log(error)
                                                    })
                                                }
                        
                                            }).catch((error)=>{
                                                console.log(error)
                                            })
                                        }
                
                                    }).catch((error)=>{
                                        console.log(error)
                                    })
                                }
        
                            }).catch((error)=>{
                                console.log(error)
                            })
                        }

                    }).catch((error)=>{
                        console.log(error)
                    })
                }

            }).catch((error)=>{
                console.log(error)
            })
        }).then((errr)=>{
            console.log(errr)
        })

    }

    useEffect(()=>{
        getUsuarios(id);
    },[]);

    // CSV
    const [rows, setRows] = useState([]);
    const [rowsTmp, setRowsTmp] = useState([]);
    
    const fileReader = new FileReader();

    const changeCSV = (e) => {
        fileReader.onload = function (event) {
            const text = event.target.result;
            csvFileToArray(text);
        };
        fileReader.readAsText(e.target.files[0], 'ISO-8859-1');
    };

    const csvFileToArray = string => {
        const csvHeader = string.slice(0, string.indexOf("\n")).split(";");
        const csvRows = string.slice(string.indexOf("\n")+1).split("\n");
        const arrayFinal = [];

        csvRows.pop();

        const array = csvRows.map((i,iiiii) => {
            const values = i.split(";");
            const obj = csvHeader.reduce((object, header, index) => {
                
                if(index === 3){
                    object[header.replace(/[^\w\s]/gi, '')] = values[index];
                    return object;
                }else{
                    object[header.replace(/[^\w\s]/gi, '')] = values[index].replace(/[^\w\s]/gi, '');
                    return object;  
                }
                
            }, {});
            return obj;
        });

        array.map((item)=>{
            console.log(item)
            arrayFinal.push({
                clave: item.clave === '' ? item.dni : item.clave,
                correo: item.correo,
                dni: item.dni,
                nombres_completos: item.nombres_completos,
                telefono: item.telefono,
                usuario: item.usuario === '' ? item.dni : item.usuario
            })
        })
        setRows(arrayFinal);
    };

    
    const uploadCSV = () =>{
        updateState(true);

        const result1 = rows.filter(function(o1){
            return !rowsTmp.some(function(o2){
               return o1.dni == o2.dni;
             });
        });

        const result2 = rowsTmp.filter(function(o1){
            return !rows.some(function(o2){
               return o1.dni == o2.dni;
             });
        });

        if(result1.length > 0){

            axios.post('https://api.lessin.pe/wp-json/usuarios/v1/post',[result1,id],
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                }
            }).then((data)=>{
                updateState(false)
                if(result2.length > 0 ){
                    axios.post('https://api.lessin.pe/wp-json/usuarios/v1/removeBulkUser',[result2,id],
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwt}`
                        }
                    }).then((data)=>{
                        updateState(false)
                        console.log(result2);
                    }).catch((error) => {
                        console.log('error',error);
                    });
                }
        
            }).catch((error) => {
                console.log('error',error);
            }); 
        }else{
            axios.post('https://api.lessin.pe/wp-json/usuarios/v1/removeBulkUser',[result2,id],
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                }
            }).then((data)=>{
                updateState(false)
            }).catch((error) => {
                console.log('error',error);
            });
            console.log(result2)
        }
    }

    // Agregar usuario
    const [userOpen,setUserOpen]  = useState(false);
    const [updateForm,setUpdateForm] = useState(false);
    const addUser = () =>{
        setUserOpen(true);
        setUpdateForm(false);
    }

    const handleUserClose = () => setUserOpen(false);

    const [userPost,setUserPost] = useState({
        uNombre:'',
        uCorreo:'',
        uUsuario:'',
        uClave:''
    });

    const changeUserField=(event)=>{
        setUserPost({
        ...userPost,
        [event.target.name]:event.target.value
        })
    }

    const sendUserForm = () =>{
        axios.post('https://api.lessin.pe/wp-json/usuarios/v1/userReg',[[{
            usuario:userPost.uUsuario,
            correo:userPost.uCorreo,
            telefono:'',
            nombres_completos:userPost.uNombre,
            dni:'',
            password:userPost.uClave,
        }],id],
        {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
            }
        }).then((data)=>{

            setRows([
            ...rows,
            {
                usuario:userPost.uUsuario,
                correo:userPost.uCorreo,
                telefono:'',
                nombres_completos:userPost.uNombre,
                dni:'',
                clave:userPost.uClave
            } 
            ])

            setUserPost({
            uNombre:'',
            uCorreo:'',
            uUsuario:'',
            uClave:''
            });
            handleUserClose();
        }).catch((error) => {
            console.log('error',error);
        });
    }

    // Eliminar usuario
    const removeUser = (idLogin) =>{
        console.log(idLogin)
        axios.post('https://api.lessin.pe/wp-json/usuarios/v1/removeUser',
        {
            idCliente:idLogin
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
                
            }
        }).then((data)=>{
            setRows((current) =>
                current.filter((item) => item.dni !== idLogin)
            );

        }).catch((error) => {
            console.log('error',error);
        });
    }

    // Update usuario
    const updateUser = (item) =>{
        console.log(item)
        setUpdateForm(true);
        setUserOpen(true);
        setUserPost({
            uNombre:item.nombres_completos,
            uCorreo:item.correo,
            uUsuario:item.usuario,
            uClave:item.clave
        });
    }

    const sendUpdateUserForm = () =>{
        console.log('estamos editando el post')
        axios.post('https://api.lessin.pe/wp-json/usuarios/v1/updateUser',{
            idCliente:userPost.uUsuario,
            correo:userPost.uCorreo,
            clave:userPost.uClave,
            nombres:userPost.uNombre
        },
        {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
        }).then((data)=>{
            handleUserClose();
            const itemUser = rows.map(itemRows => {
                if (itemRows.usuario === userPost.uUsuario ) {
                    return {
                        ...itemRows,
                        nombres_completos:userPost.uNombre,
                        correo:userPost.uCorreo,
                        clave:userPost.uClave
                    };
                } else {
                    return itemRows;
                }
            });
            setRows(itemUser);
            setUserPost({
                uNombre:'',
                uCorreo:'',
                uUsuario:'',
                uClave:''
            });
            
        }).catch((error) => {
            console.log('error',error);
        });
    }


    const [openPoper, setOpenPoper] = useState(null);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('id');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [idUser,setIdUser] = useState();

    const handleOpenMenu = (event) => {
        setOpenPoper(event.currentTarget);
      };
    
      const handleOpenMenu2 = (row) => {
        setIdUser(row);
      };
    
      const handleCloseMenu = () => {
        setOpenPoper(null);
      };
    
      const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };
    
      const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelecteds = rows.map((n) => n.name);
          setSelected(newSelecteds);
          return;
        }
        setSelected([]);
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

      const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

      const filteredUsers = applySortFilter(rows, getComparator(order, orderBy), filterName);
    
      const isNotFound = !filteredUsers.length && !!filterName;

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom onClick={()=>{console.log(rows),console.log(totalUser.total)}}>
                    Lista
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={addUser}
                >
                    Agregar usuario
                </Button>
            </Stack>
        
            <Card>
                <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} searchText="Buscar por nombres" />

                <Scrollbar>
                    <TableContainer sx={{ minWidth: '100%',maxWidth:'100%' }}>
                    <Table>

                        <UserListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={rows.length}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                        />
                        
                        <TableBody>
                        {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            //const { id, name, role, status,category, avatarUrl } = row;
                            const { id, clave,nombres_completos, correo, dni,telefono,usuario } = row;
                            const selectedUser = selected.indexOf(name) !== -1;
                            return (
                            <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                
                                <TableCell component="th" scope="row" padding="left">{usuario}</TableCell>
                                <TableCell align="left">{nombres_completos === '' ? '---': nombres_completos}</TableCell>
                                <TableCell align="left">{dni === '' ? '---': dni}</TableCell>
                                <TableCell align="left">{clave === '' ? '---': clave}</TableCell>
                                <TableCell align="left">{correo === '' ? '---': correo}</TableCell>
                                <TableCell align="left">{telefono === '' ? '---': telefono}</TableCell>

                                <TableCell align="right" onClick={()=>{handleOpenMenu2(row)}}>
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
                                    No encontramos resultados
                                </Typography>

                                <Typography variant="body2">
                                    No tenemos resultados para &nbsp;
                                    <strong>&quot;{filterName}&quot;</strong>.
                                    <br /> Pruebe con otra texto.
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
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>

            <Stack>
                <p>total usuarios:{totalUser ? totalUser.total : 0}</p>
                <Button 
                    component="label" 
                    variant="contained" 
                    startIcon={<CloudUploadIcon />}
                    
                >
                    Cargar datos
                    <VisuallyHiddenInput onChange={changeCSV} type="file" />
                </Button>
            </Stack>

            <Modal
                open={userOpen}
                onClose={handleUserClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {updateForm ?
                    <Box sx={style}>
                    <Typography variant="h5" sx={{ mb: 3 }}>
                        Actualizar usuario
                    </Typography>
                    <Stack spacing={3}>
                        <TextField id="outlined-basic" fullWidth label="Usuario" onChange={changeUserField} value={userPost.uUsuario} name="uUsuario" disabled variant="outlined" />
                        <TextField id="outlined-basic" fullWidth label="Nombres" onChange={changeUserField} value={userPost.uNombre} name="uNombre" variant="outlined" />
                        <TextField id="outlined-basic" fullWidth label="Correo" onChange={changeUserField} value={userPost.uCorreo} name="uCorreo" variant="outlined" />
                        <TextField id="outlined-basic" fullWidth label="Clave" onChange={changeUserField} value={userPost.uClave} name="uClave" variant="outlined" />
                        <Button
                        variant='contained'
                        onClick={sendUpdateUserForm}
                        >
                        Actualizar usuario
                        </Button>
                    </Stack>
                    </Box>
                :
                    <Box sx={style}>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                            Agregar usuario
                        </Typography>
                        <Stack spacing={3}>
                            <TextField id="outlined-basic" fullWidth label="Nombres" onChange={changeUserField} value={userPost.uNombre} name="uNombre" variant="outlined" />
                            <TextField id="outlined-basic" fullWidth label="Correo" onChange={changeUserField} value={userPost.uCorreo} name="uCorreo" variant="outlined" />
                            <TextField id="outlined-basic" fullWidth label="Usuario" onChange={changeUserField} value={userPost.uUsuario} name="uUsuario" variant="outlined" />
                            <TextField id="outlined-basic" fullWidth label="Clave" onChange={changeUserField} value={userPost.uClave} name="uClave" variant="outlined" />
                            <Button
                            variant='contained'
                            onClick={sendUserForm}
                            >
                            Agregar usuario
                            </Button>
                        </Stack>
                    </Box>
                }
            </Modal>
            
            <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{mt:2}}
                onClick={uploadCSV}
            >
                Actualizar datos
            </Button>


            <Popover
                open={Boolean(openPoper)}
                anchorEl={openPoper}
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
                <MenuItem onClick={()=>updateUser(idUser)}>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} /> Edit
                </MenuItem>

                <MenuItem sx={{ color: 'error.main' }}  onClick={()=>removeUser(idUser.dni)}  >
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }}/> Delete
                </MenuItem>
            </Popover>
        </Box>
    );

}

export default ClientUsuarios;
