import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";

// @mui
import {
  Card,
  Grid,
  LinearProgress,
  Container,
  Typography,
  CardContent,
  Box,
  Tabs,
  Tab
} from '@mui/material';

// Axios
import ClientDescription from 'src/components/clients/Descriptions';
import ClientImages from 'src/components/clients/Imagenes';
import ClientBaner from 'src/components/clients/Baner';
import ClientUsuarios from 'src/components/clients/Usuarios';
import axios from 'axios';

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
          <Typography>{children}</Typography>
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

export default function NewCourse() {

  const [value, setValue] = useState(0);
  const [loading,setLoading] = useState(false);
  const { id } = useParams();



  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  
  // Crear cliente+
  const [clientData,setClientData] = useState();
  const baseUrl  = 'https://api.lessin.pe/wp-json/wp/v2/clientes';
  const getCliente = () =>{
      axios.get(baseUrl+'/'+id).then((resp)=>{
        setClientData(resp.data)
      }).catch((error) => {
          console.log('error',error);
      });
  }

  useEffect(()=>{
    getCliente();
  },[])


  return (
    <>
      <Helmet>
        <title> Editar cliente | Lessin </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }} >
          Cliente: {clientData ? clientData.title.rendered:'Editar cliente'}
        </Typography>

        <Grid  item xs={12} sm={12} md={12}>
          <Card sx={{ mb: 2 }} >
            {loading && <LinearProgress /> }
            <CardContent className={loading && 'disabledBlock'}>
              <Grid container spacing={3}>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="basic tabs example">
                      <Tab label="Descripción" {...a11yProps(0)} />
                      <Tab label="Imagenes" {...a11yProps(1)} />
                      <Tab label="Baners" {...a11yProps(2)} />
                      <Tab label="Usuarios" {...a11yProps(2)} />
                    </Tabs>
                  </Box>
                
                  <CustomTabPanel value={value} index={0}>
                    <ClientDescription updateState={setLoading} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <ClientImages updateState={setLoading} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    <ClientBaner updateState={setLoading} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={3}>
                    <ClientUsuarios updateState={setLoading} />
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
