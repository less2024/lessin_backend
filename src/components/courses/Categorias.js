import { useEffect, useState,useContext } from 'react';
import PropTypes from 'prop-types';
import { faker } from '@faker-js/faker';
import { useParams } from "react-router-dom";

// @mui
import { 
    Box,
    Stack,
    Button,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox
 } from '@mui/material';


 // Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";

import AddIcon from '@mui/icons-material/Add';

CourseCategories.propTypes = {
  updateState:PropTypes.func
};

function CourseCategories({updateState,...other}) {

  const { jwt  } = useContext(UserContext);
  const { id } = useParams();

  // Mostrar categorias
  const urlCategorias  = 'https://api.lessin.pe/wp-json/wp/v2/categoria';
  const [categoriasList,setCategoriasList] = useState();
  const getCategorias =  () =>{
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

  // Enviar data
  const baseUrl  = 'https://api.lessin.pe/wp-json/wp/v2/cursos';

  const registrarCurso = () =>{
    updateState(true);
    axios.put(baseUrl+'/'+id,
      {
          categoria:categoriaCheck,
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
      setCategoriaCheck(resp.data.categoria);
      updateState(false)
    })
  }

  useEffect(()=>{
    getCourse();
    getCategorias();
      
  },[])

    return (
        <Box>
            <Stack spacing={2}>
                <Typography variant="h6" sx={{ mb: 0 }}  onClick={()=> console.log(categoriaCheck)}>
                    Categorias
                </Typography>
                {categoriasList &&
                    <FormGroup onChange={changeCategria}>
                        {categoriasList.map((item,index) => {
                            const labelId = `checkbox-list-label-${item.id}`;
                            var itemValTemp = null;
                                if(categoriaCheck.length > 0 ){
                                categoriaCheck.map((item2)=>{
                                    if(parseInt(item.id) === parseInt(item2)){
                                    itemValTemp = item2;
                                    }
                                })

                                if(parseInt(item.id) === parseInt(itemValTemp)){
                                    return (<FormControlLabel value={item.id} key={faker.datatype.uuid()} control={<Checkbox defaultChecked />}   label={item.name} />);
                                }else{
                                    return (<FormControlLabel value={item.id}  control={<Checkbox />}   label={item.name} />);
                                }
                            }else{
                                return (<FormControlLabel value={item.id}  control={<Checkbox />}   label={item.name} />);
                            } 
                        })}
                    </FormGroup>
                }
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

export default CourseCategories;
