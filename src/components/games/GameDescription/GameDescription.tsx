import './GameDescription.pcss';

export interface GameDescriptionProps {
  name: string;
  description: string[];

}

export const GameDescription = ({ name, description }: GameDescriptionProps): JSX.Element => (
  <>
    <h2 className="game_heading">Мини игра &quot;{name}&quot;</h2>
    {description.map((el, index) => (
      <p className="game_subheading"
        key={`${index*Math.random()}`}
      >
        {el}
      </p>
    ))}
  </>

);
