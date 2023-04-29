import { FormikValues, useFormikContext } from 'formik';
import React, { useEffect } from 'react';

interface LoggerProps {
  onValuesChanged: (values: FormikValues) => void;
}

function Logger({ onValuesChanged }: LoggerProps) {
  const { values } = useFormikContext<FormikValues>();

  useEffect(() => {
    onValuesChanged(values);
  }, [values, onValuesChanged]);

  return <></>;
}

export default Logger;
