import { useEffect, useState,useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import { useParams } from "react-router-dom";

// @mui
import { 
    Box,
    Grid,
    Stack,
    Button,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    TextField,
    Autocomplete,
    List,
    Paper
 } from '@mui/material';

 // Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";

import AddIcon from '@mui/icons-material/Add';

CourseDocentes.propTypes = {
  updateState:PropTypes.func
};

function CourseDocentes({updateState,...other}) {

    const { jwt  } = useContext(UserContext);
    const navigate = useNavigate();
    const { id } = useParams();

    // Data universal
    const [postCurso,setPostCurso] = useState({
        fProfesor:'',
        fProfesorDescripcion:'',
        fId:''
    });

    // Get docentes
    const urlDocentes  = 'https://api.lessin.pe/wp-json/wp/v2/docentes?per_page=100';

    const[docenteImagen,setDocenteImagen] = useState({
        docenteImagen:null,
        docenteImagenName:null,
    });

    const [docentesList,setDocentesList] = useState();
    const [docenteSelected,setDocenteSelected] = useState();
    const getDocentes  = async () =>{
        await axios.get(urlDocentes,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                }
            }
        ).then((data)=>{
            setDocentesList(data.data);
        });
    }

    // Enviar data
    const baseUrl  = 'https://api.lessin.pe/wp-json/wp/v2/cursos';

    const registrarCurso = () =>{
        updateState(true)
        axios.put(baseUrl+'/'+id,
        {
            acf:{
                pcurso_profesor_foto:String(docenteSelected.id),
                pcurso_profesor_foto2:docenteImagen.docenteImagen ? docenteImagen.docenteImagen : '',
                pcurso_profesor:postCurso.fProfesor,
                pcurso_profesor_descripcion:postCurso.fProfesorDescripcion,
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
            
            setDocenteImagen({
                docenteImagen:resp.data.acf.pcurso_profesor_foto2
            })
            setPostCurso({
                fProfesor:resp.data.acf.pcurso_profesor,
                fProfesorDescripcion:resp.data.acf.pcurso_profesor_descripcion,
                fId:resp.data.acf.pcurso_profesor_foto
            });
            setDocenteSelected({
                acf:{
                    pdocente_imagen:resp.data.acf.pcurso_profesor_foto2,
                    pdocente_descripcion:resp.data.acf.pcurso_profesor_descripcion
                },
                title:{
                    rendered:resp.data.acf.pcurso_profesor
                }
            })
            updateState(false)
        })
    }

    useEffect(()=>{
        getDocentes();
        getCourse();
    },[])

    return (
        <Box>
            <Grid item xs={12} sm={12} md={12}>
                <Stack spacing={2}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={12} md={6}>
                            {docentesList &&
                                <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={docentesList}
                                onChange={(event, newValue) => {
                                    if(newValue){
                                        setDocenteImagen({
                                            ...docenteImagen,
                                            docenteImagen:newValue.acf.pdocente_imagen
                                        })
                                        setPostCurso({
                                            ...postCurso,
                                            fProfesor:newValue.title.rendered,
                                            fProfesorDescripcion:newValue.acf.pdocente_descripcion
                                        });
                                        setDocenteSelected(newValue);
                                    }else{
                                        setDocenteImagen({
                                            ...docenteImagen,
                                            docenteImagen:''
                                        })
                                        setPostCurso({
                                            ...postCurso,
                                            fProfesor:'',
                                            fProfesorDescripcion:''
                                        });
                                        setDocenteSelected();
                                    }
                                }}
                                getOptionLabel={option => option.title.rendered}
                                
                                renderInput={(params) => <TextField {...params} label="Docentes" />}
                                />
                            }

                            {docenteSelected &&
                                <Box sx={{mt:3}} >
                                    <Paper variant='outlined'>
                                        <List disablePadding sx={{ width: '100%',padding:2, bgcolor: 'background.paper' }}>
                                            <ListItem disablePadding key={faker.datatype.uuid()} alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt="Remy Sharp" src={docenteSelected.acf.pdocente_imagen} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={docenteSelected.title.rendered}
                                                    secondary={
                                                    <div>
                                                        {docenteSelected.acf.pdocente_descripcion}
                                                    </div>
                                                    }
                                                />
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </Box>
                            }
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
            </Grid>
        </Box>
    );

}

export default CourseDocentes;
