import {
  useState
} from "react";
import {
  FormFieldError
} from "~/components/FormFieldError";
import {
  errorMessageFor,
  ValidatedInput
} from "~/components/ValidatedInput";
import {
  fieldLabelSubtext
} from "~/components/styles";

export function PasswordInput({validationErrors = []}: {validationErrors?: any[]}) {
  const [shouldShowPassword, setShouldShowPassword] = useState(false)
  return (
    <label>
      <div>
        Password
          <div
            style={{float: 'right', marginTop: '3px'}}
            className={shouldShowPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}
            onClick={
              () => {
                console.log('shouldShowPassword', shouldShowPassword)
                setShouldShowPassword(!shouldShowPassword);
              }
            }
          />
      </div>
      <input
        style={{
          width: 'calc(100% - 1.6rem)', // why do I need to repeat this from mvp.css?
        }}
        type={shouldShowPassword ? 'text' : 'password'} name="password"
      />
      <FormFieldError message={errorMessageFor('password', validationErrors)} />
    </label>
  )
}

const InputField = ({
  fieldLabel,
  subtext,
  fieldName,
  defaultValue,
  validationErrors,
  tooltip,
}: {
  fieldLabel: string,
  subtext?: string,
  fieldName: string,
  defaultValue?: string
  validationErrors: any
  tooltip?: string
}) => {
  const hasTooltip = !!tooltip && tooltip.length > 0;
  return <div className={hasTooltip ? 'tooltip' : ''}>
    <label>
      {fieldLabel} <span style={fieldLabelSubtext}>{subtext}</span>
      <ValidatedInput
        fieldName={fieldName}
        validationErrors={validationErrors}
        defaultValue={defaultValue}
      />
    </label>
    <span className={hasTooltip ? 'tooltiptext' : ''}>
      {tooltip}
    </span>
  </div>;
}

export const EmailInput = ({validationErrors, defaultValue}: {
  validationErrors: any[] | undefined, defaultValue?: string
}) => {
  return <InputField
    fieldLabel="Email"
    fieldName="email"
    defaultValue={defaultValue}
    validationErrors={validationErrors}
   />
}

export const UsernameInput = ({validationErrors, defaultValue}: {
  validationErrors: any[] | undefined, defaultValue?: string
}) => {
  return <InputField
    fieldLabel="Login Name"
    subtext="(recommended)"
    fieldName="username"
    defaultValue={defaultValue}
    validationErrors={validationErrors}
    tooltip="Useful if you lose access to your email."
  />
}

export const PreferredNameInput = ({validationErrors, defaultValue}: {
  validationErrors: any[] | undefined, defaultValue?: string
}) => {
  return <InputField
    fieldLabel="Preferred Name"
    subtext="(optional)"
    fieldName="preferredName"
    defaultValue={defaultValue}
    validationErrors={validationErrors}
    tooltip="examples: Bob, Grace, Dr. Smith"
   />
}

export const FullNameInput = ({validationErrors, defaultValue}: {
  validationErrors: any[] | undefined, defaultValue?: string
}) => {
  return <InputField
    fieldLabel="Full Name"
    subtext="(optional)"
    fieldName="fullName"
    defaultValue={defaultValue}
    validationErrors={validationErrors}
   />
}
