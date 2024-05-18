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

ClientImages.propTypes = {
  updateState:PropTypes.func
};

function ClientImages({updateState,...other}) {

    const { jwt  } = useContext(UserContext);
    const { id } = useParams();
    const [companyLogo,setCompanyLogo] = useState();
    const [companyDetail,setCompanyDetail] = useState();
    const [companyCover,setCompanyCover] = useState();

    // Textfield
    const [postCliente,setPostCliente] = useState({
        dTitulo:'',
        dDescripcion:'',
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
        axios.put(baseUrl+'/'+id,
        {
            acf:{
                clientes_logo:companyLogo.image,
                clientes_detalle:companyDetail.image,
                clientes_cover:companyCover.image
                
            }
        },
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
    }

    // Get Informations
    const getCliente = () =>{
        updateState(true)
        axios.get(baseUrl+'/'+id).then((resp)=>{
            
            setCompanyLogo({
                image:resp.data.acf.clientes_logo
            })
            setCompanyDetail({
                image:resp.data.acf.clientes_detalle
            })
            setCompanyCover({
                image:resp.data.acf.clientes_cover
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
                <Grid item xs={12} sm={12} md={2}>
                    <ImageUpload updateState={setCompanyLogo} imageData={companyLogo} dark={true} recomend={'Logo: 100x100 pixeles'} height={'250px'} />
                </Grid>
                <Grid item xs={12} sm={12} md={4}> 
                    <ImageUpload updateState={setCompanyDetail} imageData={companyDetail} dark={true} recomend={'Detalle: 50x50 pixeles'} height={'250px'} />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <ImageUpload updateState={setCompanyCover} imageData={companyCover} recomend={'Cover 583x305 pixeles'} height={'250px'} />
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

export default ClientImages;
