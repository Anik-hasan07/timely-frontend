/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';

import './style.css';

import { Avatar, Tooltip, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreateTask } from '../../components/CreateTask/CreateTask';
import { boardTypes, taskStatus } from '../../config/config';
import { getSprintTasks } from '../../redux/reducers/sprintReducer';
import { stringAvatar } from '../../utils';
import { updateTaskStatus } from './reducer';

const TaskBoard = ({ tasks = [], boardType }) => {
  const { userReducer, sprintReducer } = useSelector((state) => state);
  const navigate = useNavigate();
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const toggleCreateTaskModal = () => {
    setIsCreateTaskModalOpen(!isCreateTaskModalOpen);
  };
  const upperCaseName = (userName) => {
    return userName?.toUpperCase();
  };
  const [taskList, setTaskList] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    setTaskList([...tasks]);
  }, [tasks]);
  const onDragStart = (evt) => {
    const element = evt.currentTarget;
    element.classList.add('dragged');
    evt.dataTransfer.setData('text/plain', evt.currentTarget.id);
    evt.dataTransfer.effectAllowed = 'move';
  };
  const navigateToTaskDetailsPage = (taskInfo) => {
    return () => {
      navigate(`/projects/${taskInfo?.projectId}/tasks/${taskInfo?.taskId}`);
    };
  };

  const onDragEnd = (evt) => {
    evt.currentTarget.classList.remove('dragged');
  };

  const onDragEnter = (evt) => {
    evt.preventDefault();
    const element = evt.currentTarget;
    element.classList.add('dragged-over');
    evt.dataTransfer.dropEffect = 'move';
  };

  const onDragLeave = (evt) => {
    const { currentTarget } = evt;
    const newTarget = evt.relatedTarget;
    if (newTarget.parentNode === currentTarget || newTarget === currentTarget) return;
    evt.preventDefault();
    const element = evt.currentTarget;
    element.classList.remove('dragged-over');
  };

  const onDragOver = (evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';
  };
  const onDrop = (evt, value, status) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove('dragged-over');
    const data = evt.dataTransfer.getData('text/plain');
    const taskCopy = structuredClone(taskList);
    const updated = taskCopy.map((task) => {
      if (task.taskId.toString() === data.toString()) {
        task.status = status;
      }

      return task;
    });
    dispatch(
      updateTaskStatus({
        taskId: data,
        status,
      })
    );
    setTaskList(updated);
  };
  const activeSprintId = sprintReducer.activeSprint?.sprintId;

  useEffect(() => {
    dispatch(
      getSprintTasks({
        sprintId: activeSprintId,
        token: userReducer.token,
      })
    );
  }, [tasks, dispatch]);
  useEffect(() => {
    if (activeSprintId) {
      const activeSprintTasks = sprintReducer.tasks?.filter(
        (task) => task.sprintId === activeSprintId
      );
    }
  }, [taskList]);

  let pending;
  let done;
  let inProgress;
  let inReview;
  if (boardType === boardTypes.scrum) {
    pending = taskList.filter(
      (data) => data.status === taskStatus.pending && data.sprintId === activeSprintId
    );
    done = taskList.filter(
      (data) => data.status === taskStatus.done && data.sprintId === activeSprintId
    );
    inProgress = taskList.filter(
      (data) => data.status === taskStatus.inProgress && data.sprintId === activeSprintId
    );
    inReview = taskList.filter(
      (data) => data.status === taskStatus.inReview && data.sprintId === activeSprintId
    );
  } else {
    pending = taskList.filter((data) => data.status === taskStatus.pending);
    done = taskList.filter((data) => data.status === taskStatus.done);
    inProgress = taskList.filter((data) => data.status === taskStatus.inProgress);
    inReview = taskList.filter((data) => data.status === taskStatus.inReview);
  }

  return (
    <div className="container">
      <div
        className="order small-box"
        onDragLeave={(e) => onDragLeave(e)}
        onDragEnter={(e) => onDragEnter(e)}
        onDragEnd={(e) => onDragEnd(e)}
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e, false, taskStatus.pending)}
      >
        <section className="drag_container">
          <div className="container">
            <div className="drag_column">
              <div className="drag_row">
                <div className="boardTitle">
                  <Typography style={{ textAlign: 'left', color: '#5e6c84' }}>TO DO</Typography>
                </div>

                {pending.map((task) => (
                  // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                  <div
                    className="card"
                    key={task.taskId}
                    id={task.taskId}
                    onClick={navigateToTaskDetailsPage(task)}
                    draggable
                    onDragStart={(e) => onDragStart(e)}
                    onDragEnd={(e) => onDragEnd(e)}
                    role="button"
                  >
                    <Typography>{task.taskName}</Typography>
                    <div className="cardFooter">
                      <div style={{ alignItems: 'center', display: 'flex' }}>
                        {task.type === 'task' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318"
                            />
                          </Tooltip>
                        )}
                        {task.type === 'story' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315"
                            />
                          </Tooltip>
                        )}
                        {task.type === 'bug' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10303"
                            />
                          </Tooltip>
                        )}
                        {task.type === 'epic' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/images/icons/issuetypes/epic.svg"
                            />
                          </Tooltip>
                        )}
                        {task.priority === 'low' && (
                          <img
                            style={{ width: '20px', height: '15px' }}
                            src="https://vanquishers.atlassian.net/images/icons/priorities/low.svg"
                          />
                        )}
                        {task.priority === 'medium' && (
                          <img
                            style={{ width: '20px', height: '15px' }}
                            src="https://vanquishers.atlassian.net/images/icons/priorities/medium.svg"
                          />
                        )}
                        {task.priority === 'high' && (
                          <img
                            style={{ width: '20px', height: '15px' }}
                            src="https://vanquishers.atlassian.net/images/icons/priorities/high.svg"
                          />
                        )}
                        {task.storyPoint ? (
                          <div className="circular-background">
                            <span className="text">{task.storyPoint}</span>
                          </div>
                        ) : (
                          <div />
                        )}
                      </div>

                      <div className="leftFooter">
                        <Typography
                          variant="overline"
                          style={{
                            marginRight: '20px',
                          }}
                        >
                          {task.taskNumber}
                        </Typography>

                        {task.assigneeId ? (
                          <Tooltip key={task?.id} title={task?.assigneeName}>
                            <Avatar
                              className="avatar"
                              style={{ marginLeft: '-8px', height: '25px', width: '25px' }}
                              {...stringAvatar(upperCaseName(task?.assigneeName), {
                                fontSize: '12px',
                              })}
                            />
                          </Tooltip>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="createIssueBtn" style={{ padding: '5px' }}>
            {boardType === boardTypes.kanban ? (
              <button
                className="issueBtn"
                style={{
                  padding: '5px',
                  backgroundColor: '#e2e2e2',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '16px',
                  borderRadius: '4px',
                }}
                type="button"
                onClick={toggleCreateTaskModal}
              >
                + Create issue
              </button>
            ) : (
              ''
            )}
          </div>
        </section>
      </div>

      <div
        className="pending small-box"
        onDragLeave={(e) => onDragLeave(e)}
        onDragEnter={(e) => onDragEnter(e)}
        onDragEnd={(e) => onDragEnd(e)}
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e, false, taskStatus.inProgress)}
      >
        <section className="drag_container">
          <div className="container">
            <div className="drag_column">
              <div className="drag_row">
                <div className="boardTitle">
                  <Typography style={{ textAlign: 'left', color: '#5e6c84' }}>
                    IN PROGRESS
                  </Typography>
                </div>

                {inProgress.map((task) => (
                  // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                  <div
                    className="card"
                    key={task.taskId}
                    id={task.taskId}
                    role="button"
                    onClick={navigateToTaskDetailsPage(task)}
                    draggable
                    onDragStart={(e) => onDragStart(e)}
                    onDragEnd={(e) => onDragEnd(e)}
                  >
                    <Typography>{task.taskName}</Typography>
                    <div className="cardFooter">
                      <div style={{ alignItems: 'center', display: 'flex' }}>
                        {task.type === 'task' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318"
                            />
                          </Tooltip>
                        )}
                        {task.type === 'story' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315"
                            />
                          </Tooltip>
                        )}
                        {task.type === 'bug' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10303"
                            />
                          </Tooltip>
                        )}
                        {task.type === 'epic' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/images/icons/issuetypes/epic.svg"
                            />
                          </Tooltip>
                        )}

                        {task.priority === 'low' && (
                          <img
                            style={{ width: '20px', height: '15px' }}
                            src="https://vanquishers.atlassian.net/images/icons/priorities/low.svg"
                          />
                        )}
                        {task.priority === 'medium' && (
                          <img
                            style={{ width: '20px', height: '15px' }}
                            src="https://vanquishers.atlassian.net/images/icons/priorities/medium.svg"
                          />
                        )}
                        {task.priority === 'high' && (
                          <img
                            style={{ width: '20px', height: '15px' }}
                            src="https://vanquishers.atlassian.net/images/icons/priorities/high.svg"
                          />
                        )}

                        {task.storyPoint ? (
                          <div className="circular-background">
                            <span className="text">{task.storyPoint}</span>
                          </div>
                        ) : (
                          <div />
                        )}
                      </div>

                      <div className="leftFooter">
                        <Typography
                          variant="overline"
                          style={{
                            marginRight: '20px',
                          }}
                        >
                          {task.taskNumber}
                        </Typography>

                        {task.assigneeId ? (
                          <Tooltip key={task?.id} title={task?.assigneeName}>
                            <Avatar
                              className="avatar"
                              style={{ marginLeft: '-8px', height: '25px', width: '25px' }}
                              {...stringAvatar(upperCaseName(task?.assigneeName), {
                                fontSize: '12px',
                              })}
                            />
                          </Tooltip>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <div
        className="pending small-box"
        onDragLeave={(e) => onDragLeave(e)}
        onDragEnter={(e) => onDragEnter(e)}
        onDragEnd={(e) => onDragEnd(e)}
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e, false, taskStatus.inReview)}
      >
        <section className="drag_container">
          <div className="container">
            <div className="drag_column">
              <div className="drag_row">
                <div className="boardTitle">
                  <Typography style={{ textAlign: 'left', color: '#5e6c84' }}>IN REVIEW</Typography>
                </div>

                {inReview.map((task) => (
                  // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                  <div
                    className="card"
                    key={task.taskId}
                    id={task.taskId}
                    role="button"
                    onClick={navigateToTaskDetailsPage(task)}
                    draggable
                    onDragStart={(e) => onDragStart(e)}
                    onDragEnd={(e) => onDragEnd(e)}
                  >
                    <Typography>{task.taskName}</Typography>
                    <div className="cardFooter">
                      <div style={{ alignItems: 'center', display: 'flex' }}>
                        {task.type === 'task' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318"
                            />
                          </Tooltip>
                        )}
                        {task.type === 'story' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315"
                            />
                          </Tooltip>
                        )}
                        {task.type === 'bug' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10303"
                            />
                          </Tooltip>
                        )}
                        {task.type === 'epic' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/images/icons/issuetypes/epic.svg"
                            />
                          </Tooltip>
                        )}

                        {task.priority === 'low' && (
                          <img
                            style={{ width: '20px', height: '15px' }}
                            src="https://vanquishers.atlassian.net/images/icons/priorities/low.svg"
                          />
                        )}
                        {task.priority === 'medium' && (
                          <img
                            style={{ width: '20px', height: '15px' }}
                            src="https://vanquishers.atlassian.net/images/icons/priorities/medium.svg"
                          />
                        )}
                        {task.priority === 'high' && (
                          <img
                            style={{ width: '20px', height: '15px' }}
                            src="https://vanquishers.atlassian.net/images/icons/priorities/high.svg"
                          />
                        )}

                        {task.storyPoint ? (
                          <div className="circular-background">
                            <span className="text">{task.storyPoint}</span>
                          </div>
                        ) : (
                          <div />
                        )}
                      </div>

                      <div className="leftFooter">
                        <Typography
                          variant="overline"
                          style={{
                            marginRight: '20px',
                          }}
                        >
                          {task.taskNumber}
                        </Typography>

                        {task.assigneeId ? (
                          <Tooltip key={task?.id} title={task?.assigneeName}>
                            <Avatar
                              className="avatar"
                              style={{ marginLeft: '-8px', height: '25px', width: '25px' }}
                              {...stringAvatar(upperCaseName(task?.assigneeName), {
                                fontSize: '12px',
                              })}
                            />
                          </Tooltip>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div
        className="done small-box"
        onDragLeave={(e) => onDragLeave(e)}
        onDragEnter={(e) => onDragEnter(e)}
        onDragEnd={(e) => onDragEnd(e)}
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e, true, taskStatus.done)}
      >
        <section className="drag_container">
          <div className="container">
            <div className="drag_column">
              <div className="drag_row">
                <div className="boardTitle">
                  <Typography style={{ textAlign: 'left', color: '#5e6c84' }}>DONE</Typography>
                </div>

                {done.map((task) => (
                  // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                  <div
                    className="card"
                    key={task.taskId}
                    id={task.taskId}
                    role="button"
                    onClick={navigateToTaskDetailsPage(task)}
                    draggable
                    onDragStart={(e) => onDragStart(e)}
                    onDragEnd={(e) => onDragEnd(e)}
                  >
                    <Typography>{task.taskName}</Typography>
                    <div className="cardFooter">
                      {/* left */}
                      <div style={{ alignItems: 'center', display: 'flex' }}>
                        {task.type === 'task' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318"
                            />
                          </Tooltip>
                        )}
                        {task.type === 'story' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315"
                            />
                          </Tooltip>
                        )}
                        {task.type === 'bug' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10303"
                            />
                          </Tooltip>
                        )}
                        {task.type === 'epic' && (
                          <Tooltip key={task?.id} title={task.type}>
                            <img
                              className="taskTypeIcon"
                              src="https://vanquishers.atlassian.net/images/icons/issuetypes/epic.svg"
                            />
                          </Tooltip>
                        )}
                        {task.priority === 'low' && (
                          <img
                            style={{ width: '20px', height: '15px' }}
                            src="https://vanquishers.atlassian.net/images/icons/priorities/low.svg"
                          />
                        )}
                        {task.priority === 'medium' && (
                          <img
                            style={{ width: '20px', height: '15px' }}
                            src="https://vanquishers.atlassian.net/images/icons/priorities/medium.svg"
                          />
                        )}
                        {task.priority === 'high' && (
                          <img
                            style={{ width: '20px', height: '15px' }}
                            src="https://vanquishers.atlassian.net/images/icons/priorities/high.svg"
                          />
                        )}
                        {task.storyPoint ? (
                          <div className="circular-background">
                            <span className="text">{task.storyPoint}</span>
                          </div>
                        ) : (
                          <div />
                        )}
                      </div>
                      {/* left */}
                      <div className="leftFooter">
                        <Typography
                          variant="overline"
                          style={{
                            marginRight: '20px',
                          }}
                        >
                          {task.taskNumber}
                        </Typography>

                        {task.assigneeId ? (
                          <Tooltip key={task?.id} title={task?.assigneeName}>
                            <Avatar
                              className="avatar"
                              style={{ marginLeft: '-8px', height: '25px', width: '25px' }}
                              {...stringAvatar(upperCaseName(task?.assigneeName), {
                                fontSize: '12px',
                              })}
                            />
                          </Tooltip>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <CreateTask isOpen={isCreateTaskModalOpen} handleClickClose={toggleCreateTaskModal} />
    </div>
  );
};

export default TaskBoard;
