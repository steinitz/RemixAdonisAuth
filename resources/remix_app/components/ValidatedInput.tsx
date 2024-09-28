import {noValue} from "~/constants";
import {FormFieldError} from "~/components/FormFieldError";

export const errorMessageFor = (fieldName: string, validationErrors: any[] | undefined) => {
  const {message} = validationErrors?.find(vError => vError.field === fieldName) ?? {};
  return message || noValue;};

export function ValidatedInput(props: {fieldName: string, validationErrors: any}) {
  return <>
    <input type="text" name={props.fieldName} />
    <FormFieldError message={errorMessageFor(props.fieldName, props.validationErrors)} />
  </>;}
