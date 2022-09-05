import './Footer.pcss';

import { useResolvePath } from '@tanstack/react-location';

import RssLogo from '@/assets/svg/rs_school_js.svg';
import { SCHOOL_LINK } from '@/model/constants';
import { SocialLink } from '@/pages/TeamPage/SocialLink/SocialLink';

const ghLinks = [
  {
    link: 'https://github.com/vasily-mishanin',
    name: 'vasily-mishanin',
  },
  {
    link: 'https://github.com/m208',
    name: 'm208',
  },
  {
    link: 'https://github.com/romaskevich',
    name: 'romaskevich',
  },

];

export const Footer = (): JSX.Element => {

  useResolvePath();

  const forbiddenPaths = [
    '/games/sprint',
    '/games/audio',
  ];

  const checkPath = (current: string) => {
    let result = true;
    forbiddenPaths.forEach(el=>{
      if (current.includes(el)) result = false;
    });
    return result;
  };

  return (

    <div>
      {checkPath(window.location.pathname) && (
        <footer className="footer">
          <div className="footer_wrapper">
            <div className="footer_logo">
              <div className="footer_icon">
                <a
                  href={SCHOOL_LINK}
                  target="_blank" rel="noreferrer"
                >
                  <i>
                    <RssLogo />
                  </i>
                </a>
              </div>
            </div>

            <div className="footer_year">2022</div>

            <div className="footer_copyrights">
              {ghLinks.map((el, i) => (

                <SocialLink
                  type='github'
                  link = {el.link}
                  key = {`${i * Math.random()}`}
                  text = {el.name}
                />

              ))}

            </div>
          </div>
        </footer>
      )}
    </div>

  );};
