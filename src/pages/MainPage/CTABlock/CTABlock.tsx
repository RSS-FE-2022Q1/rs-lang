import { Button } from '@/components/ui/Button/Button';
import './CTABlock.pcss';

export const CTABlock = (): JSX.Element => (

  <div className="cta">
    <h2 className="cta_heading">
        Готов начать?
    </h2>
    <div className="cta_buttons">
      <Button
        text='Учиться'
        buttonType='primary'
        elementType='link'
        href='/textbook'
      />
      <Button
        text='Играть'
        buttonType='secondary'
        elementType='link'
        href='/games'
      />
    </div>
  </div>

);
