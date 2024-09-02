

export const FormFieldError = ({isError, message}: {isError: boolean | number, message: string}) => {
  // console.log({ message }, isError);
  return (
      <p
        style={{
          // These three evil, "magic" values allow constant vartical spacing
          // with or without this component (FormFieldError) below an input
          // field, given the current mvp-css values and my overrides
          // They also place the error very close, vetically, to the input field
          lineHeight: 0.0,
          marginTop: "-8px",
          marginBottom: "8px",

          fontSize: "0.80rem",
          color: 'red',
          fontWeight: "lighter",

          // Trick to show and hide the error without "layout jank/shift"
          opacity:  isError ? 1 : 0,
          // Prevent user selection of the hidden error.
          // note this also causes a non-ideal behavior
          // in Safari if the user selects the form contents
          userSelect: isError ? 'auto' : 'none',
        }}
      >
        {message}
      </p>
  )
}
