import {Form, Link} from "@remix-run/react";
import {hideFormBorder} from "./styles";

export function UserBlock(props: {email: string}) {
  const loggedInTextTopMarginTweak = 21
  const loggedInButtonLeftMarginTweak = '-89px' // allows putting something close to the logout button

  const adjustVerticalLocationStyle = {
    // nasty tweaking to match the vertical position
    // and bottom margin of the Form button below
    marginTop: `${loggedInTextTopMarginTweak}px`,
    marginBottom: `${loggedInTextTopMarginTweak * 2}px`,
  }

  return (
    <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div>
        <p style={{
            ...adjustVerticalLocationStyle,
            marginRight: '34px',
          }}
        >
          {props.email}
        </p>
      </div>
      <div>
        <Link style={{
            ...adjustVerticalLocationStyle,
marginRight: '21px',
          }}
          to="/profile"
        >
          Profile
        </Link>
      </div>
      <Form
        method="POST"
        style={{
          ...hideFormBorder,
          maxWidth: "100px",
          // marginLeft: loggedInButtonLeftMarginTweak,
          borderColor: "pink",
        }}
      >
        <input type="hidden" name="intent" value={"log_out"}/>
        <button
          type={"submit"}
        >
          Log&nbsp;out
        </button>
      </Form>
    </div>
  )
}
