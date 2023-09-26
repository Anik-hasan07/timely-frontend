import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Lists from './lists';
import './style.scss';
import ImgOne from '../../assets/images/instructionPage/1.png';
import ImgTwo from '../../assets/images/instructionPage/2.png';
import ImgThree from '../../assets/images/instructionPage/3.png';
import ImgFour from '../../assets/images/instructionPage/4.png';

const index = () => {
  return (
    <div className="container">
      <div className="content-section">
        <Typography
          py={3}
          variant="h2"
          sx={{
            fontSize: 54,
            my: 2,
            fontWeight: 745,
            letterSpacing: -1,
            maxWidth: 991,
          }}
          gutterBottom
        >
          Run your <span className="highlight">client work</span> in the only platform that’s
          actually built for it.
        </Typography>

        <div className="lists">
          <Lists />
        </div>
        <Box className="button_wrapper" textAlign="center">
          <Button variant="contained">Add to teams</Button>
        </Box>
      </div>

      <div className="image_section">
        <div className="hero_image_wrapper relative">
          <div className="hero_large_image">
            <img src={ImgOne} alt="" />
          </div>

          <div className="hero_small_images">
            <div className="icon_email hero_icon_container">
              <img src={ImgFour} alt="" />
            </div>

            <div className="icon_help_desk hero_icon_container">
              <img src={ImgTwo} alt="" />
            </div>

            <div className="icon_crm hero_icon_container">
              <img src={ImgThree} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
