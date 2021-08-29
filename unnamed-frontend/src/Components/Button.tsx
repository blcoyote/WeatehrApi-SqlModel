
import React from 'react';
import Button from 'react-bootstrap/Button';

type Props = {
    buttonText: string;
    variant: string;
    onClick: () => void;
}

export const gButton: React.FC<Props> = ({buttonText, variant, onClick}) => {

    return (
      <div>
        <Button onClick={() => onClick()} variant = {variant}>{buttonText}</Button>
      </div>
    );
  }

  export default gButton;