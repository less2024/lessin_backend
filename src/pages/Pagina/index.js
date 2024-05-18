import { Helmet } from 'react-helmet-async';
import { useState,useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { faker } from '@faker-js/faker';

// @mui
import {
  Card,
  CardContent ,
  Grid,
  Container,
  Typography, 
  Stack, 
  Button,
  Tabs,
  Tab,
  Box,
  LinearProgress,
  Paper
} from '@mui/material';

// Iconos

// Components
import ImageUpload from 'src/components/upload/image';
import MenuGeneral from 'src/components/paginaweb/MenuGeneral';
import FooterCategori from 'src/components/paginaweb/FooterCategories';
import FooterLegal from 'src/components/paginaweb/FooterLegales';
import FooterSocial from 'src/components/paginaweb/FooterSocial';
import HomePage from 'src/components/paginaweb/home/index.';


// Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <div>{children}</div>
          </Box>
        )}
      </div>
    );
  }
  
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  

export default function PaginaWeb() {

    const { jwt  } = useContext(UserContext);
    const [value, setValue] = useState(0);
    const [logoState,setLogoState] = useState();
    const [loading,setLoading] = useState(false);
    const [menuData,setMenuData] = useState();
    const [catData,setCatData] = useState();
    const [legalData,setLegalData] = useState();
    const [socialData,setSocialData] = useState();

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };


    const getConfig = () =>{
      setLoading(true);
      axios.get('https://api.lessin.pe/wp-json/wp/v2/pages/228')
        .then((resp)=>{ 
          setLoading(false);
          setLogoState({
            image:resp.data.acf.header_logo
          })
          
          if(resp.data.acf.menu_general.length> 0){
            const listaTmp = [];
            
            resp.data.acf.menu_general.map((item)=>{
              const listaTmpSub = [];
              listaTmp.push(
                {
                  id:faker.datatype.uuid(),
                  menu_general_slug:item.menu_general_slug,
                  menu_general_titulo:item.menu_general_titulo,
                  menu_list:listaTmpSub
                }
              )
              if(item.menu_list.length>0){
                item.menu_list.map((subItem)=>{
                  const listaTmpSub2= [];
                  listaTmpSub.push({
                    id:faker.datatype.uuid(),
                    menu_cat:subItem.menu_cat,
                    menu_catico:subItem.menu_catico,
                    menu_sublista:listaTmpSub2
                  })

                  if(subItem.menu_sublista.length>0){
                    subItem.menu_sublista.map((subItem2)=>{
                      listaTmpSub2.push({
                        id:faker.datatype.uuid(),
                        menu_slslug:subItem2.menu_slslug,
                        menu_sltitulo:subItem2.menu_sltitulo,
                      })
                    })
                  }

                })
              }
            })
            setMenuData(listaTmp)
          }
          

          setCatData(resp.data.acf.footer_categorias_lista);
          setLegalData(resp.data.acf.footer_legales_lista);
          setSocialData(resp.data.acf.footer_sociales_lista);
          
        }).catch((error)=>{
          console.log(error)
        })
    }
    
    const updateHeader = () =>{
      setLoading(true)
      axios.put('https://api.lessin.pe/wp-json/wp/v2/pages/228',{
        acf: {
          header_logo: logoState.image,
          menu_general: menuData,
        }
      },{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          }
      }).then((resp)=>{
        setLoading(false)
      })
    }

    const updateFooter = () =>{
      setLoading(true)
      axios.put('https://api.lessin.pe/wp-json/wp/v2/pages/228',{
        acf: {
          footer_categorias_lista: catData,
          footer_legales_lista: legalData,
          footer_sociales_lista: socialData
        }
      },{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          }
      }).then((resp)=>{
        setLoading(false)
      })
    }

    useEffect(()=>{
      getConfig();
      
    },[])

  return (
    <>
      <Helmet>
        <title> Página | Lessin </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }} onClick={()=>console.log(demoState)} >
            Página Web
        </Typography>

        <Grid item xs={12} sm={12} md={12}>
            <Card sx={{ mb: 3 }}>
                {loading &&
                  <LinearProgress />
                }
                <CardContent className={loading && 'disabledBlock'}>
                    <Grid container spacing={3}>
                        <Box sx={{ width: '100%' }}>
                          <Box variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                              <Tab label="Header" {...a11yProps(0)} />
                              <Tab label="Footer" {...a11yProps(1)} />
                              <Tab label="Inicio" {...a11yProps(2)} />
                            </Tabs>
                          </Box>
                          <CustomTabPanel value={value} index={0}>
                            <Stack spacing={3}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} md={2}>
                                  <ImageUpload updateState={setLogoState} imageData={logoState} dark={true} height={'200px'} />
                                </Grid>
                                <Grid item xs={12} sm={12}  md={5} >
                                  <MenuGeneral updateState={setMenuData} dataState={menuData} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                  <Button variant='contained' onClick={updateHeader} fullWidth>
                                    Actualizar header
                                  </Button>
                                </Grid>
                              </Grid>
                            </Stack>
                          </CustomTabPanel>
                          <CustomTabPanel value={value} index={1}>
                              
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={4}>
                                  <FooterCategori updateState={setCatData} dataState={catData}/>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4}>
                                  <FooterLegal updateState={setLegalData} dataState={legalData}/>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4}>
                                  <FooterSocial updateState={setSocialData} dataState={socialData}/>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <Button variant='contained' onClick={updateFooter}>
                                        Actualizar footer
                                    </Button>
                                </Grid>
                              </Grid>
                          </CustomTabPanel>
                          <CustomTabPanel value={value} index={2}>
                            <HomePage/>
                          </CustomTabPanel>
                        </Box>
                    </Grid>
                
                </CardContent>
            </Card>
        </Grid>

      </Container>
    </>
  );
}
