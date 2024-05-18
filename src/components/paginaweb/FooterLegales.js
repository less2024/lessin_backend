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

FooterLegal.propTypes = {
    updateState:PropTypes.func,
    dataState:PropTypes.object
};

function FooterLegal({updateState, dataState, ...other}) {

    const [openCatModal, setOpenCatModal] = useState(false);
    const [categories,setCategories] = useState([]);
    const [editCat,setEditCat] = useState();
    const [actionCat,setActionCat] = useState(false);
    const [formLegal,setFormLegal] = useState({
        lname:'',
        lslug:''
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
                footer_legales_ltitulo:formLegal.lname,
                footer_legales_lslug:formLegal.lslug
            }
        ])
        updateState([
            ...categories,
            {
                id:faker.datatype.uuid(),
                footer_legales_ltitulo:formLegal.lname,
                footer_legales_lslug:formLegal.lslug
            }
        ])

        setFormLegal({
            lname:'',
            lslug:''
        });
        handleCatClose();
    }

    const handleEditCat = (item) =>{
        setActionCat(true);
        setEditCat(item);
        setFormLegal({
            ...formLegal,
            lname:item.footer_legales_ltitulo,
            lslug:item.footer_legales_lslug
        });
        handleCatOpen();
    }

    const updateCat  = ()=>{
        setActionCat(false);
        setCategories(
            categories.map((cat,index) =>{
                if(editCat.footer_legales_lslug === cat.footer_legales_lslug){
                    return {
                            ...cat,
                            footer_legales_ltitulo:formLegal.lname,
                            footer_legales_lslug:formLegal.lslug
                        }
                    
                }else{
                    return {...cat}
                }
            })
        );
        updateState(
            categories.map((cat,index) =>{
                if(editCat.footer_legales_lslug === cat.footer_legales_lslug){
                    return {
                            ...cat,
                            footer_legales_ltitulo:formLegal.lname,
                            footer_legales_lslug:formLegal.lslug
                        }
                    
                }else{
                    return {...cat}
                }
            })
        );
        setFormLegal({
            ...formLegal,
            lname:'',
            lslug:''
        });
        handleCatClose();
    }

    const removeCat = (item) =>{
        setCategories(
            categories.filter((catIn) => catIn.footer_legales_lslug !== item.footer_legales_lslug)
        );
        updateState(
            categories.filter((catIn) => catIn.footer_legales_lslug !== item.footer_legales_lslug)
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
                Legales
            </Typography>
            <Stack spacing={0} sx={{ mb: 1,mt:1 }}>
                {categories.length > 0 &&
                    <List disablePadding>
                    {categories.map((item)=>{
                        return (
                            <ListItem disablePadding key={item.id}>
                                <KeyboardArrowRightTwoToneIcon sx={{pr:1}} />
                                <ListItemText primary={item.footer_legales_ltitulo} />

                                <IconButton  onClick={()=>handleEditCat(item)}>
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
                        {actionCat ? 'Actualizar Legal' : 'Agregar Legal'}
                    </Typography>
                    <Stack spacing={2} sx={{mb:2,mt:2}}>
                        <TextField id="outlined-basic" label="Nombre" onChange={changeFormLegal} name="lname" value={formLegal.lname} />
                        <TextField id="outlined-basic" label="Slug" onChange={changeFormLegal} name="lslug" value={formLegal.lslug} />
                    </Stack>
                    <Button variant='contained' onClick={actionCat ? updateCat : insertCat} sx={{mr:2}} >{actionCat ? 'Actualizar' : 'Agregar'}</Button>
                    <Button variant='outlined' onClick={handleCatClose}>Cerrar</Button>
                </Box>
            </Modal>
        </Paper>

    );

}

export default FooterLegal;