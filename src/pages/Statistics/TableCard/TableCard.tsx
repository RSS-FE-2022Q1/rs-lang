import './TableCard.pcss';

import classNames from 'classnames';

type ItemDefault = {title: string; content: string};

type ItemList =  {title: string; content: string | ItemDefault[]};

export interface TableCardProps {
  heading: string;
  subheading?: string;
  items: Array<ItemDefault | ItemList>;
}

export const TableCard = ({ heading, items, subheading }:TableCardProps ): JSX.Element => (
  <div className="stats_card">
    <div className="stats_header">
      <div className="stats_heading">
        <h3 className="stats_title">{heading}</h3>
        {subheading && (
          <p className="stats_subtitle">{subheading}</p>
        )}
      </div>
    </div>

    <div className="stats_table">
      {items.map((item, index )=> (
        <div
          className = {
            classNames(
              'stats_line', (index%2===0) && 'line_odd',
            )
          }
          key={`${index*Math.random()}`}
        >

          <div className="stats_line_header ">{item.title}</div>
          <div className="stats_line_content ">

            {(typeof item.content === 'string')
              ? item.content
              : <ul className="stats_list">
                {item.content.map((el, i)=>(
                  <li
                    className="stats_list-item"
                    key = {`${i*Math.random()}`}
                  >
                    <div className="stats_list-item_title">
                      <span className="">{el.title}:</span>
                    </div>
                    <div className="stats_list-item_txt">
                      <span className="">{el.content}</span>
                    </div>
                  </li>
                ))}
              </ul>
            }

          </div>
        </div>

      ))}

    </div>
  </div>
);
