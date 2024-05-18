import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

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
import CourseDescription from 'src/components/courses/Description';
import CourseAprenderas from 'src/components/courses/Aprenderas';
import CourseTemario from 'src/components/courses/Temario';
import CourseImg from 'src/components/courses/Imagenes';
import CourseDocentes from 'src/components/courses/Docentes';
import CoursePreguntas from 'src/components/courses/PreguntasFrecuentes';
import CourseCategories from 'src/components/courses/Categorias';
import CourseInfo from 'src/components/courses/Informacion';
import CourseValoraciones from 'src/components/courses/Valoraciones';

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

export default function EditCourse() {

  const [value, setValue] = useState(0);
  const [loading,setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(()=>{
  },[])

  return (
    <>
      <Helmet>
        <title> Editar curso | Lessin </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }} >
          Editar curso
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
                      <Tab label="Aprenderas" {...a11yProps(1)} />
                      <Tab label="Temario" {...a11yProps(2)} />
                      <Tab label="Imagenes/Trailer" {...a11yProps(3)} />
                      <Tab label="Docentes" {...a11yProps(4)} />
                      <Tab label="Preguntas F." {...a11yProps(5)} />
                      <Tab label="Categorías" {...a11yProps(6)} />
                      <Tab label="Información" {...a11yProps(7)} />
                      <Tab label="Valoraciones" {...a11yProps(8)} />
                    </Tabs>
                  </Box>
                
                  <CustomTabPanel value={value} index={0}>
                    <CourseDescription updateState={setLoading} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <CourseAprenderas updateState={setLoading} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    <CourseTemario  updateState={setLoading} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={3}>
                    <CourseImg updateState={setLoading} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={4}>
                    <CourseDocentes  updateState={setLoading} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={5}>
                    <CoursePreguntas  updateState={setLoading} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={6}>
                    <CourseCategories  updateState={setLoading} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={7}>
                    <CourseInfo  updateState={setLoading} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={8}>
                    <CourseValoraciones  updateState={setLoading} />
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
