import { Helmet } from 'react-helmet-async';
import { useState,useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { faker } from '@faker-js/faker';
import { useParams } from "react-router-dom";

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
  Box,
  Stack, 
  Modal,
  Chip,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  FormGroup,
  FormControlLabel,
  ListItemText,
  Checkbox,
  Divider,
  IconButton,
  Autocomplete,
  Collapse
  
} from '@mui/material';

import Iconify from '../components/iconify';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ClassIcon from '@mui/icons-material/Class';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from "@mui/icons-material/UploadFile";

// Axios
import axios from 'axios';
import UserContext from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

function AgregarModulo(props) {
  const { value, cambioField, enviarModulo,action, ...other } = props;
  return  (
    <Stack spacing={3}>
      <TextField value={value} onChange={cambioField} id="tituloModulo" name="tituloModulo" fullWidth label="Titulo" variant="outlined" {...other }/>
      <Button 
        variant="contained" 
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={enviarModulo}
      >
        {action ? 'Agregar' : 'Actualizar'}
      </Button>
    </Stack>
  );
}

AgregarModulo.propTypes = {
  enviarModulo: PropTypes.func,
  cambioField: PropTypes.func,
  action: PropTypes.bool,
  value: PropTypes.string,
};


function AgregarClase(props){
  const { enviarClase, title,duracion,video,claseChange,action, ...other } = props;
  return (
    <>
      <Grid container spacing={3} >
        <Grid item xs={12} sm={12} md={12}>
          <Typography variant="h4" sx={{ mb: 0 }}>
            {action ? 'Agregar clase': 'Editar clase'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={8}>
          <TextField id="outlined-basic" fullWidth label="Titulo" name="pcurso_temario_ltitulo" value={title} onChange={claseChange} variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <TextField id="outlined-basic" fullWidth label="Duracion" name="pcurso_temario_lduracion" value={duracion} onChange={claseChange} variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <TextField id="outlined-basic" fullWidth label="Video" name="pcurso_temario_lvideo" value={video} onChange={claseChange} variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={12} md={12} >
          
          <Button 
            variant="contained" 
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={enviarClase}
          >
            {action ? 'Agregar': 'Actualizar'}
          </Button>

        </Grid>
      </Grid>
    </>
  );
};

AgregarClase.propTypes = {
  enviarClase: PropTypes.func,
  title: PropTypes.string,
  duracion: PropTypes.string,
  video: PropTypes.string,
  claseChange: PropTypes.func,
  action:PropTypes.bool
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  boxShadow: 24,
};


export default function EditCourse() {

  let { id } = useParams(); 
  const { jwt  } = useContext(UserContext);
  const [temario,setTemario] = useState([]);
  const [tituloModulo,setTituloModulo] = useState();
  const navigate = useNavigate();

  
  // Data universal
  const [postCurso,setPostCurso] = useState({
    fTitulo:'',
    fSubTitulo:'',
    fDescripcionCorta:'',
    fDescripcion:'',
    fProfesor:'',
    fProfesorDescripcion:'',
    fVideo:'',
    fEstudiantes:'',
    fDuracion:'',
    fLecciones:'',
    fNivel:'',
    fCertificado:'',
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
  const baseUrl  = 'https://api.lessin.pe/wp-json/wp/v2/cursos/'+IDBCursor;

  const registrarCurso = () =>{

    axios.put(baseUrl,
      {
        title:postCurso.fTitulo,
        content:postCurso.fDescripcion,
        status:"publish",
        categoria:categoriaCheck,
        acf:{
          pcurso_stitulo:postCurso.fSubTitulo,
          pcurso_desccorta:postCurso.fDescripcionCorta,
          pcurso_descripcion:postCurso.fDescripcion,
          pcurso_profesor_foto:null,
          pcurso_profesor_foto2:docenteImagen.docenteImagen,
          pcurso_profesor:postCurso.fProfesor,
          pcurso_profesor_descripcion:postCurso.fProfesorDescripcion,
          pcurso_aprenderas:aprenderasLista,
          pcurso_temario:temario,
          pcurso_videopreview:cursoImageList.videoPreview,
          imagen_catalogo:cursoImageList.catalogoPreview,
          pcurso_video:postCurso.fVideo,
          pcurso_estudiantes:postCurso.fEstudiantes,
          pcurso_duracion:postCurso.fDuracion,
          pcurso_lecciones:postCurso.fLecciones,
          pcurso_nivel:postCurso.fNivel,
          pcurso_certificado:postCurso.fCertificado,
          pcurso_valoracion:postCurso.fValoracion,
          pcurso_valoracion1:postCurso.fValoracion1,
          pcurso_valoracion2:postCurso.fValoracion2,
          pcurso_valoracion3:postCurso.fValoracion3,
          pcurso_valoracion4:postCurso.fValoracion4,
          pcurso_preguntas:preguntaLista
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
          
        }
      }).then((data)=>{
        console.log(data);
        navigate('/dashboard/app');
      }).catch((error) => {
        console.log('error',error);
      });

  }

  // Clase
  const [openModuleModal, setOpenModuleModal] = useState(false);
  const [openModuloId, setOpenModuloId] = useState();
  const [actionModuleModal,setActionModuleModal] = useState(false);

  const handleModuleOpen = () => {
    setOpenModuleModal(true);
    setActionModuleModal(true);
    setTituloModulo('');
  };

  const handleModuleClose = () => {
    setOpenModuleModal(false);
    setActionModuleModal(true);
  };

  const [openModal, setOpenModal] = useState(false);
  const [actionModal,setActionModal] = useState(false);

  const handleOpen = (id) => {
    setOpenModal(true);
    setOpenModuloId(id);
    setActionModal(true);
  };

  const handleClose = () => {
    setOpenModal(false)
  };

  const fieldModulo = (event) =>{
    setTituloModulo(event.target.value);
  }

  const agregarTituloModulo = () =>{
    setTemario([...temario,{pcurso_temario_titulo:tituloModulo,id:faker.datatype.uuid(),pcurso_temario_lista:[]}])
    setTituloModulo('');
    setOpenModuleModal(false);
  }

  const actualizarTituloModulo = (id) =>{

    setTemario(
      temario.map((temarioItem,index) =>{
        if(id === temarioItem.id){
          return { ...temarioItem,pcurso_temario_titulo:tituloModulo}
        }else{
          return {...temarioItem}          
        }
      })
    );
    setTituloModulo('');
    setOpenModuleModal(false);
  }
  
  const eliminarModulo = (item)=>{
    setTemario(
      temario.filter((temarioIn) => temarioIn.id !== item.id)
    );
  }

  const editarModulo = (item)=>{
    handleModuleOpen(true);
    setTituloModulo(item.pcurso_temario_titulo)
    setActionModuleModal(false);
    setOpenModuloId(item.id);
  }

  const [clase,setClase] = useState({
    id:'',
    pcurso_temario_ltitulo:'',
    pcurso_temario_lvideo:'',
    pcurso_temario_lduracion:''
  });

  const enviarClase = (id)=>{
    setTemario(
      temario.map((temario,index) =>{
        if(id === temario.id){
          return {...temario, pcurso_temario_lista:[...temario.pcurso_temario_lista,{id:faker.datatype.uuid(),pcurso_temario_ltitulo:clase.pcurso_temario_ltitulo,pcurso_temario_lvideo:clase.pcurso_temario_lvideo,pcurso_temario_lduracion:clase.pcurso_temario_lduracion}]}
        }else{
          return {...temario}
        }
      })
    );
    setOpenModal(false);
    setClase({
      id:'',
      pcurso_temario_ltitulo:'',
      pcurso_temario_lvideo:'',
      pcurso_temario_lduracion:''
    });
  }

  const [classListTemp,setClassListTemp] = useState([]);
  const actualizarClase = (id,item) =>{
    const newState = classListTemp.map(obj => {
      if (obj.id === item.id) {
        return {...obj, id: clase.id,pcurso_temario_ltitulo:clase.pcurso_temario_ltitulo,pcurso_temario_lvideo:clase.pcurso_temario_lvideo,pcurso_temario_lduracion:clase.pcurso_temario_lduracion };
      }
      return obj;
    });
    
    setTemario(
      temario.map((temario,index) =>{
        if(id === temario.id){
          return {...temario,pcurso_temario_lista:newState}
        }else{
          return {...temario}
        }
      })
    );
    
    setOpenModal(false);

    setClase({
      id:'',
      pcurso_temario_ltitulo:'',
      pcurso_temario_lvideo:'',
      pcurso_temario_lduracion:''
    });
  }

  const claseChange = (event) =>{
    setClase({
      ...clase,
      [event.target.name]: event.target.value
    });
  }

  const editClass = (item,itemSub)=>{
    setOpenModal(true);
    setActionModal(false);
    setClase(itemSub);
    setOpenModuloId(item.id);
    setClassListTemp(item.pcurso_temario_lista);
  }

  const eliminarClase = (item,itemSub) =>{

    const newState = item.pcurso_temario_lista.filter(obj => {
      return obj.id !== itemSub.id;
    });

    setTemario(
      temario.map((temario,index) =>{
        if(item.id === temario.id){
          return {...temario,pcurso_temario_lista:newState}
        }else{
          return {...temario}
        }
      })
    );
  }

  

  // Upload image curso
  const[cursoImageList,setCursoImageList] = useState({
      videoPreview:null,
      videoPreviewName:null,
      catalogoPreview:null,
      catalogoPreviewName:null
  });

  const changeScreen  = (id,e)=>{
    axios.post(`https://api.lessin.pe/wp-json/wp/v2/media`,e.target.files[0],
    {
      headers:{
        'Authorization': 'Bearer '+ jwt,
        'Content-Type': e.target.files[0].type,
        'Content-Disposition': `form-data; filename=${e.target.files[0].name}`
      }
    }).then((resp)=>{
      if(id===1){
        setCursoImageList({
          ...cursoImageList,
          videoPreview:resp.data.guid.rendered,
          videoPreviewName:e.target.files[0].name
        });
      }else{
        setCursoImageList({
          ...cursoImageList,
          catalogoPreview:resp.data.guid.rendered,
          catalogoPreviewName:e.target.files[0].name
        });
      }

    }).catch((error)=>{
      console.log(error)
    })
  }

  const removeCursosImage = (number) =>{
    if(number === 1){
      setCursoImageList({
        ...cursoImageList,
        videoPreview:null,
        videoPreviewName:null,
      });
    }else{
      setCursoImageList({
        ...cursoImageList,
        catalogoPreview:null,
        catalogoPreviewName:null
      });
    }
  }

  // Docente
  const[docenteImagen,setDocenteImagen] = useState({
      docenteImagen:null,
      docenteImagenName:null,

  });

  const changeDocenteImagen  = (e)=>{
    axios.post(`https://api.lessin.pe/wp-json/wp/v2/media`,e.target.files[0],
    {
      headers:{
        'Authorization': 'Bearer '+ jwt,
        'Content-Type': e.target.files[0].type,
        'Content-Disposition': `form-data; filename=${e.target.files[0].name}`
      }
    }).then((resp)=>{
      setDocenteImagen({
        ...docenteImagen,
        docenteImagen:resp.data.guid.rendered,
        docenteImagenName:e.target.files[0].name
      });
    }).catch((error)=>{
      console.log(error)
    })
  }

  const removeDocenteImagen = (number) =>{
    setDocenteImagen({
      ...docenteImagen,
      docenteImagen:null,
      docenteImagenName:null,
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


  // Aprederas 
  const [textoAprenderas,setTextoAprenderas] = useState({
    texto_aprenderas:''
  });
  const [aprenderasLista,setAprenderasLista] = useState([]);
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
  }

  const eliminarAprenderas= (item) =>{
    setAprenderasLista(
      aprenderasLista.filter((aprenderasItem) => aprenderasItem.id !== item.id)
    );
  }

  
  // Get docentes
  const urlDocentes  = 'https://api.lessin.pe/wp-json/wp/v2/docentes?per_page=100';
  const [docentesList,setDocentesList] = useState();
  const [docenteSelected,setDocenteSelected] = useState();
  const getDocentes  = () =>{
    axios.get(urlDocentes).then((data)=>{
      setDocentesList(data.data);
    });
  }


  // Mostrar categorias
  const urlCategorias  = 'https://api.lessin.pe/wp-json/lessin/v1/categorias';
  const [categoriasList,setCategoriasList] = useState();
  const getCategorias = () =>{
    axios.get(urlCategorias).then((data)=>{
      setCategoriasList(data.data);
    });
  }
  


  // Categorias
  const[categoriaCheck,setCategoriaCheck] = useState([]);
  const changeCategria = (e) =>{
    if(e.target.checked) {
      setCategoriaCheck([
        ...categoriaCheck,
        parseInt(e.target.value)
      ])
    }else{
      setCategoriaCheck((current,index) =>
        current.filter((item) =>{
          return parseInt(item) !== parseInt(e.target.value);
        })
      );
    }
  }

  // Get Course
  const urlGetCourseId  = 'https://api.lessin.pe/wp-json/wp/v2/cursos/'+id;
  const getCourseDetail = ()=>{
    axios.get(urlGetCourseId).then((data)=>{

      // Aprenderas Lista
      const apresderaslUpdateLista= [];
      if(data.data.acf.pcurso_aprenderas){
        data.data.acf.pcurso_aprenderas.map((item,index)=>{
          apresderaslUpdateLista.push({id:faker.datatype.uuid(),pcurso_aitem:item.pcurso_aitem})
        })
      }
      setAprenderasLista(apresderaslUpdateLista);

      // Preguntas Lista
      const preguntasUpdateLista = [];
      if(data.data.acf.pcurso_preguntas){
        data.data.acf.pcurso_preguntas.map((item)=>{
          preguntasUpdateLista.push(
            {id:faker.datatype.uuid(),pcurso_ptitulo:item.pcurso_ptitulo,pcurso_prespuesta:item.pcurso_prespuesta}
          )
        });
      }
      setPreguntaLista(preguntasUpdateLista);

      //Temario
      const temarioUpdate = [];
      if(data.data.acf.pcurso_temario){
        data.data.acf.pcurso_temario.map((item)=>{
          const subTemarioUpdate = [];

          item.pcurso_temario_lista.map((subItem)=>{
            subTemarioUpdate.push({
              id:faker.datatype.uuid(),
              pcurso_temario_ltitulo:subItem.pcurso_temario_ltitulo,
              pcurso_temario_lvideo:subItem.pcurso_temario_lvideo,
              pcurso_temario_lduracion:subItem.pcurso_temario_lduracion,
            })
          })
          temarioUpdate.push(
            {
              id:faker.datatype.uuid(),
              pcurso_temario_titulo:item.pcurso_temario_titulo,
              pcurso_temario_lista:subTemarioUpdate
            }
          );
        });
      }
      setTemario(temarioUpdate);

      // Imagenes Video Trailer
      setCursoImageList({
        ...cursoImageList,
        videoPreview:data.data.acf.pcurso_videopreview,
        catalogoPreview:data.data.acf.imagen_catalogo
      });

      // Docentes
      setDocenteImagen({
        docenteImagen:data.data.acf.pcurso_profesor_foto2
      });
  
      setPostCurso({
        ...postCurso,
        fProfesor:data.data.acf.pcurso_profesor,
        fProfesorDescripcion:data.data.acf.pcurso_profesor_descripcion
      });

      setDocenteSelected({
        ...docenteSelected,
        title:{
          rendered:data.data.acf.pcurso_profesor
        },
        acf:{
          pdocente_imagen:data.data.acf.pcurso_profesor_foto2,
          pdocente_descripcion:data.data.acf.pcurso_profesor_descripcion
        }
      });


      setCategoriaCheck(data.data.categoria)
      setPostCurso({
        ...postCurso,
        fTitulo:data.data.title.rendered,
        fSubTitulo:data.data.acf.pcurso_stitulo,
        fDescripcionCorta:data.data.acf.pcurso_desccorta,
        fDescripcion:data.data.acf.pcurso_descripcion,
        fProfesor:data.data.acf.pcurso_profesor,
        fProfesorDescripcion:data.data.acf.pcurso_profesor_descripcion,
        fVideo:data.data.acf.pcurso_video,
        fEstudiantes:data.data.acf.pcurso_estudiantes,
        fDuracion:data.data.acf.pcurso_duracion,
        fLecciones:data.data.acf.pcurso_lecciones,
        fNivel:data.data.acf.pcurso_nivel,
        fCertificado:data.data.acf.pcurso_certificado,
        fValoracion:data.data.acf.pcurso_valoracion,
        fValoracion1:data.data.acf.pcurso_valoracion1,
        fValoracion2:data.data.acf.pcurso_valoracion2,
        fValoracion3:data.data.acf.pcurso_valoracion3,
        fValoracion4:data.data.acf.pcurso_valoracion4,
      })
    });
  }

  useEffect(()=>{
    getCategorias();
    getDocentes();
    getCourseDetail();
  },[]);

  return (
    <>
      <Helmet>
        <title> Editar curso | Lessin </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }} >
          Editar curso
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={9}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Titulos
                </Typography>
                <Grid container spacing={3}>

                  <Grid item xs={12} sm={12} md={12}>
                    <Stack spacing={3}>
                      <TextField id="outlined-basic" fullWidth label="Titulo" onChange={changePostCurso} value={postCurso.fTitulo} name="fTitulo" variant="outlined" />
                      <TextField id="outlined-basic" fullWidth label="Sub titulo" onChange={changePostCurso} value={postCurso.fSubTitulo} name="fSubTitulo" variant="outlined" />
                      <TextField id="outlined-basic" fullWidth label="Descripcion corta" onChange={changePostCurso} value={postCurso.fDescripcionCorta} name="fDescripcionCorta" variant="outlined" />
                      <TextField id="outlined-basic" fullWidth label="Descripcion" onChange={changePostCurso} value={postCurso.fDescripcion} name="fDescripcion" variant="outlined" />
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h4" gutterBottom onClick={()=>console.log(aprenderasLista)}>
                  Con este curso aprenderás a:
                </Typography>
                <Stack direction="row" alignItems="center"  justifyContent="space-between" mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={6}>
                      {aprenderasLista.length > 0 &&
                      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {aprenderasLista.length > 0 &&
                        aprenderasLista.map((item,index) =>{
                          return (
                              <>
                                <ListItem alignItems="flex-start">

                                  <ListItemText
                                    primary={item.pcurso_aitem}
                                  />
                                  <IconButton onClick={()=>eliminarAprenderas(item)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItem>
                                <Divider/>
                              </>
                            );
                          })
                        }
                      </List>
                      }
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      
                      <Grid item xs={12} sm={12} md={12}  sx={{ mb: 3 }}>
                        <TextField id="outlined-basic" fullWidth label="Ingrese el texto" name="texto_aprenderas" value={textoAprenderas.texto_aprenderas} onChange={agregarAprenderas} variant="outlined" />
                      </Grid>

                      <Grid item xs={12} sm={12} md={12}  sx={{ mb: 3 }}>
                        <Button 
                          variant="contained" 
                          startIcon={<Iconify icon="eva:plus-fill" />}
                          onClick={enviarAprenderas}
                        >
                          Agregar texto
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                  <Typography variant="h4" gutterBottom>
                    Temario
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={handleModuleOpen}
                  >
                    Agregar
                  </Button>
                </Stack>
                {temario &&
                  <Stack spacing={0}  sx={{ mb: 4 }}>
                    {temario.length > 0 &&
                      temario.map((item,index) =>{
                        return (
                          <>
                            <Divider/>
                            <ListItem key={item.id} >
                              <IconButton>
                                <ClassIcon />
                              </IconButton>
                              <ListItemText primary={item.pcurso_temario_titulo} />
                              <IconButton onClick={()=>editarModulo(item)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton onClick={()=>{handleOpen(item.id)}}>
                                <AddIcon />
                              </IconButton>
                              <IconButton onClick={()=>eliminarModulo(item)}>
                                <DeleteIcon />
                              </IconButton>
                            </ListItem>
                            {item.pcurso_temario_lista.length > 0 &&
                              <List disablePadding>
                                {item.pcurso_temario_lista.map((itemSub,index) =>{
                                  return (
                                    <ListItem sx={{ pl: 6 }}>
                                      <ListItemText primary={itemSub.pcurso_temario_ltitulo} />
                                        <IconButton onClick={()=>{editClass(item,itemSub)}}>
                                          <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={()=>eliminarClase(item,itemSub)}>
                                          <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                  );
                                })}
                              </List>
                            }
                          </>
                        )
                      })
                    }
                  </Stack>
                }
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Imagenes / Trailer
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={4}>
                      
                      <Chip label="Tamaño recomendado: 600x336 pixeles" sx={{ mb: 1 }}/>
                      {cursoImageList.videoPreview === null?
                        <Button
                          component="label"
                          fullWidth
                          variant="outlined"
                          className='btnUpload'
                          startIcon={<UploadFileIcon />}
                          sx={{ marginRight: "1rem" }}
                        >
                          Imagen trailer
                          <input 
                            type="file" 
                            name="imagenPreview"
                            id="imagenPreview"
                            accept=".png,.jpg" 
                            hidden 
                            value={null}
                            onChange={()=>changeScreen(1,event)} 
                          />
                        </Button>
                      :
                        <Card>
                          <CardMedia
                            component="img"
                            height="194"
                            image={cursoImageList.videoPreview}
                          >
                          </CardMedia>
                          <CardHeader
                            action={
                              <IconButton aria-label="settings" onClick={()=>{removeCursosImage(1)}}>
                                <DeleteIcon />
                              </IconButton>
                            }
                            title={cursoImageList.videoPreviewName ? cursoImageList.videoPreviewName :''}
                            subheader="Video Preview"
                            sx={{ p: 2}}
                          />
                        </Card>
                      }
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                      <Chip label="Tamaño recomendado: 270x152 pixeles" sx={{ mb: 1 }} />
                      {cursoImageList.catalogoPreview === null ?
                        <Button
                          component="label"
                          fullWidth
                          variant="outlined"
                          className='btnUpload'
                          startIcon={<UploadFileIcon />}
                          sx={{ marginRight: "1rem" }}
                        >
                          Imagen de catalogo
                          <input 
                            type="file" 
                            name="imagenPreview"
                            id="imagenPreview"
                            accept=".png,.jpg" 
                            hidden 
                            value={null}
                            onChange={()=>changeScreen(2,event)} 
                          />
                        </Button>
                      :
                        <Card>
                          <CardMedia
                            component="img"
                            height="194"
                            image={cursoImageList.catalogoPreview}
                          >
                          </CardMedia>
                          <CardHeader
                            action={
                              <IconButton aria-label="settings" onClick={()=>{removeCursosImage(2)}}>
                                <DeleteIcon />
                              </IconButton>
                            }
                            title={cursoImageList.catalogoPreviewName ? cursoImageList.catalogoPreviewName :''}
                            subheader="Video Preview"
                            sx={{ p: 2}}
                          />
                        </Card>
                      }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField id="outlined-basic" fullWidth label="Video preview" onChange={changePostCurso} value={postCurso.fVideo} name="fVideo" variant="outlined" />
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3,zIndex:9 ,overflow:'visible'}}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                    Docente
                </Typography>
                <Stack direction="row" alignItems="center"  justifyContent="space-between" mt={3}>
                  <Grid container spacing={3}>
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
                          sx={{zIndex:9 }}
                          renderInput={(params) => <TextField {...params} label="Docentes" />}


                        />
                      }
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      {docenteSelected &&
                      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <ListItem alignItems="flex-start">
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
                      }
                    </Grid>
                  </Grid>
                </Stack>


              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Preguntas frecuentes
                </Typography>
                <Stack direction="row" alignItems="center"  justifyContent="space-between" mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={6}>
                      {preguntaLista.length > 0 &&
                      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {preguntaLista.length > 0 &&
                        preguntaLista.map((item,index) =>{
                          return (
                              <>
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
                                <Divider/>
                              </>
                            );
                          })
                        }
                      </List>
                      }
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      
                      <Grid item xs={12} sm={12} md={12}  sx={{ mb: 3 }}>
                        <TextField id="outlined-basic" fullWidth label="Pregunta" name="pregunta" value={pregunta.pregunta} onChange={agregarPregunta} variant="outlined" />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}  sx={{ mb: 3 }}>
                        <TextField id="outlined-basic" fullWidth label="Respuesta" name="respuesta" value={pregunta.respuesta} onChange={agregarPregunta} variant="outlined" />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}  sx={{ mb: 3 }}>
                        <Button 
                          variant="contained" 
                          startIcon={<Iconify icon="eva:plus-fill" />}
                          onClick={enviarPregunta}
                        >
                          Agregar pregunta
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>

          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 0 }}  onClick={()=> console.log(categoriaCheck)}>
                  Categorias
                </Typography>
                {categoriasList &&
                <FormGroup onChange={changeCategria}>
                  {categoriasList.map((item,index) => {
                    const labelId = `checkbox-list-label-${item.term_id}`;
                    var itemValTemp = null;
                    if(categoriaCheck.length > 0 ){
                      categoriaCheck.map((item2)=>{
                        if(parseInt(item.term_id) === parseInt(item2)){
                          itemValTemp = item2;
                        }
                      })

                      if(parseInt(item.term_id) === parseInt(itemValTemp)){
                        return (<FormControlLabel value={item.term_id}  control={<Checkbox defaultChecked />}   label={item.name} />);
                      }else{
                        return (<FormControlLabel value={item.term_id}  control={<Checkbox />}   label={item.name} />);
                      }
                    }


                    
                  })}
                </FormGroup>
                }


              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h4" gutterBottom onClick={()=>{console.log(postCurso)}}>
                  Información
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField id="outlined-basic" fullWidth label="Estudiantes" onChange={changePostCurso} value={postCurso.fEstudiantes} name="fEstudiantes" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField id="outlined-basic" fullWidth label="Duración" onChange={changePostCurso} value={postCurso.fDuracion} name="fDuracion" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField id="outlined-basic" fullWidth label="Lecciones" onChange={changePostCurso} value={postCurso.fLecciones} name="fLecciones" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField id="outlined-basic" fullWidth label="Nivel" onChange={changePostCurso} value={postCurso.fNivel} name="fNivel" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField id="outlined-basic" fullWidth label="Certificado" onChange={changePostCurso} value={postCurso.fCertificado} name="fCertificado" variant="outlined" />
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>

            <Card >
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Valoraciones
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField id="outlined-basic" fullWidth label="Valoracion"  onChange={changePostCurso} value={postCurso.fValoracion} name="fValoracion" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField id="outlined-basic" fullWidth label="Porcentaje #1"  onChange={changePostCurso} value={postCurso.fValoracion1} name="fValoracion1" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField id="outlined-basic" fullWidth label="Porcentaje #1"  onChange={changePostCurso} value={postCurso.fValoracion2} name="fValoracion2" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField id="outlined-basic" fullWidth label="Porcentaje #1"  onChange={changePostCurso} value={postCurso.fValoracion3} name="fValoracion3" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField id="outlined-basic" fullWidth label="Porcentaje #1"  onChange={changePostCurso} value={postCurso.fValoracion4} name="fValoracion4" variant="outlined" />
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Card>
              <CardContent>
                <Button variant="contained" onClick={registrarCurso}>
                    crear curso
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Modal
          open={openModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box maxWidth={700} sx={style}>
            <Card sx={{ mb: 3 }}>

              <CardContent>
                {actionModal ?
                  <AgregarClase 
                    enviarClase={()=>enviarClase(openModuloId)} 
                    title={clase.pcurso_temario_ltitulo} 
                    duracion={clase.pcurso_temario_lduracion} 
                    video={clase.pcurso_temario_lvideo} 
                    action={actionModal} 
                    claseChange={claseChange} 
                  />
                :
                  <AgregarClase 
                    enviarClase={()=>actualizarClase(openModuloId,clase)} 
                    title={clase.pcurso_temario_ltitulo} 
                    duracion={clase.pcurso_temario_lduracion} 
                    video={clase.pcurso_temario_lvideo} 
                    action={actionModal} 
                    claseChange={claseChange} 
                  />
                }
              </CardContent>

            </Card>
          </Box>
        </Modal>

        <Modal
          open={openModuleModal}
          onClose={handleModuleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box maxWidth={700} sx={style}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                {actionModuleModal ?
                  <AgregarModulo 
                    value={tituloModulo}
                    cambioField={fieldModulo} 
                    action={false} 
                    enviarModulo={agregarTituloModulo} 
                  />
                :
                  <AgregarModulo 
                    value={tituloModulo}
                    cambioField={fieldModulo} 
                    action={false} 
                    enviarModulo={()=>actualizarTituloModulo(openModuloId)} 
                  />
                }
              </CardContent>
            </Card>
          </Box>
        </Modal>
      </Container>
    </>
  );
}
