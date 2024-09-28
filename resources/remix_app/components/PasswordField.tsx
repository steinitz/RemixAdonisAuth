// eslint-disable-next-line unicorn/filename-case
import {useState} from 'react'
import {FormFieldError} from "~/components/FormFieldError";
import {errorMessageFor} from "~/components/ValidatedInput";

export function PasswordField({validationErrors = []}: {validationErrors?: any[]}) {
  const [shouldShowPassword, setShouldShowPassword] = useState(false)
  return (
    <label>
      <span>
        Password
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 'normal',
            padding: '0.1rem 0.3rem',
            width: '50px',
          }}
          onClick={() => setShouldShowPassword(!shouldShowPassword)}
        >
          <span
            style={{float: 'right', marginTop: '8px'}}
            className={shouldShowPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}
          />
        </span>
      </span>
      <input type={shouldShowPassword ? 'text' : 'password'} name="password" />
      <FormFieldError message={errorMessageFor('password', validationErrors)} />
    </label>
  )}
