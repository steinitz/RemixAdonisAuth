import {
  noValue
} from "~/constants";
import {
  FormFieldError
} from "~/components/FormFieldError";
import {
  fieldLabelSubtext
} from "~/components/styles";

export const errorMessageFor = (fieldName: string, validationErrors: any[] | undefined) => {
  const {message} = validationErrors?.find(vError => vError.field === fieldName) ?? {};
  return message || noValue;
};

export function ValidatedInput(props: {
  fieldName: string,
  validationErrors: any,
  defaultValue?: string
}) {
  return <>
    <input
      type="text"
      name={props.fieldName}
      defaultValue={props.defaultValue}
    />
    <FormFieldError message={errorMessageFor(props.fieldName, props.validationErrors)} />
  </>
}

export const PreferredNameInput = (props: {
  validationErrors: any[] | undefined
}) => {
  return <div className="tooltip">
    <label>
      Preferred Name <span style={fieldLabelSubtext}>(optional)</span>
      <ValidatedInput
        fieldName="preferredName"
        validationErrors={props.validationErrors}
      />
    </label>
    <span className="tooltiptext">examples: Bob, Grace, Dr. Smith</span>
  </div>;
};

export const LoginNameInput = (props: {
  validationErrors: any[] | undefined
}) => {
  return <div className="tooltip">
    <label>
      Login Name <span style={fieldLabelSubtext}>(recommended)</span>
      <ValidatedInput
        fieldName="username"
        validationErrors={props.validationErrors}
      />
    </label>
    <span className="tooltiptext">Useful if you lose access to your email.</span>
  </div>;
};
