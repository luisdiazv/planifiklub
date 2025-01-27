import './AboutUsStyles.css';
import Luis from '../../src/Components/imgs/TeamPics/Luis.jpg';
import Chara from '../../src/Components/imgs/TeamPics/Chara.jpeg';
import Jonathan from '../../src/Components/imgs/TeamPics/Jonathan.jpg';
import Sergio from '../../src/Components/imgs/TeamPics/Sergio.jpg';

// Component to render a single team member card
function TeamMemberCard({ imgSrc, name, title, roles, email }) {
    return (
        <div className="Uscolumn">
            <div className="Uscard">
                <img className="teamImg" src={imgSrc} alt={`${name}Img`} />
                <div className="person-container">
                    <h2>{name}</h2>
                    <p className="title">{title}</p>
                    {roles.map((role, index) => (
                        <p key={index}>{role}</p>
                    ))}
                    <p><a href={`mailto:${email}`} className="email-link">{email}</a></p>
                </div>
            </div>
        </div>
    );
}

// Main AboutUs component
function AboutUs() {
    // Team members data
    const teamMembers = [
        {
            imgSrc: Luis,
            name: "Luis Alfonso Diaz Vergel",
            title: "Programmer",
            roles: ["Back-End Programmer"],
            email: "ludiazv@unal.edu.co",
        },
        {
            imgSrc: Chara,
            name: "Maria Jose Jara Herrera",
            title: "Product Owner",
            roles: ["Database Programmer", "Back-End Programmer"],
            email: "mjarah@unal.edu.co",
        },
        {
            imgSrc: Jonathan,
            name: "Jonathan Steven Ochoa Celis",
            title: "Programmer",
            roles: ["Front-end Designer & Programmer"],
            email: "jsochoac@unal.edu.co",
        },
        {
            imgSrc: Sergio,
            name: "Sergio Alexander Parada Amarillo",
            title: "Programmer",
            roles: ["Front-end Designer & Programmer"],
            email: "saparadaa@unal.edu.co",
        },
    ];

    return (
        <div className="Us-container">
            <h2 className='Ustitle'>Nuestro equipo</h2>
            <div className="Uscontent">
                {teamMembers.map((member, index) => (
                    <TeamMemberCard
                        key={index}
                        imgSrc={member.imgSrc}
                        name={member.name}
                        title={member.title}
                        roles={member.roles}
                        email={member.email}
                    />
                ))}
            </div>
        </div>
    );
}

export default AboutUs;
