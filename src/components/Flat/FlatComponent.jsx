export const FlatComponent = ({ data, boardOnClick }) => {
  const { imageUrl, title, tagTitle, quickLinkTitle, quickLinks, boardText } = data;
  return (
    <div className="container">
      <div className="top">
        <span className="imageWrappper">
          <img className="image" src={imageUrl} width="24px" height="24px" />
        </span>
        <div className="titleTag">
          <p className="title">{title}</p>
          <p className="tag">{tagTitle}</p>
        </div>
      </div>
      <div className="middle">
        <div className="quickLink">
          <p className="quickLinkText">{quickLinkTitle}</p>
        </div>
        {quickLinks?.map(({ title, value, url }) => {
          return (
            <div className="quickLink" key={title}>
              <a className="quickLinkUrl" href={url} target="_self">
                <div className="issue">
                  <p className="issueText">{title}</p>
                </div>
                {!!value && <div className="issueCounter">{value}</div>}
              </a>
            </div>
          );
        })}
      </div>
      <div className="bottom">
        <button className="boardButton" type="button" onClick={boardOnClick}>
          <span className="board">
            <p className="boardText">{boardText}</p>
          </span>
          <span className="bottomImageIcon">
            <span role="img" aria-label="board">
              <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
                <path
                  d="M8.292 10.293a1.009 1.009 0 000 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 000-1.419.987.987 0 00-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 00-1.406 0z"
                  fill="currentColor"
                  fill-rule="evenodd"
                ></path>
              </svg>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};
