import { useEffect, useState,useContext } from 'react';
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

CourseInfo.propTypes = {
  updateState:PropTypes.func
};

function CourseInfo({updateState,...other}) {

    const { jwt  } = useContext(UserContext);
    const { id } = useParams();


    // Data universal
    const [postCurso,setPostCurso] = useState({
        fEstudiantes:'',
        fDuracion:'',
        fLecciones:'',
        fNivel:'',
        fCertificado:'',
    });

    const changePostCurso = (e) =>{
        setPostCurso({
            ...postCurso,
            [e.target.name]: e.target.value
        });
    }

    // Enviar data
    const baseUrl  = 'https://api.lessin.pe/wp-json/wp/v2/cursos';

    const registrarCurso = () =>{
        updateState(true)
        axios.put(baseUrl+'/'+id,
        {
            acf:{
                pcurso_estudiantes:postCurso.fEstudiantes,
                pcurso_duracion:postCurso.fDuracion,
                pcurso_lecciones:postCurso.fLecciones,
                pcurso_nivel:postCurso.fNivel,
                pcurso_certificado:postCurso.fCertificado,
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
            setPostCurso({
                fEstudiantes: resp.data.acf.pcurso_estudiantes,
                fDuracion: resp.data.acf.pcurso_duracion,
                fLecciones: resp.data.acf.pcurso_lecciones,
                fNivel: resp.data.acf.pcurso_nivel,
                fCertificado: resp.data.acf.pcurso_certificado,
            });
            updateState(false)
        })
    }


    useEffect(()=>{
        getCourse();
    },[])

    return (
        <Box>
            <Grid item xs={12} sm={12} md={12}>
                <Stack spacing={2}>
                    <TextField id="outlined-basic" fullWidth label="Estudiantes" onChange={changePostCurso} value={postCurso.fEstudiantes} name="fEstudiantes" variant="outlined" />
                    <TextField id="outlined-basic" fullWidth label="Duración" onChange={changePostCurso} value={postCurso.fDuracion} name="fDuracion" variant="outlined" />
                    <TextField id="outlined-basic" fullWidth label="Lecciones" onChange={changePostCurso} value={postCurso.fLecciones} name="fLecciones" variant="outlined" />
                    <TextField id="outlined-basic" fullWidth label="Nivel" onChange={changePostCurso} value={postCurso.fNivel} name="fNivel" variant="outlined" />
                    <TextField id="outlined-basic" fullWidth label="Certificado" onChange={changePostCurso} value={postCurso.fCertificado} name="fCertificado" variant="outlined" />
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

export default CourseInfo;
