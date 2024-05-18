import { useState,useContext,useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";

// @mui
import { 
    Box,
    Stack,
    Button,
    TextField
 } from '@mui/material';

 // Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";

import AddIcon from '@mui/icons-material/Add';

ClientDescription.propTypes = {
  updateState:PropTypes.func
};

function ClientDescription({updateState,...other}) {

    const { jwt  } = useContext(UserContext);
    const { id } = useParams();

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
        axios.post(baseUrl+'/'+id,
        {
            title:postCliente.dTitulo,
            status:"publish",
            acf:{
                clientes_descripcion:postCliente.dDescripcion,
            }
        },
        {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
            }
        }).then((data)=>{
            updateState(false)
            //navigate('/dashboard/clients/edit-client/'+data.data.id);
        }).catch((error) => {
            console.log('error',error);
        });
    }

    // Get Informations
    const getCliente = () =>{
        updateState(true)
        axios.get(baseUrl+'/'+id).then((resp)=>{
            updateState(false)
            console.log(resp.data)
            setPostCliente({
                dTitulo:resp.data.title.rendered,
                dDescripcion:resp.data.acf.clientes_descripcion
            });
        })
    }

    useEffect(()=>{
        getCliente();
    },[])

    return (
        <Box>
            <Stack spacing={2}>
                <TextField 
                    id="outlined-basic" 
                    fullWidth 
                    label="Cliente" 
                    onChange={changePostCliente} 
                    value={postCliente.dTitulo} 
                    name="dTitulo" 
                    variant="outlined"
                />
                <TextField 
                    id="outlined-basic" 
                    fullWidth 
                    label="Descripcion"
                    onChange={changePostCliente} 
                    value={postCliente.dDescripcion} 
                    name="dDescripcion" 
                    variant="outlined" 
                    multiline
                    rows={3}
                />
            </Stack>
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

export default ClientDescription;
