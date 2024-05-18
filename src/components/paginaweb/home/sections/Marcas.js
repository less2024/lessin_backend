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
    Divider
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

SecMarcaHome.propTypes = {
    updateState:PropTypes.func
};

function SecMarcaHome({updateState, ...other}) {

    const { jwt  } = useContext(UserContext);
    const [marcas,setMarcas] = useState([]);
    const [action,setAction] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectMarca,setSelectMarca] = useState();
    const [imgTemp,setImgTemp] = useState();
    const [formFields,setFormFields] = useState({
        etitulo:''
    });

    const urlPage = 'https://api.lessin.pe/wp-json/wp/v2/pages/251';

    const handleOpen = () => {
        setOpenModal(true);
    };

    const handleEditOpen = (item) => {
        setImgTemp({
            image:item.marcas_limg
        })
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

    const updateMarca = () =>{
        //setImgTemp();
        setMarcas(
            marcas.map((marcas,index) =>{
                if(selectMarca.marcas_limg === marcas.marcas_limg){
                    return {
                            ...marcas,
                            marcas_limg:imgTemp ? imgTemp.image: ''
                        }
                }else{
                    return {...marcas}
                }
            })
        );
        setImgTemp(null);
        handleClose();
    }

    const insertMarca = () =>{
        setMarcas([
            ...marcas,
            {
                id:faker.datatype.uuid(),
                marcas_limg:imgTemp ? imgTemp.image: ''
            }
        ])

        setImgTemp(null);
        handleClose();
    }

    const removeMarca = (item) =>{
        setMarcas(
            marcas.filter((marcaItem) => marcaItem.marcas_limg !== item.marcas_limg)
        );
    }

    const updateSection = () =>{
        updateState(true)
        axios.put(urlPage,{
          acf: {
            marcas_titulo: formFields.etitulo,
            marcas_lista: marcas
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
                    etitulo:resp.data.acf.marcas_titulo
                })
                setMarcas(resp.data.acf.marcas_lista)
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
                        <TextField id="ititulo-asdad" label="Titulo" fullWidth name="ititulo" onChange={changeField} value={formFields.etitulo} />
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
                                            <img src={item.marcas_limg} />
                                            <ListItemText primary={''} />
                                            
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
                        {action ? 'Actualizar marca' : 'Agregar marca'}
                    </Typography>
                    <Stack sx={{mt:2,mb:2}}>
                        <ImageUpload updateState={setImgTemp} imageData={imgTemp} dark={false} />
                    </Stack>
                    <Button variant='contained' onClick={action ? updateMarca : insertMarca} sx={{mr:2}} >{action ? 'Actualizar' : 'Agregar'}</Button>
                    <Button variant='outlined' onClick={handleClose}>Cerrar</Button>
                </Box>
            </Modal>
        </Paper>

    );

}

export default SecMarcaHome;