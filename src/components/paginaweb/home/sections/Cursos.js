import { useEffect, useState,useContext } from 'react';
import PropTypes from 'prop-types';
import { faker } from '@faker-js/faker';

// @mui
import { 
    Box,
    IconButton,
    Button,
    Typography,
    Modal,
    Paper,
    Grid,
    Stack,
    List,
    TextField,
    ListItem,
    ListItemText,
    Autocomplete,
    Divider,
    Avatar
 } from '@mui/material';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


// Axios
import axios from 'axios';
import UserContext from '../../../../context/AuthContext';

// Stylos
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius:3,
    p: 4,
};

SecCursoHome.propTypes = {
    updateState:PropTypes.func
};


function SecCursoHome({updateState, ...other}) {

    const { jwt  } = useContext(UserContext);
    const [marcas,setMarcas] = useState([]);
    const [action,setAction] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectMarca,setSelectMarca] = useState();

    const [dataCat,setCatData] = useState();

    const [formFields,setFormFields] = useState({
        etitulo:'',
        etexto:''
    });

    const[ formModal,setFormModal] = useState({
        eftitulo:'',
        eficono:'',
        efid:''
    });


    const urlPage = 'https://api.lessin.pe/wp-json/wp/v2/pages/251';

    const getCategorias = () =>{
        axios.get('https://api.lessin.pe/wp-json/wp/v2/categoria').then((resp)=>{
            setCatData(resp.data);
        }).catch((error)=>{
            console.log(error)
        })
    }

    const handleOpen = () => {
        setOpenModal(true);
    };

    const handleEditOpen = (item) => {

        setFormModal({
            eftitulo:item.cursos_ltitulo
        });
        setSelectMarca(item)
        setAction(true);
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    const changeField = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]:e.target.value
        })
    }

    const changeCategories = (event,newValue) =>{
        setFormModal({
            eficono:newValue.acf.catcur_icono,
            eftitulo:newValue.name,
            efid:newValue.id
        });
    }

    const updateMarca = () =>{
        setMarcas(
            marcas.map((marcas,index) =>{
                if(selectMarca.cursos_licono === marcas.cursos_licono){
                    return {
                            ...marcas,
                            cursos_licono:formModal.eficono,
                            cursos_ltitulo: formModal.eftitulo,
                            cursos_lid:String(formModal.efid)
                        }
                }else{
                    return {...marcas}
                }
            })
        );
        setFormModal({
            eftitulo:'',
            efnumero:'',
            efid:''
        })
        handleClose();
    }

    const insertMarca = () =>{
        setMarcas([
            ...marcas,
            {
                id:faker.datatype.uuid(),
                cursos_licono:formModal.eficono,
                cursos_ltitulo: formModal.eftitulo,
                cursos_lid:String(formModal.efid)
            }
        ])
        setFormModal({
            eftitulo:'',
            efnumero:'',
            efid:''
        })
        handleClose();
    }

    const removeMarca = (item) =>{

        setMarcas(
            marcas.filter((marcaItem) => marcaItem.id !== item.id)
        );
    }

    const updateSection = () =>{
        updateState(true)
        axios.put(urlPage,{
          acf: {
            cursos_titulo: formFields.etitulo,
            cursos_txt:formFields.etexto,
            cursos_lista: marcas
          }
        },{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`
            }
        }).then((resp)=>{
          updateState(false)
        })


    }

    const getInfo = () =>{
        updateState(true)
        axios.get(urlPage)
            .then((resp)=>{
                setFormFields({
                    etitulo:resp.data.acf.cursos_titulo,
                    etexto:resp.data.acf.cursos_txt
                })

                if(resp.data.acf.cursos_lista){
                    const cursosCatList = [];
                    resp.data.acf.cursos_lista.map((item)=>{
                        cursosCatList.push({
                            id:faker.datatype.uuid(),
                            cursos_licono: item.cursos_licono,
                            cursos_ltitulo: item.cursos_ltitulo,
                            cursos_lid: item.cursos_lid
                        });
                    })
                    
                    setMarcas(cursosCatList)
                }else{
                    setMarcas([])
                }
                
                
                updateState(false)
            })
    }

    useEffect(()=>{
        getCategorias();
        getInfo();
    },[])

    return (
        <Paper variant='outlined' sx={{p:2}} >
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}  md={6}>
                    <Stack spacing={2}>
                        <TextField id="ititulo-asdad" label="Titulo" fullWidth name="etitulo" onChange={changeField} value={formFields.etitulo} />
                        <TextField id="ititulo-asdadas" multiline rows={4} label="Texto" fullWidth name="etexto" onChange={changeField} value={formFields.etexto} />
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <Paper variant='outlined' sx={{mb:2}}>
                        {marcas.length > 0 &&
                            <List>
                                {marcas.map((item,index)=>(
                                    <>
                                        {index !== 0 &&<Divider />}
                                        <ListItem key={faker.datatype.uuid()}>
                                            <Avatar sx={{background:'white'}}>
                                                <img src={item.cursos_licono} />
                                            </Avatar>
                                            <ListItemText primary={item.cursos_ltitulo}  sx={{pl:2}} />
                                            
                                            <IconButton onClick={()=>handleEditOpen(item)} >
                                                <EditIcon  />
                                            </IconButton>
                                            <IconButton onClick={()=>removeMarca(item)}>
                                                <DeleteIcon  />
                                            </IconButton>
                                        </ListItem>
                                    </>
                                ))}
                            </List>
                        }
                    </Paper>
                    <Button variant='outlined' onClick={()=>{handleOpen(),setAction(false)}} >
                        Agregar
                    </Button>
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <Button variant='contained'  onClick={updateSection} fullWidth>Actualizar</Button>
                </Grid>
            </Grid>
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h4" >
                        {action ? 'Actualizar' : 'Agregar'}
                    </Typography>
                    <Stack sx={{mt:2,mb:2}} spacing={2}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={dataCat}
                            onChange={changeCategories}
                            getOptionLabel={option => option.name}
                            sx={{zIndex:9 }}
                            renderInput={(params) => <TextField {...params} label="Categoría" />}
                        />
                    </Stack>
                    <Button variant='contained' onClick={action ? updateMarca : insertMarca} sx={{mr:2}} >{action ? 'Actualizar' : 'Agregar'}</Button>
                    <Button variant='outlined' onClick={handleClose}>Cerrar</Button>
                </Box>
            </Modal>
        </Paper>

    );

}

export default SecCursoHome;