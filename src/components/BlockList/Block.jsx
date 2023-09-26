import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Link as LinkComponent,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { stringAvatar } from '../../utils';

const blockStyle = (isSmall) => {
  return {
    display: 'flex',
    gap: '10px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: isSmall ? 0 : '10px 0',
    padding: isSmall ? 0 : '10px 5px',
    borderRadius: '5px',
    ':hover': {
      background: !isSmall && '#EEEEEE',
      cursor: 'pointer',
    },
  };
};

export default function Block({ taskData, type, isSmall = false }) {
  const { taskName, taskNumber } = taskData;
  const reporterName = taskData?.reporterName;
  const userNameCapitalFormation = reporterName?.toUpperCase();

  return (
    <>
      {!taskData?.sprintId && (
        <Box sx={blockStyle(isSmall)}>
          <img
            alt=""
            height={isSmall ? '16' : '20'}
            width={isSmall ? '16' : '20'}
            src="https://springrainio.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=xsmall"
          />
          <Box flexGrow="2">
            <Typography fontSize="14px">{taskName}</Typography>
          </Box>

          <Tooltip title="Open settings">
            <IconButton sx={{ p: 0 }}>
              <Avatar
                style={{ height: isSmall && '24px', width: isSmall && '24px' }}
                {...stringAvatar(userNameCapitalFormation)}
              />
            </IconButton>
          </Tooltip>
          <Typography fontSize="14px">{taskNumber} </Typography>
          {/* <Typography
            style={{
              color: '#FF8C00',
              fontSize: '30px',
              marginTop: '5px',
            }}
          >
            =
          </Typography> */}
          <Box
            sx={{
              height: '16px',
              width: '16px',
            }}
          >
            <img
              loading="lazy"
              alt=""
              src="https://vanquishers.atlassian.net/images/icons/priorities/medium.svg"
            />
          </Box>
          <Box
            sx={{
              padding: '0px 10px',
              borderRadius: '30px',
              marginRight: '5px',
              backgroundColor: '#DCDCDC',
            }}
          >
            <Typography
              sx={{
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '600',
                lineHeight: '20px',
              }}
            >
              {taskData.storyPoint}
            </Typography>
          </Box>
        </Box>
      )}
      {type !== 'backlog' ? (
        <Link to="/details">
          <LinkComponent sx={{ textDecoration: 'none', color: 'black' }}>
            <Box sx={blockStyle}>
              <img
                alt=""
                height="20"
                width="20"
                src="https://springrainio.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=xsmall"
              />
              <Box flexGrow="2">
                <Typography fontSize="14px">{taskName}</Typography>
                <Typography fontSize="11px">{taskNumber}</Typography>
              </Box>
              <Box flexGrow="1" display="flex" alignItems="center">
                <Typography fontSize="11px" color="grey">
                  Commented On
                </Typography>
              </Box>
              <AvatarGroup>
                <Tooltip title="Alim Vai">
                  <Avatar
                    alt="Alim Vai"
                    src="https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/61b6c08608e4e000697ef490/e2bbfef0-dc5e-400c-81cf-76ae1ed01252/128"
                  />
                </Tooltip>
                <Tooltip title="John Doe">
                  <Avatar alt="John Doe">B</Avatar>
                </Tooltip>
              </AvatarGroup>
            </Box>
          </LinkComponent>
        </Link>
      ) : (
        ''
      )}
    </>
  );
}
