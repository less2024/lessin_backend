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

CourseValoraciones.propTypes = {
  updateState:PropTypes.func
};

function CourseValoraciones({updateState,...other}) {

    const { jwt  } = useContext(UserContext);
    const { id } = useParams();

    // Data universal
    const [postCurso,setPostCurso] = useState({
        fValoracion:'',
        fValoracion1:'',
        fValoracion2:'',
        fValoracion3:'',
        fValoracion4:'',
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
                pcurso_valoracion:postCurso.fValoracion,
                pcurso_valoracion1:postCurso.fValoracion1,
                pcurso_valoracion2:postCurso.fValoracion2,
                pcurso_valoracion3:postCurso.fValoracion3,
                pcurso_valoracion4:postCurso.fValoracion4,
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
                fValoracion: resp.data.acf.pcurso_valoracion,
                fValoracion1: resp.data.acf.pcurso_valoracion1,
                fValoracion2: resp.data.acf.pcurso_valoracion2,
                fValoracion3: resp.data.acf.pcurso_valoracion3,
                fValoracion4: resp.data.acf.pcurso_valoracion4,
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
                    <TextField id="outlined-basic" fullWidth label="Valoracion"  onChange={changePostCurso} value={postCurso.fValoracion} name="fValoracion" variant="outlined" />
                    <TextField id="outlined-basic" fullWidth label="Porcentaje #1"  onChange={changePostCurso} value={postCurso.fValoracion1} name="fValoracion1" variant="outlined" />
                    <TextField id="outlined-basic" fullWidth label="Porcentaje #2"  onChange={changePostCurso} value={postCurso.fValoracion2} name="fValoracion2" variant="outlined" />
                    <TextField id="outlined-basic" fullWidth label="Porcentaje #3"  onChange={changePostCurso} value={postCurso.fValoracion3} name="fValoracion3" variant="outlined" />
                    <TextField id="outlined-basic" fullWidth label="Porcentaje #4"  onChange={changePostCurso} value={postCurso.fValoracion4} name="fValoracion4" variant="outlined" />
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

export default CourseValoraciones;
