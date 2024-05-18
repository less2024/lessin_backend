import { useEffect, useState,useContext } from 'react';
import PropTypes from 'prop-types';
import { faker } from '@faker-js/faker';
import { useParams } from "react-router-dom";

// @mui
import { 
    Box,
    Grid,
    Stack,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    Typography,
    IconButton,
    Divider,
    Alert
 } from '@mui/material';

// Iconos
import Iconify from '../../components/iconify';
import DeleteIcon from '@mui/icons-material/Delete';

 // Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";

import AddIcon from '@mui/icons-material/Add';

CourseAprenderas.propTypes = {
  updateState:PropTypes.func
};

function CourseAprenderas({updateState,...other}) {

  const { jwt  } = useContext(UserContext);
  const { id } = useParams();

  const [textoAprenderas,setTextoAprenderas] = useState({
    texto_aprenderas:''
  });

  const [aprenderasLista,setAprenderasLista] = useState([]);
  const [aprListaTmp,setAprListaTmp] = useState([]);
  const agregarAprenderas = (event) =>{
    setTextoAprenderas({
      ...textoAprenderas,
      [event.target.name]: event.target.value
    });
  }

  const enviarAprenderas = () =>{
    setAprenderasLista([
      ...aprenderasLista,
      {id:faker.datatype.uuid(),pcurso_aitem:textoAprenderas.texto_aprenderas}
    ]);
    
    setPregunta({
      pregunta:'',
      respuesta:''
    })
  }

  const eliminarAprenderas= (item) =>{
    setAprenderasLista(
      aprenderasLista.filter((aprenderasItem) => aprenderasItem.id !== item.id)
    );
  }

  // Enviar data
  const baseUrl  = 'https://api.lessin.pe/wp-json/wp/v2/cursos';

  const registrarCurso = () =>{
    updateState(true);
    axios.put(baseUrl+'/'+id,
      {
        acf:{
          pcurso_aprenderas:aprenderasLista,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
      }).then((data)=>{
        updateState(false);
      }).catch((error) => {
        console.log('error',error);
      });
  }

  // Get Informations
  const getCourse = () =>{
    updateState(true)

    axios.get(baseUrl+'/'+id,
    {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
      }
    }).then((resp)=>{
      if(resp.data.acf.pcurso_aprenderas.length> 0){
        const listaTmp = [];
        resp.data.acf.pcurso_aprenderas.map((item)=>{
          listaTmp.push(
            {
              id:faker.datatype.uuid(),
              pcurso_aitem:item.pcurso_aitem
            }
  
          )
        })
        setAprenderasLista(listaTmp);
      }
      updateState(false)

    })
  }


  useEffect(()=>{
    getCourse();
  },[])

    return (
        <Box>
          <Stack spacing={2}>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={12} md={8} sx={{mb:2}}>
                <Typography variant="h6" gutterBottom onClick={()=>console.log(aprenderasLista)}>
                  Lista
                </Typography>
                {aprenderasLista.length > 0 ?
                  <List sx={{ width: '100%', bgcolor: 'background.paper',mb:3 }}>
                      {aprenderasLista.length > 0 &&
                        aprenderasLista.map((item,index) =>{
                          return (
                            <>
                              {index !== 0 && <Divider/>}
                              <ListItem disablePadding alignItems="flex-start">

                                <ListItemText
                                    primary={item.pcurso_aitem}
                                />
                                <IconButton onClick={()=>eliminarAprenderas(item)}>
                                    <DeleteIcon />
                                </IconButton>
                              </ListItem>
                                
                            </>
                          );
                        })
                      }
                  </List>
                :
                  <Alert severity="warning">Aun no tenemos preguntas frecuentes</Alert>
                    
                }
              </Grid>
              <Grid item xs={12} sm={12} md={8}>
                  
                  <Stack spacing={2}>
                    <TextField id="outlined-basic" fullWidth label="Ingrese el texto" name="texto_aprenderas" value={textoAprenderas.texto_aprenderas} onChange={agregarAprenderas} variant="outlined" />

                    <Button 
                        variant="outlined" 
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={enviarAprenderas}
                    >
                        Agregar texto
                    </Button>
                  </Stack>
              </Grid>
              </Grid>
          </Stack>
          <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              sx={{mt:2}}
              onClick={registrarCurso}
          >
            Actualizar datos
          </Button>
        </Box>
    );

}

export default CourseAprenderas;
