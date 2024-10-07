import {useState} from 'react'
import {FormFieldError} from "~/components/FormFieldError";
import {errorMessageFor} from "~/components/ValidatedInput";

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
