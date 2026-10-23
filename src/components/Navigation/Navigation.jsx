import { routes } from '@/router/router';
import { NavLink } from 'react-router';
import styles from './Navigation.module.css';
function Navigation() {
  const menuItems = routes[0].children.filter((item) => item.meta?.showInMenu);
  return (
    <>
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          {menuItems.map((route, index) => (
            <li key={index} className={styles.navItem}>
              <NavLink
                to={route.path}
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                {route.meta.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default Navigation;
