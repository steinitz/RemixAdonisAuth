// hack to get email address and login/logout buttons to line up
const loggedInButtonFormTopMarginTweak = '-21px'

export const hideFormBorder: React.CSSProperties = {
  border: "none",
  boxShadow: "none",
  // textAlign: "right",
  marginTop: loggedInButtonFormTopMarginTweak,
  maxWidth: 'auto',
  minWidth: 'auto',
}

export const fieldLabelSubtext: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 'lighter',
  paddingLeft: '0.3rem',
  // nudge it up to align with the main label text
  position: 'relative',
  top: '-1px',
  // none of these nudge it up
  // paddingTop: '0px',
  // marginTop: '-30px',
  // marginBottom: '30px',
  // paddingBottom: '30px'
}
