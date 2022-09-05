import gitHubImage from '@/assets/images/logo-github.png';
import linkedinImage from '@/assets/images/logo-linkedin.png';

import './SocialLink.pcss';

type LinkType = 'github' | 'linkedin';
type LinkTypeMap = {
  [key in LinkType]: string;
};
export const linkImageMap: LinkTypeMap = {
  github: gitHubImage,
  linkedin: linkedinImage,
};

export interface SocialLinkProps {
  type: LinkType;
  link: string;
  text? : string;
}

export const SocialLink = ({ type, link, text  }: SocialLinkProps): JSX.Element => (
  <div className="social_link">
    <a
      className='social_a'
      href={link}
      target="_blank" rel="noreferrer"
    >
      <img className='social_image'
        src={linkImageMap[type]}
        alt="gitHub profile"
      />
      {text}
    </a>
  </div>

);
