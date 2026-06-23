import { FC, memo } from 'react';
import { TCenteringComponentUI } from './type';
import styles from './centering-component.module.css';

export const CenteringComponentUI: FC<TCenteringComponentUI> = memo(
  ({ title, style, children }) => (
    <>
      <div className={styles.centering}>
        <div className={styles.titleContainer}>
          <h3 className={`text ${style}`}>{title}</h3>
        </div>
        <div>{children}</div>
      </div>
    </>
  )
);
