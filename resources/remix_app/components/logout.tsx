import {Form} from "@remix-run/react";
import {hideFormBorder} from "./styles";

export function Logout(props: { email: string }) {
  const loggedInTextTopMarginTweak = 21

  return (
    <div style={{
      width: '0px', // why does this work perfectly
      display: 'flex',
      justifyContent: 'flex-end',
      // alignContent: 'center',
    }}
    >
      <p style={{
        // nasty tweaking to match the vertical position
        // and bottom margin of the Form button below
        marginTop: `${loggedInTextTopMarginTweak}px`,
        marginBottom: `${loggedInTextTopMarginTweak * 2}px`,
      }}
      >{props.email}</p>
      <Form method="POST" style={hideFormBorder}>
        <input type="hidden" name="intent" value={"log_out"}/>
        <button type={"submit"}>Log out</button>
      </Form>
    </div>
  )
}
