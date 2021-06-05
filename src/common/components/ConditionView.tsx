import React, {ReactNode} from 'react';

type TProps = {
  showIf: boolean,
  children: JSX.Element
}
export const ConditionView = (props: TProps) => {
  const {children, showIf} = props;
  return showIf ? children : null;
};
