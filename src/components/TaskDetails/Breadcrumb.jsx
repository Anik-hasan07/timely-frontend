import { Breadcrumbs, Link as LinkComponent, Stack, Typography } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';

function handleClick(event) {
  event.preventDefault();
}

export default function DetailsBreadcrumbs({ breadcrumbItems }) {
  return (
    <div style={{ paddingLeft: '20px' }} role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbItems.map(({ title, href, iconImgSrc }, i) => {
          const isLastBreadcrumb = breadcrumbItems.length - 1 === i;
          const view = isLastBreadcrumb ? (
            <Typography color="text.primary">{title}</Typography>
          ) : (
            <Link to={href}>
              <LinkComponent underline="hover" color="#5e6c84">
                {title}
              </LinkComponent>
            </Link>
          );
          return (
            <Stack direction="row" gap={1} key={title}>
              {!!iconImgSrc && (
                <img alt="" style={{ width: '15px', objectFit: 'contain' }} src={iconImgSrc} />
              )}
              {view}
            </Stack>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}
