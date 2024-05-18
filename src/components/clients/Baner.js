import { useState,useContext,useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";

// @mui
import { 
    Box,
    Grid,
    Stack,
    Button,
    TextField
 } from '@mui/material';

 // Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";

import AddIcon from '@mui/icons-material/Add';
import ImageUpload from '../upload/image';

ClientBaner.propTypes = {
  updateState:PropTypes.func
};

function ClientBaner({updateState,...other}) {

    const { jwt  } = useContext(UserContext);
    const { id } = useParams();
    const [companyBaner1,setCompanyBaner1] = useState();
    const [companyBaner2,setCompanyBaner2] = useState();
    const [companyGif,setCompanyGif] = useState();

    // Textfield
    const [postCliente,setPostCliente] = useState({
        dBanner1Link:'',
        dBanner2Link:''
    });

    const changePostCliente = (e) =>{
        setPostCliente({
        ...postCliente,
            [e.target.name]: e.target.value
        });
    }

    // Crear cliente
    const baseUrl  = 'https://api.lessin.pe/wp-json/wp/v2/clientes';
    const registrarCliente = () =>{
        updateState(true)
        axios.post(baseUrl+'/'+id,
        {
            acf:{
                clientes_banner1:companyBaner1.image,
                clientes_banner2:companyBaner2.image,
                clientes_banner1_link:postCliente.dBanner1Link,
                clientes_banner2_link:postCliente.dBanner2Link,
                clientes_banner_gif:companyGif.image
            }
        },
        {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
            }
        }).then((data)=>{
            updateState(false)
            //navigate('/dashboard/courses/edit-course/'+data.data.id);
        }).catch((error) => {
            console.log('error',error);
        });
    }

    // Get Informations
    const getCliente = () =>{
        updateState(true)
        axios.get(baseUrl+'/'+id).then((resp)=>{
            setPostCliente({
                dBanner1Link:resp.data.acf.clientes_banner1_link,
                dBanner2Link:resp.data.acf.clientes_banner2_link
            })
            setCompanyBaner1({
                image:resp.data.acf.clientes_banner1
            })
            setCompanyBaner2({
                image:resp.data.acf.clientes_banner2
            })
            setCompanyGif({
                image:resp.data.acf.clientes_banner_gif
            })
            updateState(false)
        })
    }

    useEffect(()=>{
        getCliente();
    },[])

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6}> 
                    <TextField id="outlined-basic" fullWidth label="Link" onChange={changePostCliente} value={postCliente.dBanner1Link} name="dBanner1Link" variant="outlined"  sx={{ mb: 1 }} />
                    <ImageUpload updateState={setCompanyBaner1} imageData={companyBaner1}  recomend={'Detalle: 50x50 pixeles'} height={'200px'} />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <TextField id="outlined-basic" fullWidth label="Link" onChange={changePostCliente} value={postCliente.dBanner2Link} name="dBanner2Link" variant="outlined"  sx={{ mb: 1 }} />
                    <ImageUpload updateState={setCompanyBaner2} imageData={companyBaner2} recomend={'Cover 583x305 pixeles'} height={'200px'} />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <ImageUpload updateState={setCompanyGif} imageData={companyGif} recomend={'Baner 1920px x 120px'} height={'200px'} />
                </Grid>
            </Grid>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{mt:2}}
                onClick={registrarCliente}
            >
                Actualizar datos
            </Button>
        </Box>
    );

}

export default ClientBaner;
