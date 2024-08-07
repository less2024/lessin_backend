import { useEffect, useState,useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

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

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

CourseCreate.propTypes = {
  updateState:PropTypes.func
};

function CourseCreate({updateState,...other}) {

    const { jwt  } = useContext(UserContext);
    const navigate = useNavigate();

    const [statusCourseValue, setStatusCourseValue] = useState('pending');

    const handleCourseStatusChange = (event) => {
        setStatusCourseValue(event.target.value);
    };

    // Data universal
    const [postCurso,setPostCurso] = useState({
        fTitulo:'',
        fSubTitulo:'',
        fDescripcionCorta:'',
        fDescripcion:'',  
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
        axios.post(baseUrl,
        {
            title:postCurso.fTitulo,
            content:postCurso.fDescripcion,
            status:statusCourseValue,
            acf:{
                pcurso_stitulo:postCurso.fSubTitulo,
                pcurso_desccorta:postCurso.fDescripcionCorta,
                pcurso_descripcion:postCurso.fDescripcion,
            }
        },
        {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
            }
        }).then((data)=>{
            updateState(false)
            navigate('/dashboard/courses/edit-course/'+data.data.id);
        }).catch((error) => {
            console.log('error',error);
        });
    }

    useEffect(()=>{
    },[])

    return (
        <Box>
            <Stack spacing={2}>

                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Estado</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={statusCourseValue}
                        onChange={handleCourseStatusChange}
                    >
                        <FormControlLabel value="pending" control={<Radio />} label="Borrador" />
                        <FormControlLabel value="publish" control={<Radio />} label="Publicado" />
                    </RadioGroup>
                </FormControl>

                <TextField 
                    id="outlined-basic" 
                    fullWidth 
                    label="Titulo" 
                    onChange={changePostCurso} 
                    value={postCurso.fTitulo} 
                    name="fTitulo" 
                />
                <TextField 
                    id="outlined-basic" 
                    fullWidth 
                    label="Sub titulo" 
                    onChange={changePostCurso} 
                    value={postCurso.fSubTitulo} 
                    name="fSubTitulo" 
                />
                <TextField 
                    id="outlined-basic" 
                    fullWidth 
                    label="Descripcion corta" 
                    onChange={changePostCurso} 
                    value={postCurso.fDescripcionCorta} 
                    name="fDescripcionCorta" 
                    multiline
                    rows={1}
                />
                <TextField 
                    id="outlined-basic" 
                    fullWidth 
                    label="Descripcion" 
                    onChange={changePostCurso} 
                    value={postCurso.fDescripcion} 
                    name="fDescripcion" 
                    multiline
                    rows={3}
                />
            </Stack>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{mt:2}}
                onClick={registrarCurso}
            >
                Crear curso
            </Button>
        </Box>
    );

}

export default CourseCreate;
