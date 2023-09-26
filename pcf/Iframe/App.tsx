import * as React from 'react';
import Spinner from 'react-spinner-material';

export interface IAppProps {
  clientUrl: ComponentFramework.PropertyTypes.StringProperty;
  orgId: ComponentFramework.PropertyTypes.StringProperty;
  userId: ComponentFramework.PropertyTypes.StringProperty;
  orgName?: ComponentFramework.PropertyTypes.StringProperty;
  userName?: ComponentFramework.PropertyTypes.StringProperty;
  projectId?: ComponentFramework.PropertyTypes.StringProperty;
  userEmail: ComponentFramework.PropertyTypes.StringProperty;
}

function isValidUrl(url: string) {
  const urlRegex =
    // eslint-disable-next-line no-useless-escape
    /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9\-\.]{3,}\.[a-z]{2,}(?::[0-9]{1,5})?(?:\/[^\s]*)?$/i;

  return urlRegex.test(url);
}

export const App: React.FC<IAppProps> = (props: IAppProps) => {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        overflowY: 'hidden',
      }}
    >
      {props.clientUrl?.formatted &&
      isValidUrl(props.clientUrl?.formatted) &&
      props.userId?.formatted &&
      props.orgId?.formatted &&
      props.userEmail?.formatted &&
      props.orgName?.formatted ? (
        <iframe
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
          src={`${props.clientUrl?.formatted}?userId=${props.userId?.formatted}&orgId=${
            props.orgId?.formatted
          }&userName=${props.userName?.formatted}&userEmail=${props.userEmail?.formatted}&orgName=${
            props.orgName?.formatted
          }${props.projectId?.formatted ? `&projectId=${props.projectId?.formatted}` : ''}`}
        />
      ) : (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner radius={80} color={'#ff5722'} stroke={7} visible={true} />
        </div>
      )}
    </div>
  );
};
