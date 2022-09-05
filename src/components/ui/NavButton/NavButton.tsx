import { Link } from '@tanstack/react-location';
import './NavButton.pcss';

export interface NavButtonProps {
  href: string;
  name: string;
  description?: string;
  icon: {
    icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  };

}
export const NavButton = ({ href, icon, name, description }:NavButtonProps ): JSX.Element => (
  <div className="navbutton">
    <Link to={href}>
      <div
        //   href={href}
        className="navbutton_link"
      >

        <icon.icon className="navbutton_icon"  aria-hidden="true" />

        <div className="ml-4">
          <p className="navbutton_title">{name}</p>
          {description && (
            <p className="navbutton_descr">{description}</p>
          )}
        </div>
      </div>
    </Link>
  </div>

);
