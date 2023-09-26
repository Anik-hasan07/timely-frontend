/* eslint-disable no-unsafe-optional-chaining */
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { Avatar, Button, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { boardTypes, sprintStatus, taskStatus } from '../../config/config';
import StartSprint from '../../pages/Backlog/components/Sprints/StartSprint';
import { endSprint } from '../../redux/reducers/sprintReducer';
import { stringAvatar } from '../../utils';
import DropDown from '../DropDown';
import Modal from '../Modal';
import './style.scss';

dayjs.extend(utc);

function TopNavbar({ title, users, boardType = 'scrum', projectPrefix, isBacklogScreen = false }) {
  const limitedUsers = users?.slice(0, 5);
  const remainingCount = Math.max(users?.length - 5, 0);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { userReducer, sprintReducer, projectReducer } = useSelector((state) => state);

  const startDateUtc = dayjs.utc(sprintReducer?.activeSprint?.startDate);
  const endDateUtc = dayjs.utc(sprintReducer?.activeSprint?.endDate);
  const startDate = startDateUtc.local().format('D/MMM/YY hh:mm A');
  const endDate = endDateUtc.local().format('D/MMM/YY hh:mm A');
  const todaysDateUtc = dayjs.utc(Date.now());
  const remainingDays = Math.max(0, endDateUtc.diff(todaysDateUtc, 'day'));

  const [sprintId, setSprintId] = useState(null);

  useEffect(() => {
    if (sprintReducer?.activeSprint?.sprintId) {
      setSprintId(sprintReducer?.activeSprint?.sprintId);
    } else {
      const activeSprint = sprintReducer?.sprints?.find(
        (sprint) => sprint.status === sprintStatus.active
      );
      setSprintId(activeSprint?.sprintId);
    }
  }, [sprintReducer.activeSprint]);

  const handleSprint = () => {
    setShowModal(true);
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const upperCaseName = (userName) => {
    return userName?.toUpperCase();
  };

  const [selectedOption, setSelectedOption] = useState('backlog');
  const dropdownOptions = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'new-sprint', label: 'New Sprint' },
  ];

  const handleSubmit = () => {
    if (sprintId && selectedOption) {
      dispatch(endSprint({ sprintId, token: userReducer.token, moveTo: selectedOption }));
    }
    setShowModal(false);
    navigate(`/projects/${projectId}/backlog`);
  };

  const doneIssues = sprintReducer.tasks?.filter((task) => task.status === taskStatus.done).length;
  const incompleteIssues = sprintReducer.tasks?.filter(
    (task) => task.status !== taskStatus.done
  ).length;

  return (
    <div className="topNav">
      <div>
        <ul>
          <li>
            <Link to="/">
              <span className="breadCrumbLinks">Timely</span> /
            </Link>
          </li>
          <li>
            <Link to="/projects">
              <span className="breadCrumbLinks">Project</span> /
            </Link>
          </li>
          <li>
            <span className="breadCrumbLinks breadCrumbLinksInactive">{projectPrefix}</span>
          </li>
        </ul>
      </div>
      <Modal
        open={showModal}
        setOpen={setShowModal}
        title="Complete Sprint"
        submitText="Complete"
        handleSubmit={handleSubmit}
        sx={{ height: '480px' }}
      >
        <Typography variant="subtitle" sx={{ fontSize: '14px' }}>
          {doneIssues} issues were done
        </Typography>
        <br />
        <Typography variant="subtitle" sx={{ fontSize: '14px', marginBottom: '2px' }}>
          {incompleteIssues} issues were incomplete
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: '6px' }}>
          Select where all the incomplete issues should be moved:
        </Typography>
        <Typography variant="subtitle" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
          Move to
        </Typography>
        <DropDown
          options={dropdownOptions}
          value={selectedOption}
          selectedItem={(option) => {
            // eslint-disable-next-line no-unused-expressions
            setSelectedOption(option.value);
            return option;
          }}
          showOptionAsBadge={false}
        />
      </Modal>
      <div className="main-section">
        {boardType === boardTypes.kanban ? (
          <h3 style={{ padding: '5px', marginBottom: '20px' }}>Kanban Board</h3>
        ) : (
          <h3 style={{ padding: '5px', marginBottom: '20px' }}>
            {sprintReducer?.activeSprint?.sprintStatus === sprintStatus.running
              ? title
              : 'Active Sprint'}
          </h3>
        )}
        {/* <h3 style={{ padding: '5px', marginBottom: '20px' }}>{title}</h3> */}
        <div className="sub-section">
          {/* <FlashOnIcon className="iconStyle" />
          <StarBorderIcon className="iconStyle" /> */}
          {projectReducer.selectedProject?.boardType === boardTypes.scrum && (
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#172B4D',
                  },
                },
              }}
              title={
                <div className="tooltip-content-wrapper">
                  <p className="startEndLabel">Start date:</p>
                  <p>{startDate}</p>
                  <p className="startEndLabel">Projected end date:</p>
                  <p>{endDate}</p>
                </div>
              }
            >
              <div className="remaining-wrapper">
                <AccessAlarmIcon className="iconStyle" />
                <span className="remaining-text">{remainingDays} days remaining</span>
              </div>
            </Tooltip>
          )}

          {boardType === boardTypes.scrum &&
          !isBacklogScreen &&
          sprintReducer?.activeSprint?.sprintStatus === sprintStatus.running ? (
            <Button
              sx={{ textTransform: 'capitalize', margin: '0 18px' }}
              variant="contained"
              onClick={handleSprint}
            >
              Complete Sprint
            </Button>
          ) : (
            ''
          )}
          {/* start sprint */}
          {boardType === boardTypes.scrum && isBacklogScreen && <StartSprint />}
          {/* <ShareIcon className="iconStyle" /> */}
          {/* <div>
            <IconButton aria-controls="menu" aria-haspopup="true" onClick={handleMenuOpen}>
              <MoreHorizIcon style={{ height: '20px', width: '20px' }} />
            </IconButton>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
                <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
                <MenuItem onClick={handleMenuClose}>Option 3</MenuItem>
              </Box>
            </Menu>
          </div> */}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* <div>
            <SearchComponent iconPosition="right" />
          </div> */}

          <div
            style={{
              display: 'flex',
              gap: '-20px',
              alignItems: 'center',
              marginLeft: '10px',
            }}
          >
            {limitedUsers?.map((user) => (
              <Tooltip key={user?.id} title={user.userName}>
                <Avatar
                  className="avatar"
                  style={{ marginLeft: '-8px' }}
                  {...stringAvatar(upperCaseName(user?.userName), { fontSize: '12px' })}
                />
              </Tooltip>
            ))}
            {remainingCount > 0 && (
              <Tooltip>
                <Avatar
                  className="avatar"
                  style={{ fontSize: '12px', marginLeft: '-10px' }}
                >{`+${remainingCount}`}</Avatar>
              </Tooltip>
            )}
          </div>
          {/* <button type="button" className="issue-apdate-button">
            Only My issue
          </button>
          <button className="issue-apdate-button" type="button">
            Recently Updated
          </button> */}
        </div>
        {/* <Button style={{ marginRight: '2%' }}>
          {' '}
          <TrendingUpIcon /> Insights
        </Button> */}
      </div>
    </div>
  );
}

export default TopNavbar;
