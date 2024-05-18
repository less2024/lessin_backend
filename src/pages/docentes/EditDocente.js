import { Helmet } from 'react-helmet-async';
import { useState,useContext, useEffect } from 'react';

// @mui
import {
  Card,
  CardHeader,
  CardContent ,
  Grid,
  CardMedia ,
  Container,
  Typography, 
  TextField, 
  Stack,
  Chip,
  Button,
  IconButton

} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from "@mui/icons-material/UploadFile";

// Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";
import { useNavigate,useParams } from 'react-router-dom';


export default function EditDocente() {

    let { id } = useParams(); 
    const { jwt  } = useContext(UserContext);
    const navigate = useNavigate();

    // Upload image docente
    const[docenteImage,setDocenteImage] = useState({
        docenteImage:null,
        docenteImageName:null
    });

    const changeScreen  = (e)=>{
        axios.post(`https://api.lessin.pe/wp-json/wp/v2/media`,e.target.files[0],
        {
        headers:{
            'Authorization': 'Bearer '+ jwt,
            'Content-Type': e.target.files[0].type,
            'Content-Disposition': `form-data; filename=${e.target.files[0].name}`
        }
        }).then((resp)=>{
        setDocenteImage({
            ...docenteImage,
            docenteImage:resp.data.guid.rendered,
            docenteImageName:e.target.files[0].name
        });
        }).catch((error)=>{
            console.log(error)
        })
    }

    const removeDocenteImage = () =>{
        setDocenteImage({
            ...docenteImage,
            docenteImage:null,
            docenteImageName:null
        });
    }

    // Textfield
    const [postDocente,setPostDocente] = useState({
        dTitulo:'',
        dDescripcion:''
    });

    const changePostDocente = (e) =>{
        setPostDocente({
        ...postDocente,
            [e.target.name]: e.target.value
        });
    }

    // Crear docente
    const baseUrl  = 'https://api.lessin.pe/wp-json/wp/v2/docentes';
    const registrarDocente = () =>{
        axios.put(baseUrl+'/'+id,
        {
            title:postDocente.dTitulo,
            status:"publish",
            acf:{
                pdocente_descripcion:postDocente.dDescripcion,
                pdocente_imagen:docenteImage.docenteImage
            }
        },
        {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
            
            }
        }).then((data)=>{
            navigate('/dashboard/docentes');
        }).catch((error) => {
            console.log('error',error);
        });

    }

    //  Get docente
    const [docenteEdit,setDocenteEdit] = useState();
    const getDocenteUpdate = () =>{
        axios.get(baseUrl+'/'+id)
        .then((data)=>{
            setDocenteEdit(data.data)
            setPostDocente({
                ...postDocente,
                dTitulo:data.data.title.rendered,
                dDescripcion:data.data.acf.pdocente_descripcion,
            });
            setDocenteImage({
                ...docenteImage,
                docenteImage:data.data.acf.pdocente_imagen,
                docenteImageName:data.data.title.rendered
            });
        })
    }

    useEffect(()=>{
        getDocenteUpdate();
    },[])

    return (
        <>
        <Helmet>
            <title> Editar docente - {docenteEdit ? docenteEdit.title.rendered : 'Lessin'} | Lessin  </title>
        </Helmet>

        <Container maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 5 }} >
            Editar Docente
            </Typography>

            <Grid item xs={12} sm={12} md={12}>
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                    <Typography variant="h5" sx={{ mb: 3 }}>
                        Informacion
                    </Typography>
                    <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={4}>
                        <Chip label="Tamaño recomendado: 200x200 pixeles" sx={{ mb: 1 }} />
                        {docenteImage.docenteImage === null ?
                        <Button
                            component="label"
                            fullWidth
                            variant="outlined"
                            className='btnUpload'
                            startIcon={<UploadFileIcon />}
                            sx={{ marginRight: "1rem" }}
                        >
                            Foto
                            <input 
                            type="file" 
                            name="imagenPreview"
                            id="imagenPreview"
                            accept=".png,.jpg" 
                            hidden 
                            value={null}
                            onChange={()=>changeScreen(event)} 
                            />
                        </Button>
                        :
                        <Card>
                            <CardMedia
                            component="img"
                            height="194"
                            image={docenteImage.docenteImage}
                            >
                            </CardMedia>
                            <CardHeader
                            action={
                                <IconButton aria-label="settings" onClick={removeDocenteImage}>
                                <DeleteIcon />
                                </IconButton>
                            }
                            title={docenteImage.docenteImageName}
                            subheader="Video Preview"
                            sx={{ p: 2}}
                            />
                        </Card>
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                        <Stack spacing={3}>
                        <TextField id="outlined-basic" fullWidth label="Nombres" onChange={changePostDocente} value={postDocente.dTitulo} name="dTitulo" variant="outlined" />
                        
                        <TextField id="outlined-basic" fullWidth label="Biografia" onChange={changePostDocente} value={postDocente.dDescripcion} name="dDescripcion" variant="outlined" />
                        </Stack>
                    </Grid>

                    </Grid>
                    
                    </CardContent>
                </Card>
                <Grid item xs={12} sm={12} md={12}>
                <Card>
                    <CardContent>
                    <Button variant="contained" onClick={registrarDocente}>
                        Actualizar docente
                    </Button>
                    </CardContent>
                </Card>
                </Grid>
            </Grid>

        </Container>
        </>
    );
}
