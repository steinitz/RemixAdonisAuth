// eslint-disable-next-line unicorn/filename-case
import {useState} from 'react'
import {FormFieldError} from "~/components/FormFieldError";
import {errorMessageFor} from "~/components/ValidatedInput";

export function PasswordField({validationErrors = []}: {validationErrors?: any[]}) {
  const [shouldShowPassword, setShouldShowPassword] = useState(false)
  return (
    <label>
      <div>
        Password
        {/*<span*/}
        {/*  style={{*/}
        {/*    fontSize: '0.7rem',*/}
        {/*    fontWeight: 'normal',*/}
        {/*    padding: '0.1rem 0.3rem',*/}
        {/*    width: '50px',*/}
        {/*  }}*/}
        {/*  onClick={() => setShouldShowPassword(!shouldShowPassword)}*/}
        {/*>*/}
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
        {/*</span>*/}
      </div>
      <input type={shouldShowPassword ? 'text' : 'password'} name="password" />
      <FormFieldError message={errorMessageFor('password', validationErrors)} />
    </label>
  )
}
