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

SecContactoHome.propTypes = {
    updateState:PropTypes.func
};

function SecContactoHome({updateState, ...other}) {

    const { jwt  } = useContext(UserContext);
    const [formFields,setFormFields] = useState({
        etitulo:'',
        estitulo:'',
        estexto:''
    });

    const urlPage = 'https://api.lessin.pe/wp-json/wp/v2/pages/251';

    const changeField = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]:e.target.value
        })
    }


    const updateSection = () =>{
        updateState(true)
        axios.put(urlPage,{
          acf: {
            contacto_titulo: formFields.etitulo,
            contacto_stitulo: formFields.estitulo,
            contacto_txt: formFields.estexto
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
                    etitulo:resp.data.acf.contacto_titulo,
                    estitulo:resp.data.acf.contacto_stitulo,
                    estexto:resp.data.acf.contacto_txt
                })
                
                updateState(false)
            })
    }

    useEffect(()=>{
        getInfo();
    },[])

    return (
        <Paper variant='outlined' sx={{p:2}} >
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}  md={12}>
                    <Stack spacing={2}>
                        <TextField id="ititulo-asdad" label="Titulo" fullWidth name="etitulo" onChange={changeField} value={formFields.etitulo} />
                        <TextField id="ititulo-asdad" label="Sub titulo" fullWidth name="estitulo" onChange={changeField} value={formFields.estitulo} />
                        <TextField id="ititulo-asdad" label="Texto" multiline rows={4} fullWidth name="estexto" onChange={changeField} value={formFields.estexto} />
                    </Stack>
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <Button variant='contained'  onClick={updateSection} fullWidth>Actualizar</Button>
                </Grid>

            </Grid>
        </Paper>

    );

}

export default SecContactoHome;