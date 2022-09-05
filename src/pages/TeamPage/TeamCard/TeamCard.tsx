import { SocialLink } from '../SocialLink/SocialLink';
import './TeamCard.pcss';

export interface TeamMemberProps {
  member: ITeamMember;
}

export interface ITeamMember {
  name: string;
  role: string;
  description: string;
  photo: string;

  links : {
    github: string;
    linkedin?: string;
  };

}

export const TeamCard = ({ member }: TeamMemberProps): JSX.Element => (

  <div className="team_card">
    <div className="card_photo">
      <img src={member.photo} alt={member.name} className="card_photoImg" />
    </div>
    <h3 className="card_name">{member.name}</h3>
    <p className="card_role">{member.role}</p>
    <p className="card_description">{member.description}</p>
    <div className="card_links">
      <SocialLink type='github' link={member.links.github} />
      {member.links.linkedin && <SocialLink type='linkedin' link={member.links.linkedin} />}
    </div>
  </div>

);
