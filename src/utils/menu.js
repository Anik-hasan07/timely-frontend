export const menuList = [
  {
    title: 'Your Work',
    link: '/',
  },
  {
    title: 'Projects',
    subMenu: [
      {
        title: 'Project List',
        link: '/projects',
      },
      {
        title: 'Create Project',
        modal: 'createProject',
      },
      {
        title: 'Invite Member',
        modal: 'inviteMember',
      },
    ],
  },
  {
    title: 'Teams',
    subMenu: [
      {
        title: 'User List',
        link: '/users',
      },
      // {
      //   title: 'Invite to Timely',
      //   modal: 'inviteToTimely',
      // },
    ],
  },
];

export const scrumLeftMenuList = [
  {
    title: 'Backlog',
    link: '/projects/:projectId/backlog',
  },
  {
    title: 'Active sprint',
    link: '/projects/:projectId',
  },
];

export const kanbanLeftMenuList = [
  {
    title: 'Kanban board',
    link: '/projects/:projectId',
  },
];
export const leftBottom = [
  { title: 'Members', link: '/projects/:projectId/users' },
  { title: 'Project settings', link: '/projects/:projectId/settings' },
];
