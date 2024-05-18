import { useEffect, useState,useContext } from 'react';
import PropTypes from 'prop-types';

// @mui
import { 
    Button,
    Paper,
    Stack,
    TextField,
    Grid
 } from '@mui/material';


// Componentes
import ImageUpload from 'src/components/upload/image';

// Iconos

// Axios
import axios from 'axios';
import UserContext from '../../../../context/AuthContext';


SecIntroHome.propTypes = {
    updateState:PropTypes.func
};

function SecIntroHome({updateState, ...other}) {

    const { jwt  } = useContext(UserContext);
    const [introImg,setIntroImg] = useState();
    const [detImg,setDetImg] = useState();
    const [detImg2,setDetImg2] = useState();
    const [detImg3,setDetImg3] = useState();
    const [formFields,setFormFields] = useState({
        ititulo:'',
        itexto:'',
        ivideo:''
    });

    const urlPage = 'https://api.lessin.pe/wp-json/wp/v2/pages/251';

    const changeField = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]:e.target.value
        })
    }

    const updateSection = () =>{
        updateState(true)
        axios.put(urlPage,{
          acf: {
            intro_titulo: formFields.ititulo,
            intro_txt: formFields.itexto,
            video_intro: formFields.ivideo,
            intro_img: introImg.image,
            intro_detalle1: detImg.image,
            intro_detalle2: detImg2.image,
            intro_detalle3: detImg3.image,
            
          }
        },{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`
            }
        }).then((resp)=>{
          updateState(false)
        })
    }

    const getInfo = () =>{
        updateState(true)
        axios.get(urlPage)
            .then((resp)=>{
                setIntroImg({
                    image:resp.data.acf.intro_img
                })
                setDetImg({
                    image:resp.data.acf.intro_detalle1
                })
                setDetImg2({
                    image:resp.data.acf.intro_detalle2
                })
                setDetImg3({
                    image:resp.data.acf.intro_detalle3
                })
                setFormFields({
                    ititulo:resp.data.acf.intro_titulo,
                    itexto:resp.data.acf.intro_txt,
                    ivideo:resp.data.acf.video_intro
                })
                updateState(false)
            })
    }

    useEffect(()=>{
        getInfo();
    },[])

    return (
        <Paper >
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}  md={6}>
                    <Stack spacing={2}>
                        <TextField id="ititulo-asdad" label="Titulo" fullWidth name="ititulo" onChange={changeField} value={formFields.ititulo} />
                        <TextField id="itexto-asdad6" label="Texto"  multiline rows={3} fullWidth name="itexto" onChange={changeField} value={formFields.itexto} />
                        <TextField id="ivideo-asdad" label="Id video" fullWidth name="ivideo" onChange={changeField} value={formFields.ivideo} />
                    </Stack>
                    <Grid container spacing={2} sx={{mt:1}}>
                        <Grid item xs={12} sm={12}  md={4} >
                            <ImageUpload updateState={ setDetImg} imageData={detImg} dark={true} recomend={'Tamaño recomendado: 100x100'} height={'130px'} />
                        </Grid>
                        <Grid item xs={12} sm={12}  md={4} >
                            <ImageUpload updateState={setDetImg2} imageData={detImg2} dark={true} recomend={'Tamaño recomendado: 100x100'} height={'130px'} />
                        </Grid>
                        <Grid item xs={12} sm={12}  md={4} >
                            <ImageUpload updateState={setDetImg3} imageData={detImg3} dark={true} recomend={'Tamaño recomendado: 100x100'} height={'130px'} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <ImageUpload updateState={setIntroImg} imageData={introImg} dark={false} textButton={'Imagen'} recomend={'Tamaño recomendado: 585x330'} height={'400px'} />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <Button variant='contained' onClick={updateSection} fullWidth>Actualizar</Button>
                </Grid>

            </Grid>
        </Paper>
    );

}

export default SecIntroHome;