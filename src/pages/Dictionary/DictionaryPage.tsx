import { Link, Outlet } from '@tanstack/react-location';
import './DictionaryPage.pcss';

const DictionaryPage = (): JSX.Element => (
  <section className='dictionary'>
    <h1>DictionaryPage</h1>
    <nav className='dictionary-nav'>
      <ul className='dictionary-nav-list'>
        <li>
          <Link to="difficult">Difficult Words</Link>
        </li>
        <li>
          <Link to="learned">Learned Words</Link>
        </li>
        <li>
          <Link to="progress">Progress</Link>
        </li>
      </ul>
    </nav>
    <Outlet />
  </section>
);
export default DictionaryPage;
