import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Card, CardContent } from '@mui/material';


import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CancelIcon from '@mui/icons-material/Cancel';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

// ----------------------------------------------------------------------

AppNoGraphics.propTypes = {
  title: PropTypes.string,
  porcent: PropTypes.string,
  total: PropTypes.string,
  icon: PropTypes.string
};

export default function AppNoGraphics({ title, porcent, total,icon, ...other }) {

  return (
    <Card {...other}>
      <CardContent>
        <div className="percentBlock">
          <div className="icon">
            {icon === '1' &&
              <PlayCircleOutlineIcon className='init' />
            }
            {icon === '2' &&
              <AssignmentTurnedInIcon className='complete' />
            }
            {icon === '3' &&
              <CancelIcon  className='icomplete' />
            }
            {icon === '4' &&
              <WorkspacePremiumIcon  className='cert' />
            }
          </div>
          <div className="txt">
            <h5>{title}</h5>
            {icon === '1' ?
              <>
                <h2>{'Total:' +total}</h2>
              </>            
            :
              <>
                <h2>{porcent+"%"}</h2>
                <h3>{'Total: '+total}</h3>
              </>
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
