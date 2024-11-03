import {Form, Link} from "@remix-run/react";
import {hideFormBorder} from "./styles";

const loggedInTextTopMarginTweak = 21

export const  adjustVerticalLocationStyle = {
  // Nasty tweaking to align to the vertical position and
  // bottom margin of the single Login button in a Form below.
  // Also used by _index.tsx.
  marginTop: `${loggedInTextTopMarginTweak}px`,
  marginBottom: `${loggedInTextTopMarginTweak * 2}px`,
}

export function UserBlock(props: {email: string}) {

  return (
    <div style={{
      display: 'flex',
      // justifyContent: 'stretch',
    }}
    >
      <div>
        <p style={{
          ...adjustVerticalLocationStyle,
          marginRight: '21px',
          fontWeight: 'normal',
        }}
        >
          {props.email}
        </p>
      </div>
      <div>
        <Link
          style={{
            ...adjustVerticalLocationStyle,
            marginRight: '21px',
          }}
          to="/profile"
        >
          Profile
        </Link>
      </div>
      <div>
        <Link
          style={{
            ...adjustVerticalLocationStyle,
          }}
          to="/contact"
        >
          Support
        </Link>
      </div>
      <Form
        method="POST"
        style={{
          ...hideFormBorder,
          maxWidth: "100px",
        }}
      >
        <input type="hidden" name="intent" value={"log_out"} />
        <button
          type={"submit"}
        >
          Log&nbsp;out
        </button>
      </Form>
    </div>
  )
}
