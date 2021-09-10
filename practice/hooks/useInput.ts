import { useState, SetStateAction, Dispatch } from 'react';

type ReturnType<T> = [
  T,
  Dispatch<SetStateAction<T>>,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
];

const useInput = <T>(initialVale: T): ReturnType<T> => {
  const [value, setValue] = useState(initialVale);
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as unknown as T);
  };

  return [value, setValue, onChangeValue];
};

export default useInput;
