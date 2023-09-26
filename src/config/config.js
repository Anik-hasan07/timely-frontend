export const environment = import.meta.env.VITE_ENVIRONMENT;
export const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
export const roles = {
  superAdmin: 'SuperAdmin',
  admin: 'Admin',
  user: 'User',
};

export const boardTypes = {
  scrum: 'scrum',
  kanban: 'kanban',
};

export const taskStatus = {
  pending: 'pending',
  inProgress: 'in progress',
  done: 'done',
  inReview: 'in review',
};

export const sprintStatus = {
  active: 'ACTIVE',
  running: 'RUNNING',
  closed: 'CLOSED',
};
