import { Avatar, Stack, Typography, Box } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

export function SingleActivity({
  changedBy = 'test user',
  type = 'Status',
  timeAgo = '20 hours ago',
  from = 'To do',
  to = 'In progress',
  fromAvatar = null,
  toAvatar = null,
}) {
  return (
    <Stack direction="row" spacing={1}>
      <Avatar />
      <Stack spacing={1}>
        <Stack direction="row" spacing={1}>
          <Typography fontSize={14}>
            <b>{changedBy}</b> changed the <b>{type}</b> {timeAgo}
          </Typography>
          <Box pl={1}>
            <FilledTypography text={'History'} />
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          {!!fromAvatar && <Avatar />}
          <FilledTypography text={from} />
          <ArrowForward fontSize="10px" />
          {!!toAvatar && <Avatar />}
          <FilledTypography color="rgb(0,82,204)" background="rgb(222,235,255)" text={to} />
        </Stack>
      </Stack>
    </Stack>
  );
}

function FilledTypography({ background = 'rgb(223,225,230)', color = 'rgb(66,82,110)', text }) {
  return (
    <Typography
      color={color}
      fontWeight="bold"
      fontSize={12}
      style={{
        padding: '3px',
        borderRadius: '5px',
        background,
      }}
    >
      {text}
    </Typography>
  );
}
