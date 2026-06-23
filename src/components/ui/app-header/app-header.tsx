import React, { FC } from 'react';
import clsx from 'clsx';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to={'/'}
          className={({ isActive }) =>
            clsx(
              'text text_type_main-medium text-primary-color pt-4 pb-4',
              styles.link,
              { [styles.link_active]: isActive }
            )
          }
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </>
          )}
        </NavLink>
        <NavLink
          to={'/feed'}
          className={({ isActive }) =>
            clsx(
              'text text_type_main-medium text-primary-color pt-4 pb-4',
              styles.link,
              { [styles.link_active]: isActive }
            )
          }
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.logo}>
        <NavLink to={'/'}>
          <Logo className='' />
        </NavLink>
      </div>
      <div className={styles.link_position_last}>
        <NavLink
          to={'/profile'}
          className={({ isActive }) =>
            clsx(
              'text text_type_main-medium text-primary-color pt-4 pb-4',
              styles.link,
              { [styles.link_active]: isActive }
            )
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>
                {userName || 'Личный кабинет'}
              </p>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
