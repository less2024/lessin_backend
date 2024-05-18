import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import { useParams } from "react-router-dom";
import { faker } from '@faker-js/faker';

// @mui
import {
    Card,
    Button,
    TableContainer,
    Table,
    LinearProgress,
    Typography,
    TablePagination,
    TableRow,
    styled,
    TableBody,
    TableCell,
    Grid,
    Paper
} from '@mui/material';

// Iconos
import Iconify from '../../components/iconify';

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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

UploadCsvComponent.propTypes = {
    data: PropTypes.array,
    modalClose: PropTypes.func,
    updateComponent: PropTypes.func,
};

const TABLE_HEAD = [
    { id: 'usuario', label: 'Usuario', minWidth: 100 },
    { id: 'name', label: 'Nombres', minWidth: 200 },
    { id: 'dni', label: 'DNI', minWidth: 100 },
    { id: 'clave', label: 'Clave', minWidth: 100 },
    { id: 'correo', label: 'Correo', minWidth: 170 },
    { id: 'telefono', label: 'Teléfono', minWidth: 100 }
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

function UploadCsvComponent({ data, modalClose, updateComponent, ...other }) {

    const { jwt } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [errorFormat, setErrorFormat] = useState(false);

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
        const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
        const arrayFinal = [];

        csvRows.pop();

        const array = csvRows.map((i, iiiii) => {
            const values = i.split(";");
            const obj = csvHeader.reduce((object, header, index) => {

                if (index === 3) {
                    object[header.replace(/[^\w\s]/gi, '')] = values[index];
                    return object;
                } else {

                    try {
                        object[header.replace(/[^\w\s]/gi, '')] = values[index].replace(/[^\w\s]/gi, '');
                    } catch (error) {
                        setErrorFormat(true)
                        return;
                    }
                    return object;
                }


            }, {});
            return obj;
        });

        array.map((item) => {
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


    const uploadCSV = () => {
        setLoading(true);

        const result1 = rows.filter(function (o1) {
            return !rowsTmp.some(function (o2) {
                return o1.dni == o2.dni;
            });
        });

        const result2 = rowsTmp.filter(function (o1) {
            return !rows.some(function (o2) {
                return o1.dni == o2.dni;
            });
        });

        if (result1.length > 0) {

            axios.post('https://api.lessin.pe/wp-json/usuarios/v1/post', [result1, id],
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwt}`
                    }
                }).then((data) => {
                    setLoading(false)
                    if (result2.length > 0) {
                        axios.post('https://api.lessin.pe/wp-json/usuarios/v1/removeBulkUser', [result2, id],
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${jwt}`,
                                    'Access-Control-Allow-Origin': '*',
                                    'origin': 'x-requested-with',
                                    'Access-Control-Allow-Headers': 'POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin',
                                }
                            }).then((data) => {
                                setLoading(false)
                                modalClose()
                                updateComponent(true)
                            }).catch((error) => {
                                console.log('error', error);
                                modalClose()
                                updateComponent(true)
                            });
                    } else {
                        modalClose()
                        updateComponent(true)
                    }

                }).catch((error) => {
                    console.log('error', error);
                });

        } else {
            axios.post('https://api.lessin.pe/wp-json/usuarios/v1/removeBulkUser', [result2, id],
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwt}`,
                        'Access-Control-Allow-Origin': '*',
                        'origin': 'x-requested-with',
                        'Access-Control-Allow-Headers': 'POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin',
                    }
                }).then((data) => {
                    setLoading(false)
                    modalClose()
                    updateComponent(true)
                }).catch((error) => {
                    console.log('error', error);
                    modalClose()
                    updateComponent(true)
                });
        }



    }

    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('id');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

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


    useEffect(() => {
        setRowsTmp(data);
    }, []);


    return (

        <>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {loading ? 'Actualizando registros' : 'Actualizar base de datos'}
            </Typography>
            {loading && <LinearProgress />}
            {rows.length > 0 &&
                rows &&
                <Card className={loading && 'disabledBlock'}>

                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} searchText="Buscar por nombres" />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: '100%', maxWidth: '100%' }}>
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
                                        const { id, clave, nombres_completos, correo, dni, telefono, usuario } = row;
                                        const selectedUser = selected.indexOf(name) !== -1;
                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>

                                                <TableCell component="th" scope="row" padding="left">{usuario}</TableCell>
                                                <TableCell align="left">{nombres_completos === '' ? '---' : nombres_completos}</TableCell>
                                                <TableCell align="left">{dni === '' ? '---' : dni}</TableCell>
                                                <TableCell align="left">{clave === '' ? '---' : clave}</TableCell>
                                                <TableCell align="left">{correo === '' ? '---' : correo}</TableCell>
                                                <TableCell align="left">{telefono === '' ? '---' : telefono}</TableCell>


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
            }

            {errorFormat && 'La base de datos tiene errores.'}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={4}>
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        fullWidth

                    >
                        Cargar datos
                        <VisuallyHiddenInput onChange={changeCSV} type="file" />
                    </Button>
                </Grid>
                {rows &&
                    rows.length > 0 &&
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={uploadCSV}
                            fullWidth
                        >
                            Actualizar datos
                        </Button>
                    </Grid>
                }
            </Grid>
        </>

    );

}

export default UploadCsvComponent;
