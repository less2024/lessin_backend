import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
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
import CourseCreate from 'src/components/courses/Create';
import MentoringEdith from 'src/components/mentoring/Description';
import MentoringImg from 'src/components/mentoring/Imagenes';

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

export default function EditMentoring() {

  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [loading,setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title> Editar mentoria | Lessin </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }} >
          Editar mentoria
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
                    </Tabs>
                  </Box>
                
                  <CustomTabPanel value={value} index={0}>
                    <MentoringEdith updateState={setLoading} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <MentoringImg updateState={setLoading} />
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
