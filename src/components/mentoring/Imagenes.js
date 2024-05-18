import { useEffect, useState,useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";

// @mui
import { 
    Grid,
    TextField, 
    Box,
    Stack, 
    Button
 } from '@mui/material';

// Iconos
import AddIcon from '@mui/icons-material/Add';

 // Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";
import ImageUpload from '../upload/image';

MentoringImg.propTypes = {
  updateState:PropTypes.func
}

function MentoringImg({updateState,...other}) {

    const { jwt  } = useContext(UserContext);
    const { id } = useParams();
    const [imgVideo,setImgVideo] = useState();
    const [imgCatalogo,setImgCatalogo] = useState();

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

    // Enviar data
    const baseUrl  = 'https://api.lessin.pe/wp-json/wp/v2/mentorias';

    const registrarCurso = () =>{
        updateState(true)
        axios.put(baseUrl+'/'+id,
        {
            acf:{
                m_catalogo_preview:imgVideo ? imgVideo.image : '',
                m_catalogo:imgCatalogo ? imgCatalogo.image:'',
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
        axios.get(baseUrl+'/'+id).then((resp)=>{
            updateState(false)
            setImgVideo({
                image:resp.data.acf.m_catalogo_preview
            })
            setImgCatalogo({
                image:resp.data.acf.m_catalogo
            })
        })
    }

    useEffect(()=>{
        getCourse();
    },[])


    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={8}>
                        <ImageUpload 
                            updateState={setImgVideo} 
                            recomend={'Video: Tamaño recomendado 600x336 pixeles'} 
                            imageData={imgVideo} 
                            height={'250px'}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <ImageUpload 
                            updateState={setImgCatalogo} 
                            recomend={'Catalogo: Tamaño recomendado: 270x152 pixeles'} 
                            imageData={imgCatalogo} 
                            height={'250px'}
                        />
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

export default MentoringImg;
