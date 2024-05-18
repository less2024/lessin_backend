import { useEffect, useState,useContext } from 'react';
import PropTypes from 'prop-types';
import { faker } from '@faker-js/faker';
import { useParams } from "react-router-dom";


// @mui
import { 
    Grid,
    TextField, 
    Box,
    Typography,
    Stack, 
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Alert
 } from '@mui/material';

// Iconos
import AddIcon from '@mui/icons-material/Add';
import Iconify from '../../components/iconify';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

 // Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";


CoursePreguntas.propTypes = {
  updateState:PropTypes.func
}

function CoursePreguntas({updateState,...other}) {

    const { jwt  } = useContext(UserContext);
    const { id } = useParams();

    // Data universal
    const [postCurso,setPostCurso] = useState({
        fVideo: ''
    });

    const changePostCurso = (e) =>{
        setPostCurso({
            ...postCurso,
            [e.target.name]: e.target.value
        });
    }

    // Preguntas frecuentes
    const [pregunta,setPregunta] = useState({
        pregunta:'',
        respuesta:''
    });
    const [preguntaLista,setPreguntaLista] = useState([]);
    
    const agregarPregunta = (event) =>{
        setPregunta({
        ...pregunta,
        [event.target.name]: event.target.value
        });
    }

    const enviarPregunta = () =>{
        setPreguntaLista([
        ...preguntaLista,
            {id:faker.datatype.uuid(),pcurso_ptitulo:pregunta.pregunta,pcurso_prespuesta:pregunta.respuesta}
        ]);
        setPregunta({
            pregunta:'',
            respuesta:''
        })
    }

    const eliminarPregunta = (item) =>{
        setPreguntaLista(
        preguntaLista.filter((preguntaItem) => preguntaItem.id !== item.id)
        );
    }

    // Enviar data
    const baseUrl  = 'https://api.lessin.pe/wp-json/wp/v2/cursos';

    const registrarCurso = () =>{
        updateState(true)
        axios.put(baseUrl+'/'+id,
        {
            acf:{
                pcurso_preguntas:preguntaLista
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
    const getCourse = () =>{
        updateState(true)

        axios.get(baseUrl+'/'+id,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        }
        ).then((resp)=>{
        if(resp.data.acf.pcurso_preguntas.length> 0){
            const listaTmp = [];
            
            resp.data.acf.pcurso_preguntas.map((item)=>{
                listaTmp.push(
                    {
                        id:faker.datatype.uuid(),
                        pcurso_ptitulo:item.pcurso_ptitulo,
                        pcurso_prespuesta:item.pcurso_prespuesta
                    }
                )

            })
            setPreguntaLista(listaTmp);
        }
        updateState(false)

        })
    }

    useEffect(()=>{
        getCourse();
    },[])

    return (
        <Box>

            <Stack direction="row" alignItems="center"  justifyContent="space-between">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={8}>
                        <Typography variant="h6" gutterBottom>
                            Lista
                        </Typography>
                        {preguntaLista.length > 0 ?
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {preguntaLista.length > 0 &&
                                preguntaLista.map((item,index) =>{
                                return (
                                    <>
                                        {index !== 0 && <Divider/> }
                                        <ListItem alignItems="flex-start">

                                            <ListItemText
                                                primary={item.pcurso_ptitulo}
                                                secondary={
                                                <div>
                                                    {item.pcurso_prespuesta}
                                                </div>
                                                }
                                            />
                                            <IconButton onClick={()=>eliminarPregunta(item)}>
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
                            <TextField id="outlined-basic" fullWidth label="Pregunta" name="pregunta" value={pregunta.pregunta} onChange={agregarPregunta} variant="outlined" />
                            <TextField id="outlined-basic" fullWidth label="Respuesta" name="respuesta" value={pregunta.respuesta} onChange={agregarPregunta} variant="outlined" />
                            <Grid item xs={12} sm={12} md={12}  sx={{ mb: 3 }}>
                                <Button 
                                variant="outlined" 
                                startIcon={<Iconify icon="eva:plus-fill" />}
                                onClick={enviarPregunta}
                                >
                                Agregar pregunta
                                </Button>
                            </Grid>
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

export default CoursePreguntas;
