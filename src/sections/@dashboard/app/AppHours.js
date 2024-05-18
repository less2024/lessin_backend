import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Card, CardContent } from '@mui/material';


import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

AppHours.propTypes = {
  title: PropTypes.string,
  duracion: PropTypes.number,
};

export default function AppHours({ title, duracion,...other }) {

  const [formatTime,setFormatTime] = useState();

  const converterTimeFormtat = (sec)=>{
    const date = new Date(null);
    date.setSeconds(sec);
    setFormatTime(date.toISOString().substr(11, 8));
  }

  useEffect(()=>{
    converterTimeFormtat(duracion);
  },[])

  return (
    <Card {...other}>
      <CardContent>
        <div className="hoursBlock">
          <div className="icon">
            <QueryBuilderIcon />
          </div>
          <div className="txt">
            <h3>{title}</h3>
            <h2>{formatTime}</h2>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
