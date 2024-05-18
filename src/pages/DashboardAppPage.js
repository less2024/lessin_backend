import { Helmet } from 'react-helmet-async';
import { DateRange  } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import es from 'date-fns/locale/es';

// @mui
import { useTheme } from '@mui/material/styles';
import { 
  Grid, 
  Container, 
  Typography, 
  Card, 
  CardHeader, 
  Box, 
  CardContent,
  Button
} from '@mui/material';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// Date range
import { CSVLink } from "react-csv";

// components
import Iconify from '../components/iconify';
import GetAppIcon from '@mui/icons-material/GetApp';
import SearchIcon from '@mui/icons-material/Search';

// sections
import {
  AppWidgetSummary,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { useEffect, useState,useContext } from 'react';
import axios from 'axios';

import UserContext from "../context/AuthContext";

import AppCurrentVisitsPlatform3 from 'src/sections/@dashboard/app/AppCurrentVisitsPlatform3';
import AppCurrentVisitsPlatform4 from 'src/sections/@dashboard/app/AppCurrentVisitsPlatform4';

import userIco from '../assets/image/ico_user.png';
import icoIncomplete from '../assets/image/ico_incomplete.png';
import icoPlay from '../assets/image/ico_play.png';
import icoCheck from '../assets/image/ico_check.png';
import icoTimer from '../assets/image/ico_timer.png';
import icoCert from '../assets/image/ico_cert.png';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const { idCli,idCli2,jwt  } = useContext(UserContext);

  const [userList,setUserList] = useState(null);
  const [clientsList,setClientsList] = useState(null);
  const [clientSelect,setClientSelect] = useState(0);
  const [clientVisit,setClientVisit] = useState(null);
  const [rangeSelect,setRangeSelect] = useState({
    ini:'2022/01/01',
    end:'2030/12/31'
  });
  const [rangeOptionsFre, setRangeOptionsFre] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ]);
  const [showRange,setShowRange] = useState(false);
  const handleShowRange = () => setShowRange(true)

  const [activeUser,setActiveUser] = useState(0);

  const [timeStudi,setTimeStudi] = useState(0);
  const [coursesCompletes,setCoursesCompletes] = useState();
  const [coursesInCompletes,setCoursesInCompletes] = useState();
  const [coursesTotal,setCoursesTotal] = useState();
  const [rankinCourseLists,setRankingCoursesList] = useState([]);
  const [dataCsv,setDataCsv] = useState(null);



  const [promProgress,setPromProgress] = useState(0);

  const handleChangeSelect = (e) =>{
    setClientSelect(e.target.value)
  }


  const getAllClient = () =>{
    axios.get('https://api.lessin.pe/wp-json/wp/v2/clientes')
    .then((resp)=>{
      setClientsList(resp.data)
    })
  }

  const getAllUser = (client) =>{
    if( client === 0 ){
      axios.post('https://api.lessin.pe/wp-json/usuarios/v1/clienteDash')
      .then((resp)=>{
        setUserList(resp.data[0]);
      }).then((errr)=>{
        console.log(errr)
      })
    }else{
      axios.post('https://api.lessin.pe/wp-json/usuarios/v1/clienteDash',{
        forcompany:client
      })
      .then((resp)=>{
        setUserList(resp.data[0])
      }).then((errr)=>{
        console.log(errr)
      })
    }
  }

  const getAllVisit = (client,ini,end)=>{
    if( client === 0 ){
      axios.post('https://api.lessin.pe/wp-json/usuarios/v1/clienteDashVisit',{
        forcompany_ini:ini,
        forcompany_end:end
      })
      .then((resp)=>{
        setClientVisit(resp.data)
      }).then((errr)=>{
        console.log(errr)
      })
    }else{
      axios.post('https://api.lessin.pe/wp-json/usuarios/v1/clienteDashVisit',{
        forcompany:client,
        forcompany_ini:ini,
        forcompany_end:end
      })
      .then((resp)=>{
        setClientVisit(resp.data)
      }).then((errr)=>{
        console.log(errr)
      })
    }
  }

  const getActiveUser = (company,ini,end)=>{

    var timeXCourse = 0;
    var promediProgess = 0;
    let courseIncomplets = 0;
    let coursesTotalTmp = 0;


    if(company === 0){
      axios.post('https://api.lessin.pe/wp-json/usuarios/v1/courseVideoDashboard',{
        forcompany_ini:ini,
        forcompany_end:end
      }).then((resp)=>{


        const ids = resp.data.map(({ user_id }) => user_id);
        const filtered = resp.data.filter(({ user_id }, index) => !ids.includes(user_id, index + 1));

        const ids2 = resp.data.map(({ id }) => id);
        const filtered2 = resp.data.filter(({ id }, index) => !ids2.includes(id, index + 1));

        let rankingCourses = [];
        let csvTemp = [];
        filtered2.map((filtItem)=>{
          if(filtItem.course_state === "1"){
            courseIncomplets = courseIncomplets + 1;
          }
          coursesTotalTmp = coursesTotalTmp + 1;
          let companyName = "";
          if(clientsList){
            clientsList.map((cliItem)=>{
              
              if(parseInt(filtItem.course_company) === parseInt(cliItem.id)){
                companyName = cliItem.title.rendered;
                console.log(cliItem.id)
              }
            })
          }
          const dateTmp = new Date(filtItem.date_reg);  // 2009-11-10
          const monthTmp = dateTmp.toLocaleString('default', { month: 'long' });

          const timeFormated = new Date(null);
          timeFormated.setSeconds(parseInt(filtItem.course_time));

          csvTemp.push({
            client:companyName,
            mes:monthTmp,
            fecha_inicio_curso:filtItem.date_reg,
            tiempo_por_curso:timeFormated.toISOString().substr(11, 8),
            curso:filtItem.course_name,
            status:filtItem.course_state === "0" ? "EN PROCESO" :"COMPLETADO",
            certificado:filtItem.course_state === "0" ? "NO" :"SI",
            progreso: filtItem.course_progress > 97 ? "100%" : filtItem.course_progress + "%",
            nombre_usuario:filtItem.course_user_name,
            codigo_usuario:filtItem.course_user_login,
            telefono:filtItem.course_user_phone,
            correo:filtItem.course_user_email
          });

          rankingCourses.push(
            { 
              label: filtItem.course_name, 
              value: 1
            }
          )
          
          timeXCourse = timeXCourse+ parseInt(filtItem.course_time);
          promediProgess = promediProgess + filtItem.course_progress / filtered2.length
        })

        const rankinFinalList = rankingCourses.reduce((acc, cur)=> {
          const found = acc.find(val => val.label === cur.label)
          if(found){
              found.value+=Number(cur.value)
          }
          else{
              acc.push({...cur, value: Number(cur.value)})
          }
          return acc
        }, [])


        setTimeStudi(timeXCourse);
        setPromProgress(promediProgess);
        setRankingCoursesList(rankinFinalList);
        setCoursesCompletes(courseIncomplets);
        setCoursesInCompletes(coursesTotalTmp - courseIncomplets)
        setCoursesTotal(coursesTotalTmp);
        setDataCsv(csvTemp);
        setActiveUser(filtered);
      })
    }else{
      axios.post('https://api.lessin.pe/wp-json/usuarios/v1/courseVideoDashboard',{
        forcompany:company,
        forcompany_ini:ini,
        forcompany_end:end
      }).then((resp)=>{


        const ids = resp.data.map(({ user_id }) => user_id);
        const filtered = resp.data.filter(({ user_id }, index) => !ids.includes(user_id, index + 1));

        const ids2 = resp.data.map(({ id }) => id);
        const filtered2 = resp.data.filter(({ id }, index) => !ids2.includes(id, index + 1));

        let rankingCourses = [];
        let csvTemp = [];
        filtered2.map((filtItem)=>{
          if(filtItem.course_state === "1"){
            courseIncomplets = courseIncomplets + 1;
          }
          coursesTotalTmp = coursesTotalTmp + 1;

          let companyName = "";
          if(clientsList){
            clientsList.map((cliItem)=>{
              
              if(parseInt(filtItem.course_company) === parseInt(cliItem.id)){
                companyName = cliItem.title.rendered;
                console.log(cliItem.id)
              }
            })
          }
          const dateTmp = new Date(filtItem.date_reg);  // 2009-11-10
          const monthTmp = dateTmp.toLocaleString('default', { month: 'long' });

          const timeFormated = new Date(null);
          timeFormated.setSeconds(parseInt(filtItem.course_time));

          csvTemp.push({
            client:companyName,
            mes:monthTmp,
            fecha_inicio_curso:filtItem.date_reg,
            tiempo_por_curso:timeFormated.toISOString().substr(11, 8),
            curso:filtItem.course_name,
            status:filtItem.course_state === "0" ? "EN PROCESO" :"COMPLETADO",
            certificado:filtItem.course_state === "0" ? "NO" :"SI",
            progreso: filtItem.course_progress > 97 ? "100%" : filtItem.course_progress + "%",
            nombre_usuario:filtItem.course_user_name,
            codigo_usuario:filtItem.course_user_login,
            telefono:filtItem.course_user_phone,
            correo:filtItem.course_user_email
          });

          rankingCourses.push(
            { 
              label: filtItem.course_name, 
              value: 1
            }
          )
          timeXCourse = timeXCourse+ parseInt(filtItem.course_time);
          promediProgess = promediProgess + filtItem.course_progress / filtered2.length
        })

        const rankinFinalList = rankingCourses.reduce((acc, cur)=> {
          const found = acc.find(val => val.label === cur.label)
          if(found){
              found.value+=Number(cur.value)
          }
          else{
              acc.push({...cur, value: Number(cur.value)})
          }
          return acc
        }, [])
        
        setTimeStudi(timeXCourse);
        setPromProgress(promediProgess);
        setRankingCoursesList(rankinFinalList);
        setCoursesCompletes(courseIncomplets);
        setCoursesTotal(coursesTotalTmp);
        setDataCsv(csvTemp);
        setActiveUser(filtered);
      })
      
    }
  }

  const sendFilter = ()=>{
    getAllVisit(clientSelect,rangeSelect.ini,rangeSelect.end);
    getAllUser(clientSelect);
    getActiveUser(clientSelect,rangeSelect.ini,rangeSelect.end);
  }

  // If client
  const [userCliInfo,setUserCliInfo] = useState({
    uc_id:0,
    nombre:'Lessin'
  });


  useEffect(()=>{
    getAllClient();
    console.log(idCli2);
    if(idCli2 !== '1' ){
      axios.get('https://api.lessin.pe/wp-json/wp/v2/users/' + idCli2,{
        headers:{
          'Authorization': 'Bearer '+ jwt,
        }
      })
      .then((resp)=>{
        setUserCliInfo({
          ...userCliInfo,
          uc_id:resp.data.acf.uc_id,
          nombre:resp.data.acf.nombre
        })
        getAllUser(resp.data.acf.uc_id);
        getAllVisit(resp.data.acf.uc_id,rangeSelect.ini,rangeSelect.end);
        getActiveUser(resp.data.acf.uc_id,rangeSelect.ini,rangeSelect.end);
      })
    }else{
      getAllUser(0);
      getAllVisit(0,rangeSelect.ini,rangeSelect.end);
      getActiveUser(0,rangeSelect.ini,rangeSelect.end);
    }
  },[])

  const converterTimeFormtat = (sec)=>{
    const date = new Date(null);
    date.setSeconds(sec);
    return date.toISOString().substr(11, 8)
  }

  return (
    <>
      <Helmet>
        <title> Dashboard | KPI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola,  {idCli2 !== '1' ? userCliInfo.nombre : 'Lessin'} 
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <Card className='dashFilterBox' >
              <CardHeader title={'Filtrar por:'} />
              <CardContent >
                <Grid container spacing={3}>
                  {idCli2 === '1' &&
                    <Grid item xs={12} sm={6} md={3}>
                      <div className='rangeFieldDash' sx={{ pt: 1 }}>
                        
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Seleccione un cliente</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Cliente"
                            onChange={handleChangeSelect}
                          >
                            {clientsList &&
                            clientsList.map((item)=>{
                              return (
                                <MenuItem  value={item.id}>{item.title.rendered}</MenuItem>
                              )
                            })}
                            <MenuItem  value={0}>{'Todos'}</MenuItem>
                          </Select>
                        </FormControl>
                        
                      </div>
                    </Grid>
                  }
                  <Grid item xs={12} sm={6} md={3}>
                    {showRange ? 
                    <div className="btnSelectDataResult">
                        <DateRange 
                          locale={es}
                          rangeColors={['#F50F57', '#3ecf8e', '#000']}
                          endDatePlaceholder="--"
                          editableDateInputs={true}
                          onChange={item => {
                            let dateInitRange = new Date(item.selection.startDate);
                            const yearRangeFilter = dateInitRange.getFullYear();
                            const montRangeFilter = dateInitRange.getMonth()+1;
                            const dayRangeFilter = dateInitRange.getDate();

                            let dateInitRange2 = new Date(item.selection.endDate);
                            const yearRangeFilter2 = dateInitRange2.getFullYear();
                            const montRangeFilter2 = dateInitRange2.getMonth()+1;
                            const dayRangeFilter2 = dateInitRange2.getDate();
                            setRangeSelect({
                              ini: yearRangeFilter+'/'+montRangeFilter+'/'+dayRangeFilter,
                              end: yearRangeFilter2+'/'+montRangeFilter2+'/'+dayRangeFilter2
                            })
                            setRangeOptionsFre([item.selection]);
                          }}
                          moveRangeOnFirstSelection={false}
                          ranges={rangeOptionsFre}
                        />
                    </div>
                    :
                    <div className="btnSelectData" onClick={handleShowRange}>
                      Seleccione la fecha 
                    </div>
                    }


                  </Grid>
                  <Grid item xs={12} sm={6} md={3} className='dashBoardBtnFilter'>
                    <Button onClick={sendFilter} variant='contained'   startIcon={<SearchIcon />}>
                      Filtrar
                    </Button>
                    {dataCsv &&
                    <CSVLink className="downloadbtn" separator={";"} filename="information.csv" data={dataCsv ? dataCsv : null}>
                      <Button variant='contained'  startIcon={<GetAppIcon />}>
                        Export to CSV
                      </Button>
                    </CSVLink>
                    }
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>

            <div className="allUser">
              <figure>
                <img src={userIco} />
              </figure>
              <h5>Usuarios inscritos</h5>
              <h3>{userList ? parseInt(userList.total) : 0}</h3>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {false &&
              <AppWidgetSummary title="Usuarios visitantes" total={clientVisit ? clientVisit.length : 0} color="info" icon={'ant-design:user'} />
            }
            <div className="allUser allUserVisit">
              <figure>
                <AppCurrentVisitsPlatform3
                  title={"Progreso promedio"}
                  className="progressBlock"
                  chartData={[
                    { 
                      label: 'Progreso promedio',
                      value:  Number((clientVisit ? (clientVisit.length /parseInt(userList.total)) *100 : 0).toFixed(2))
                    }
                  ]}
                  chartColors={[
                    '#173768'
                  ]}
                />
              </figure>
              <h5>Usuarios visitantes</h5>
              <h3>{clientVisit ? clientVisit.length : 0}</h3>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {false &&
            <AppWidgetSummary title="Usuarios estudiando" total={activeUser ? activeUser.length : 0} color="warning" icon={'ant-design:user'} />
            }
            <div className="allUser allUserEstudent">
              <figure>
                <AppCurrentVisitsPlatform3
                  title={"Progreso promedio"}
                  className="progressBlock"
                  chartData={[
                    { 
                      label: 'Progreso promedio',
                      value:  Number((activeUser ? (activeUser.length /parseInt(userList.total)) *100 : 0).toFixed(2))
                    }
                  ]}
                  chartColors={[
                    '#F50F57'
                  ]}
                />
              </figure>
              <h5>Usuarios estudiando</h5>
              <h3>{activeUser ? activeUser.length : 0}</h3>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <div className="allUser allUserProgress">
              <figure>
                <AppCurrentVisitsPlatform3
                  className="progressBlock"
                  chartData={[
                    { 
                      label: 'Progreso promedio',
                      value:  Number(promProgress.toFixed(2))
                      
                    }
                  ]}
                  chartColors={[
                    '#B8CDA7'
                  ]}
                />
              </figure>
              <h4>Progreso promedio</h4>
            </div>

    
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Cursos mas vistos"
              //subheader="(+43%) than last year"
              chartData={rankinCourseLists ? rankinCourseLists : null}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>

            {timeStudi !== 0 &&
              <div className="estadRight estadRightTime">
                <figure>
                  <img src={icoTimer} />
                </figure>
                <div className="txt">
                  <p>Tiempo de estudio</p>
                  <h4>{converterTimeFormtat(timeStudi)}</h4>
                </div>
              </div>
            }
            <div className="estadRight estadRightIni">
              <figure>
                <img src={icoPlay} />
              </figure>
              <div className="txt">
                <p>Cursos iniciados</p>
                <h4>{coursesTotal}</h4>
              </div>
            </div>
            <div className="estadRight estadRightComplete">
              <figure>
                <img src={icoCheck} />
              </figure>
              <div className="txt">
                <p>Completos</p>
                <h4>{coursesCompletes}</h4>
              </div>
              <div className="percent">
                <AppCurrentVisitsPlatform4
                  className="progressBlock"
                  chartData={[
                    { 
                      label: 'Progreso promedio',
                      value:  ((coursesCompletes*100)/coursesTotal).toFixed(1)
                    }
                  ]}
                  chartColors={[
                    '#ffffff'
                  ]}
                />
              </div>
            </div>
            <div className="estadRight estadRightIncomplete">
              <figure>
                <img src={icoIncomplete} />
              </figure>
              <div className="txt">
                <p>Incompletos</p>
                <h4>{coursesInCompletes}</h4>
              </div>
              <div className="percent">
                <AppCurrentVisitsPlatform4
                  className="progressBlock"
                  chartData={[
                    { 
                      label: 'Progreso promedio',
                      value:  ((coursesInCompletes*100)/coursesTotal).toFixed(1)
                    }
                  ]}
                  chartColors={[
                    '#ffffff'
                  ]}
                />
              </div>
            </div>
            <div className="estadRight estadRightCert">
              <figure>
                <img src={icoCert} />
              </figure>
              <div className="txt">
                <p>Certificados</p>
                <h4>{coursesCompletes}</h4>
              </div>
              <div className="percent">
                <AppCurrentVisitsPlatform4
                  className="progressBlock"
                  chartData={[
                    { 
                      label: 'Progreso promedio',
                      value:  ((coursesCompletes*100)/coursesTotal).toFixed(1)
                    }
                  ]}
                  chartColors={[
                    '#ffffff'
                  ]}
                />
              </div>
            </div>
          </Grid>




        </Grid>
      </Container>
    </>
  );
}