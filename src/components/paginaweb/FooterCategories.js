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
    Autocomplete,
    ListItemText,
 } from '@mui/material';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';

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

FooterCategories.propTypes = {
    updateState:PropTypes.func,
    dataState:PropTypes.object
};

function FooterCategories({updateState, dataState, ...other}) {

    const [openCatModal, setOpenCatModal] = useState(false);
    const [categories,setCategories] = useState([]);
    const [selectCat,setSelectCat] = useState();
    const [editCat,setEditCat] = useState();
    const [dataCat,setCatData] = useState();
    const [actionCat,setActionCat] = useState(false)

    const handleCatOpen = () => {
        
        setOpenCatModal(true);
    };
    const handleCatClose = () => {
        setOpenCatModal(false);
    };

    const getCategorias = () =>{
        axios.get('https://api.lessin.pe/wp-json/wp/v2/categoria').then((resp)=>{
            setCatData(resp.data);
        }).catch((error)=>{
            console.log(error)
        })
    }

    const changeCategories = (event,newValue) =>{
        setSelectCat(newValue);
    }

    const insertCat = ()=>{
        setCategories([
            ...categories,
            {
                id:faker.datatype.uuid(),
                footer_categorias_lcat:selectCat.name,
                footer_categorias_lslug:selectCat.slug
            }
        ])
        updateState([
            ...categories,
            {
                id:faker.datatype.uuid(),
                footer_categorias_lcat:selectCat.name,
                footer_categorias_lslug:selectCat.slug
            }
        ])
        handleCatClose();
    }

    const handleEdithCat = (item) =>{
        setActionCat(true);
        setEditCat(item);
        handleCatOpen();
    }

    const updateCat  = ()=>{
        setActionCat(false);
        setCategories(
            categories.map((cat,index) =>{
                if(editCat.footer_categorias_lslug === cat.footer_categorias_lslug){
                    return {
                            ...cat,
                            footer_categorias_lcat:selectCat.name,
                            footer_categorias_lslug:selectCat.slug
                        }
                    
                }else{
                    return {...cat}
                }
            })
        );
        updateState(
            categories.map((cat,index) =>{
                if(editCat.footer_categorias_lslug === cat.footer_categorias_lslug){
                    return {
                            ...cat,
                            footer_categorias_lcat:selectCat.name,
                            footer_categorias_lslug:selectCat.slug
                        }
                    
                }else{
                    return {...cat}
                }
            })
        );
        handleCatClose();
    }

    const removeCat = (item) =>{
        setCategories(
            categories.filter((catIn) => catIn.footer_categorias_lslug !== item.footer_categorias_lslug)
        );
        updateState(
            categories.filter((catIn) => catIn.footer_categorias_lslug !== item.footer_categorias_lslug)
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
                Categorías
            </Typography>
            <Stack spacing={0} sx={{ mb: 1,mt:1 }}>
                {categories.length > 0 &&
                    <List disablePadding>
                    {categories.map((item)=>{
                        return (
                            <ListItem disablePadding key={item.id}>
                                <KeyboardArrowRightTwoToneIcon sx={{pr:1}} />
                                <ListItemText primary={item.footer_categorias_lcat} />

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
                        {actionCat ? 'Actualizar categoría' : 'Agregar categoría'}
                    </Typography>
                    <Stack spacing={2} sx={{mb:2,mt:2}}>
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
                    <Button variant='contained' onClick={actionCat ? updateCat : insertCat} sx={{mr:2}} >{actionCat ? 'Actualizar' : 'Agregar'}</Button>
                    <Button variant='outlined' onClick={handleCatClose}>Cerrar</Button>
                </Box>
            </Modal>
        </Paper>

    );

}

export default FooterCategories;
