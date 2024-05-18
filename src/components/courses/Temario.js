import { useEffect, useState,useContext } from 'react';
import PropTypes from 'prop-types';
import { faker } from '@faker-js/faker';
import { useParams } from "react-router-dom";

// @mui
import { 
    Card,
    CardContent ,
    Grid,
    Typography, 
    TextField, 
    Box,
    Stack, 
    Modal,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    IconButton
 } from '@mui/material';

// Iconos
import Iconify from '../../components/iconify';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ClassIcon from '@mui/icons-material/Class';
import AddIcon from '@mui/icons-material/Add';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

 // Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";


function AgregarModulo(props) {
    const { value, cambioField, enviarModulo,action, getDuration, ...other } = props;
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
    const { enviarClase, title,duracion,video,claseChange,action,getDuration, ...other } = props;
    return (
        <>
        <Grid container spacing={3} >
            <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h4" sx={{ mb: 0 }}>
                {action ? 'Agregar clase': 'Editar clase'}
            </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
            <TextField id="outlined-basic" fullWidth label="Titulo" name="pcurso_temario_ltitulo" value={title} onChange={claseChange} variant="outlined" />
            </Grid>

            <Grid item xs={12} sm={12} md={7}>
            <TextField id="outlined-basic" fullWidth label="Video" name="pcurso_temario_lvideo" value={video} onChange={claseChange} variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
            <TextField id="outlined-basic" fullWidth label="Duracion" name="pcurso_temario_lduracion" value={duracion} onChange={claseChange} variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={12} md={2}>
              <Button variant="outlined" onClick={getDuration}  sx={{height:53}} startIcon={<ArrowBackIcon />}>
                Get
              </Button>
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


CourseTemario.propTypes = {
    updateState:PropTypes.func
};


function CourseTemario({updateState,...other}) {

  const { jwt  } = useContext(UserContext);
  const { id } = useParams();
  const [temario,setTemario] = useState([]);
  const [tituloModulo,setTituloModulo] = useState();
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

  // Enviar data
  const baseUrl  = 'https://api.lessin.pe/wp-json/wp/v2/cursos';

  const registrarCurso = () =>{
    updateState(true);

    axios.put(baseUrl+'/'+id,
      {
        acf:{
          pcurso_temario:temario,
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
      }
    ).then((resp)=>{
      if(resp.data.acf.pcurso_temario.length> 0){
        const listaTmp = [];
        
        resp.data.acf.pcurso_temario.map((item)=>{
          const listaTmpSub = [];
          listaTmp.push(
            {
              id:faker.datatype.uuid(),
              pcurso_temario_titulo:item.pcurso_temario_titulo,
              pcurso_temario_lista:listaTmpSub
            }
          )
          if(item.pcurso_temario_lista.length>0){
            item.pcurso_temario_lista.map((subItem)=>{
              listaTmpSub.push({
                id:faker.datatype.uuid(),
                pcurso_temario_ltitulo:subItem.pcurso_temario_ltitulo,
                pcurso_temario_lvideo:subItem.pcurso_temario_lvideo,
                pcurso_temario_lduracion:subItem.pcurso_temario_lduracion
              })
            })
          }
        })
        //console.log(listaTmp)
        setTemario(listaTmp);
      }
      updateState(false)

    })
  }


  // Get seconds bunny
  const getBunySeconds = (videoId) =>{
    if(videoId !== ''){
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          AccessKey: '4d526f4c-b54e-4f35-b5790c2e13e9-d531-4a14'
        }
      };
      
      fetch('https://video.bunnycdn.com/library/173572/videos/'+videoId, options)
        .then(response => response.json())
        .then((response) => {
          clase.pcurso_temario_lduracion
          setClase({
            ...clase,
            pcurso_temario_lduracion:String(response.length)
          })
        })
        .catch(err => console.error(err));
    }else{
      setClase({
        ...clase,
        pcurso_temario_lduracion:String(0)
      })
    }

  }

  useEffect(()=>{
    getCourse();
  },[])

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" gutterBottom >
            Lista
        </Typography>
        <Button 
            variant="contained" 
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleModuleOpen}
        >
        Agregar
        </Button>
      </Stack>
      {temario.length > 0 ?
        <Stack spacing={0}  sx={{ mb: 4 }}>
          {temario.length > 0 &&
            temario.map((item,index) =>{
              return (
                <>
                  {index !==0 && <Divider sx={{mb:2,mt:2}} />}
                  <ListItem disablePadding key={item.id}  >
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
                          <ListItem disablePadding sx={{ pl: 6 }}>
                            <ListItemText secondary={itemSub.pcurso_temario_ltitulo} />

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
      :
        <Alert severity="warning">Aun no tenemos preguntas frecuentes</Alert>
      }
      <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{mt:2}}
          onClick={registrarCurso}
      >
          Actualizar datos
      </Button>


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
                    getDuration={()=>getBunySeconds(clase.pcurso_temario_lvideo)}
                />
                :
                <AgregarClase 
                    enviarClase={()=>actualizarClase(openModuloId,clase)} 
                    title={clase.pcurso_temario_ltitulo} 
                    duracion={clase.pcurso_temario_lduracion} 
                    video={clase.pcurso_temario_lvideo} 
                    action={actionModal} 
                    claseChange={claseChange} 
                    getDuration={()=>getBunySeconds(clase.pcurso_temario_lvideo)}
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
    </Box>
  );

}

export default CourseTemario;
