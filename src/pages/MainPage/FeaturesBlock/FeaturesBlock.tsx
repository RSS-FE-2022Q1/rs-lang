import './FeaturesBlock.pcss';

export interface FeaturesProps {
  features: IFeature[];
}

export interface IFeature {
  name: string;
  description: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

export const FeaturesBlock = ({ features }: FeaturesProps): JSX.Element => (

  <div className="features">
    {features.map(feature => (
      <div key={feature.name} className="features_item">
        <dt>
          <div className="feature_icon">
            <feature.icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
        </dt>
        <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
      </div>
    ))}
  </div>

);
