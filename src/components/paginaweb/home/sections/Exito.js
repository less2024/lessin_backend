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
    Divider,
    Avatar
 } from '@mui/material';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


// Axios
import axios from 'axios';
import UserContext from '../../../../context/AuthContext';
import ImageUpload from 'src/components/upload/image';

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

SecExitoHome.propTypes = {
    updateState:PropTypes.func
};

function SecExitoHome({updateState, ...other}) {

    const { jwt  } = useContext(UserContext);
    const [marcas,setMarcas] = useState([]);
    const [action,setAction] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectMarca,setSelectMarca] = useState();
    const [imgTemp,setImgTemp] = useState();
    const [formFields,setFormFields] = useState({
        etitulo:'',
        etexto:''
    });

    const[ formModal,setFormModal] = useState({
        eftitulo:'',
        efnumero:''
    });


    const urlPage = 'https://api.lessin.pe/wp-json/wp/v2/pages/251';

    const handleOpen = () => {
        setOpenModal(true);
    };

    const handleEditOpen = (item) => {
        setImgTemp({
            image:item.exito_lico
        })
        setFormModal({
            eftitulo:item.exito_ltitulo,
            efnumero:item.exito_lnumero
        });
        setSelectMarca(item)
        setAction(true);
        setOpenModal(true);
    };

    const handleClose = () => {
        setImgTemp();
        setOpenModal(false);
    };

    const changeField = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]:e.target.value
        })
    }

    const changeModalField = (e) =>{
        setFormModal({
            ...formModal,
            [e.target.name]:e.target.value
        })  
    }

    const updateMarca = () =>{
        //setImgTemp();
        setMarcas(
            marcas.map((marcas,index) =>{
                if(selectMarca.exito_lico === marcas.exito_lico){
                    return {
                            ...marcas,
                            exito_lico:imgTemp ? imgTemp.image: '',
                            exito_ltitulo: formModal.eftitulo,
                            exito_lnumero: formModal.efnumero
                        }
                }else{
                    return {...marcas}
                }
            })
        );
        setFormModal({
            eftitulo:'',
            efnumero:''
        })
        setImgTemp(null);
        handleClose();
    }

    const insertMarca = () =>{
        setMarcas([
            ...marcas,
            {
                id:faker.datatype.uuid(),
                exito_lico:imgTemp ? imgTemp.image: '',
                exito_ltitulo: formModal.eftitulo,
                exito_lnumero: formModal.efnumero
            }
        ])
        setFormModal({
            eftitulo:'',
            efnumero:''
        })
        setImgTemp(null);
        handleClose();
    }

    const removeMarca = (item) =>{
        setMarcas(
            marcas.filter((marcaItem) => marcaItem.exito_lico !== item.exito_lico)
        );
    }

    const updateSection = () =>{
        updateState(true)
        axios.put(urlPage,{
          acf: {
            exito_titutlo: formFields.etitulo,
            exito_txt:formFields.etexto,
            exito_lista: marcas
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
                    etitulo:resp.data.acf.exito_titutlo,
                    etexto:resp.data.acf.exito_txt
                })

                if(resp.data.acf.exito_lista){
                    setMarcas(resp.data.acf.exito_lista)
                }else{
                    setMarcas([])
                }
                
                
                updateState(false)
            })
    }

    useEffect(()=>{
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
                                            <Avatar>
                                                <img src={item.exito_lico} />
                                            </Avatar>
                                            <ListItemText primary={item.exito_ltitulo} secondary={item.exito_lnumero} sx={{pl:2}} />
                                            
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
                        <TextField id="ititulo-asdad" label="Titulo" fullWidth name="eftitulo" onChange={changeModalField} value={formModal.eftitulo} />
                        <TextField id="ititulo-asdad" label="Numero" fullWidth name="efnumero" onChange={changeModalField} value={formModal.efnumero} />
                        <ImageUpload updateState={setImgTemp} textButton={'Icono'} imageData={imgTemp} dark={true} />
                    </Stack>
                    <Button variant='contained' onClick={action ? updateMarca : insertMarca} sx={{mr:2}} >{action ? 'Actualizar' : 'Agregar'}</Button>
                    <Button variant='outlined' onClick={handleClose}>Cerrar</Button>
                </Box>
            </Modal>
        </Paper>

    );

}

export default SecExitoHome;