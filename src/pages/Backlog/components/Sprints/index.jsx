import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sprintStatus } from '../../../../config/config';
import { getSprintTasks, setShowSkeleton } from '../../../../redux/reducers/sprintReducer';
import Sprint from './Sprint';
import './style.scss';

const Sprints = ({ setUpdateTaskHandle, sprintsList }) => {
  const [expanded, setExpanded] = React.useState('panel1');
  const dispatch = useDispatch();
  const { userReducer } = useSelector((state) => state);

  const handleChange = (panel, sprintId) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
    if (newExpanded) {
      dispatch(getSprintTasks({ sprintId, token: userReducer?.token }));
    }
  };
  const activeSprint = sprintsList?.filter(
    (sprint) => sprint.status === sprintStatus.active || sprint.status === sprintStatus.running
  );
  return (
    <div className="sprints-wrapper">
      {activeSprint?.map((sprint, i) => (
        <Sprint
          key={sprint.sprintId}
          panel={`panel${i + 1}`}
          setShowSkeleton={setShowSkeleton}
          sprint={sprint}
          expanded={expanded}
          handleChange={handleChange}
          setUpdateTaskHandle={setUpdateTaskHandle}
        />
      ))}
    </div>
  );
};

export default Sprints;
