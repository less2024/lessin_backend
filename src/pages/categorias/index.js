import { Helmet } from 'react-helmet-async';
import { useEffect, useState,useContext  } from 'react';
import { faker } from '@faker-js/faker';

// @mui
import {
  Card,
  CardContent ,
  Grid,
  Container,
  Typography, 
  LinearProgress,
  Paper,
  Stack, 
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';

// Iconos
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Components
import ImageUpload from 'src/components/upload/image';

// Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";

export default function Categorias() {

    const { jwt  } = useContext(UserContext);
    const [categories,setCategories] = useState([]);
    const [loadModule,setLoadingModule] = useState(false);
    const [idSelectCat,setIdSelctCat] = useState();
    const [icoCategory,setIcoCategory] = useState();
    const [disabledForm,setDisabledForm] = useState(true);
    const [disabledUpdateForm,setDisabledUpdateForm] = useState(true);
    const [formField,setFormField] = useState({
        cname:''
    });

    const baseUrlCategoria = 'https://api.lessin.pe/wp-json/wp/v2/categoria';
    const getCategorias = () =>{
        setLoadingModule(true)
        axios.get(baseUrlCategoria).then((resp)=>{
            setCategories(resp.data)
            setLoadingModule(false)
        }).catch((error)=>{
            console.log(error)
        })
    }

    const changeForm = (e) =>{
        setFormField({
            ...formField,
            [e.target.name]:e.target.value
        })
        if(e.target.value === ''){
            setDisabledForm(true)
        }else{
            setDisabledForm(false)
        }
    }
    
    const urlBase = baseUrlCategoria;
    const createCategory = () =>{
        setLoadingModule(true)
        if(idSelectCat){
            axios.put(urlBase+'/'+idSelectCat,
            {
                name:formField.cname,
                content:"",
                acf:{
                    catcur_icono:icoCategory ? icoCategory.image : ''
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                
                }
            }).then((data)=>{
                setIcoCategory(null);
                setFormField({
                    cname:''
                });
                getCategorias();
                setLoadingModule(false);
                setIdSelctCat();
                setDisabledForm(true);
                setDisabledUpdateForm(true);
            }).catch((error) => {
                console.log('error',error);
            });
    
        }else{
            axios.post(urlBase,
                {
                    name:formField.cname,
                    content:"",
                    acf:{
                        catcur_icono:icoCategory ? icoCategory.image : ''
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwt}`    
                    }
                }
            ).then((resp)=>{
                setIcoCategory(null);
                setFormField({
                    cname:''
                });
                getCategorias();
                setLoadingModule(false)
            }).catch((error)=>{
                console.log(error)
            })
        }

    }

    const removeCategory = (item) =>{
        setLoadingModule(true);

        axios.delete(urlBase+'/'+item.id+'/?force=true',{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`    
            }
        }
        ).then((data)=>{
            getCategorias();
            setLoadingModule(false);
            setIcoCategory(null);
            setDisabledForm(true);
            setDisabledUpdateForm(true);
            setFormField({
                cname:''
            });
        }).catch((error) => {
            console.log('error',error)
        });
    }


    
    const editCategory = (item) =>{
        setDisabledUpdateForm(false);
        setIdSelctCat(item.id);
        setFormField({
            ...formField,
            cname:item.name
        });
        setIcoCategory({
            image:item.acf.catcur_icono
        })
    }

    const cancelUpdate = () =>{
        
        setDisabledForm(true);
        setIdSelctCat();
        setDisabledUpdateForm(true);
        setFormField({
            cname:''
        });
        getCategorias();
        setLoadingModule(false)
        setIcoCategory(null);
    }



    useEffect(()=>{
        getCategorias();
    },[]);



    return (
        <>
        <Helmet>
            <title> Categorías | Lessin </title>
        </Helmet>

        <Container maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 5 }} >
                Categorías
            </Typography>

            <Grid item xs={12} sm={12} md={12}>
                
                <Card sx={{ mb: 3 }}>
                    {loadModule &&
                        <LinearProgress />
                    }
                    <CardContent className={loadModule && 'disabledBlock'}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={7}>
                                <Paper variant={'outlined'} sx={{p:2}}>
                                    <Stack spacing={2} className=''>
                                        <Typography variant="h4" >
                                            Agregar categoría
                                        </Typography>

                                        <ImageUpload updateState={setIcoCategory} recomend="Tamño recomendado 100x100" imageData={icoCategory} />

                                        <TextField 
                                            id="outlined-basic" 
                                            label="Nombre" 
                                            variant="outlined"
                                            name="cname"
                                            onChange={changeForm}
                                            value={formField.cname}
                                        />
                                        {disabledUpdateForm ?
                                            <Button
                                                variant='contained'
                                                onClick={createCategory}
                                                disabled={disabledForm ? true : false}
                                            >
                                                Agregar
                                            </Button>
                                        :
                                        <>
                                            <Button
                                                variant='contained'
                                                onClick={createCategory}
                                            >
                                                Actualizar
                                            </Button>
                                            <Button
                                                variant='outlined'
                                                onClick={cancelUpdate}
                                            >
                                                Cancelar
                                            </Button>
                                        </>
                                        }

                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={12} md={5}>
                                <Paper variant={'outlined'} sx={{p:2}}>
                                    <Stack spacing={2}>
                                        <Typography variant="h4" >
                                            Categorías
                                        </Typography>
                                        {categories.length > 0 &&
                                            <List>
                                                {categories.map((item)=> 
                                                    <ListItem key={item.id+faker.datatype.uuid()} sx={{borderTop:'1px solid rgba(0,0,0,.08)'}}>
                                                        <Stack sx={{mr:2}}>
                                                        <img src={item.acf.catcur_icono} alt={item.name} width={'20px'} height={'20px'} />
                                                        </Stack>
                                                        <ListItemText
                                                            primary={item.name}
                                                        />
                                                        <IconButton onClick={()=>editCategory(item)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton onClick={()=>removeCategory(item)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItem>
                                                )}
                                            </List>
                                        }
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Grid item xs={12} sm={12} md={12}>

                </Grid>
            </Grid>

        </Container>
        </>
    );
}
