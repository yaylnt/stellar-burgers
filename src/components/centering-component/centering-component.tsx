import { FC, useEffect, useState, memo, ReactElement } from 'react';
import { CenteringComponentUI } from '../ui/centering-component';
import { useLocation } from 'react-router-dom';

type CenteringProps = {
  title: string;
  children?: ReactElement;
};

export const CenteringComponent: FC<CenteringProps> = memo(
  ({ title, children }) => {
    const [style, setStyle] = useState('text_type_main-large');

    useEffect(() => {
      setStyle('text_type_digits-default');
    }, []);

    return (
      <>
        <CenteringComponentUI title={title} style={style} children={children} />
      </>
    );
  }
);
