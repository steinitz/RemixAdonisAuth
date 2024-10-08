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
  validationErrors,
  tooltip
}: {
  fieldLabel: string,
  subtext?: string,
  fieldName: string,
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
      />
    </label>
    <span className={hasTooltip ? 'tooltiptext' : ''}>
      {tooltip}
    </span>
  </div>;
}

export const EmailInput = ({validationErrors}: {
  validationErrors: any[] | undefined
}) => {
  return <InputField
    fieldLabel="Email"
    fieldName="email"
    validationErrors={validationErrors}
   />
}

export const LoginNameInput = ({validationErrors}: {
  validationErrors: any[] | undefined
}) => {
  return <InputField
    fieldLabel="Login Name"
    subtext="(recommended)"
    fieldName="username"
    validationErrors={validationErrors}
    tooltip="Useful if you lose access to your email."
  />
}

export const PreferredNameInput = ({validationErrors}: {
  validationErrors: any[] | undefined
}) => {
  return <InputField
    fieldLabel="Preferred Name"
    subtext="(optional)"
    fieldName="preferredName"
    validationErrors={validationErrors}
    tooltip="examples: Bob, Grace, Dr. Smith"
   />
}

export const FullNameInput = ({validationErrors}: {
  validationErrors: any[] | undefined
}) => {
  return <InputField
    fieldLabel="Full Name"
    subtext="(optional)"
    fieldName="fullName"
    validationErrors={validationErrors}
   />
}
