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
    Stack,
    List,
    TextField,
    ListItem,
    ListItemText,
 } from '@mui/material';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Component
import ImageUpload from '../upload/image';

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

 // Axios
import axios from 'axios';

FooterSocial.propTypes = {
    updateState:PropTypes.func,
    dataState:PropTypes.object
};

function FooterSocial({updateState, dataState, ...other}) {

    const [openCatModal, setOpenCatModal] = useState(false);
    const [categories,setCategories] = useState([]);
    const [editCat,setEditCat] = useState();
    const [logoState,setLogoState] = useState();
    const [actionCat,setActionCat] = useState(false);
    const [formLegal,setFormLegal] = useState({
        snombre:'',
        sslug:''
    });

    const handleCatOpen = () => {
        setOpenCatModal(true);
    };
    const handleCatClose = () => {
        setOpenCatModal(false);
    };

    const getCategorias = () =>{
        axios.get('https://api.lessin.pe/wp-json/wp/v2/pages').then((resp)=>{
            setCatData(resp.data);
        }).catch((error)=>{
            console.log(error)
        })
    }

    const changeFormLegal = (event) =>{
        setFormLegal({
            ...formLegal,
            [event.target.name]:event.target.value
        });
    }

    const insertCat = ()=>{
        setCategories([
            ...categories,
            {
                id:faker.datatype.uuid(),
                footer_sociales_lnombre:formLegal.snombre,
                footer_sociales_llink:formLegal.sslug,
                footer_sociales_licono:logoState ? logoState.image : ''
            }
        ])
        updateState([
            ...categories,
            {
                id:faker.datatype.uuid(),
                footer_sociales_lnombre:formLegal.snombre,
                footer_sociales_llink:formLegal.sslug,
                footer_sociales_licono:logoState ? logoState.image : ''
            }
        ])
        setFormLegal({
            snombre:'',
            sslug:''
        });
        setLogoState();
        handleCatClose();
    }

    const handleEdithCat = (item) =>{
        setActionCat(true);
        setEditCat(item);
        setFormLegal({
            ...formLegal,
            snombre:item.footer_sociales_lnombre,
            sslug:item.footer_sociales_llink,
        });
        handleCatOpen();
    }

    const updateCat  = ()=>{
        setActionCat(false);
        setCategories(
            categories.map((cat,index) =>{
                if(editCat.footer_sociales_llink === cat.footer_sociales_llink){
                    return {
                            ...cat,
                            footer_sociales_lnombre:formLegal.snombre,
                            footer_sociales_llink:formLegal.sslug,
                            footer_sociales_licono:logoState ? logoState.image : ''
                        }
                    
                }else{
                    return {...cat}
                }
            })
        );
        updateState(
            categories.map((cat,index) =>{
                if(editCat.footer_sociales_llink === cat.footer_sociales_llink){
                    return {
                            ...cat,
                            footer_legales_ltitulo:formLegal.snombre,
                            footer_sociales_llink:formLegal.sslug,
                            footer_sociales_licono:logoState ? logoState.image : ''
                        }
                    
                }else{
                    return {...cat}
                }
            })
        );
        setFormLegal({
            ...formLegal,
            snombre:'',
            sslug:''
        });
        handleCatClose();
    }

    const removeCat = (item) =>{
        setCategories(
            categories.filter((catIn) => catIn.footer_sociales_llink !== item.footer_sociales_llink)
        );
        updateState(
            categories.filter((catIn) => catIn.footer_sociales_llink !== item.footer_sociales_llink)
        );
    }

    useEffect(()=>{
        getCategorias();
        if(dataState){
            setCategories(dataState)
        }else{
            setCategories([])
        }
    },[dataState])

    return (
        <Paper variant='outlined' sx={{p:2}} >
            <Typography variant="h6" onClick={()=>console.log(categories)}>
                Social
            </Typography>
            <Stack spacing={0} sx={{ mb: 1,mt:1 }}>
                {categories.length > 0 &&
                    <List disablePadding>
                    {categories.map((item)=>{
                        return (
                            <ListItem disablePadding key={item.id}>
                                <img src={item.footer_sociales_licono} />
                                <ListItemText primary={item.footer_sociales_lnombre} />

                                <IconButton  onClick={()=>handleEdithCat(item)}>
                                    <EditIcon  />
                                </IconButton>
                                <IconButton>
                                    <DeleteIcon onClick={()=>removeCat(item)} />
                                </IconButton>
                            </ListItem>
                            )
                        })
                    }
                    </List>
                }
            </Stack>
            <Button variant='outlined' onClick={()=>{handleCatOpen(),setActionCat(false)}} >
                Agregar
            </Button>

            <Modal
                open={openCatModal}
                onClose={handleCatClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h4" >
                        {actionCat ? 'Actualizar social' : 'Agregar social'}
                    </Typography>
                    <Stack spacing={2} sx={{mb:2,mt:2}}>
                        <ImageUpload updateState={setLogoState} imageData={logoState}  height={'150px'} />
                        <TextField id="outlined-basic" label="Nombre" onChange={changeFormLegal} name="snombre" value={formLegal.snombre} />
                        <TextField id="outlined-basic" label="Slug" onChange={changeFormLegal} name="sslug" value={formLegal.sslug} />
                    </Stack>
                    <Button variant='contained' onClick={actionCat ? updateCat : insertCat} sx={{mr:2}} >{actionCat ? 'Actualizar' : 'Agregar'}</Button>
                    <Button variant='outlined' onClick={handleCatClose}>Cerrar</Button>
                </Box>
            </Modal>
        </Paper>

    );

}

export default FooterSocial;