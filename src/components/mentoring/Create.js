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

MentoringCreate.propTypes = {
  updateState:PropTypes.func
};

function MentoringCreate({updateState,...other}) {

    const { jwt  } = useContext(UserContext);
    const navigate = useNavigate();

    // Data universal
    const [postCurso,setPostCurso] = useState({
        fTitulo:'',
        fDescripcionCorta:'',
        fDescripcion:'',
        fFecha:'',
        fMentor:'',
        fLink:'',
    });

    const changePostCurso = (e) =>{
        setPostCurso({
            ...postCurso,
            [e.target.name]: e.target.value
        });
    }

    // Enviar data
    const baseUrl  = 'https://api.lessin.pe/wp-json/wp/v2/mentorias';

    const registrarCurso = () =>{
        updateState(true)
        axios.post(baseUrl,
        {
            title:postCurso.fTitulo,
            content:postCurso.fDescripcion,
            status:"publish",
            acf:{
                
                m_sdescripcion:postCurso.fDescripcionCorta,
                m_descripcion:postCurso.fDescripcion,
                m_fecha:postCurso.fFecha,
                m_mentor:postCurso.fMentor,
                m_link:postCurso.fLink,
            }
        },
        {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
            }
        }).then((data)=>{
            updateState(false)
            navigate('/dashboard/mentoring/edit-mentoring/'+data.data.id);
        }).catch((error) => {
            console.log('error',error);
        });
    }

    useEffect(()=>{
    },[])

    return (
        <Box>
            <Stack spacing={2}>
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
                    label="Descripcion" 
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
                                <TextField 
                    id="outlined-basic" 
                    fullWidth 
                    label="Fecha" 
                    onChange={changePostCurso} 
                    value={postCurso.fFecha} 
                    name="fFecha" 
                />
                <TextField 
                    id="outlined-basic" 
                    fullWidth 
                    label="Mentor" 
                    onChange={changePostCurso} 
                    value={postCurso.fMentor} 
                    name="fMentor" 
                />
                <TextField 
                    id="outlined-basic" 
                    fullWidth 
                    label="Link" 
                    onChange={changePostCurso} 
                    value={postCurso.fLink} 
                    name="fLink" 
                />
            </Stack>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{mt:2}}
                onClick={registrarCurso}
            >
                Crear mentoria
            </Button>
        </Box>
    );

}

export default MentoringCreate;
