import classNames from 'classnames';
import './Button.pcss';

type ButtonType = 'primary' | 'secondary' | 'accept' | 'decline';
type ButtonTypeMap = {
  [key in ButtonType]: string;
};
export const buttonTypeMap: ButtonTypeMap = {
  primary: 'button_primary',
  secondary: 'button_secondary',
  accept: 'button_accept',
  decline: 'button_decline',
};

interface ButtonProps {
  text: string;
  buttonType: ButtonType;
  onClick?: ()=>void;
  elementType?: 'button' | 'link';
  href?: string;
}

export const Button = ({ text, buttonType, onClick, elementType = 'button', href }: ButtonProps): JSX.Element => (
  <div className="button_wrapper">
    {elementType === 'button' && (
      <button
        type = 'button'
        className={
          classNames (
            'cta_button', buttonType && buttonTypeMap[buttonType],
          )
        }
        onClick = {onClick}
      >
        {text}
      </button>
    )}

    {elementType === 'link' && (
      <a
        className={
          classNames (
            'cta_button', buttonType && buttonTypeMap[buttonType],
          )
        }
        href={href}
      >
        {text}
      </a>
    )}

  </div>

);
