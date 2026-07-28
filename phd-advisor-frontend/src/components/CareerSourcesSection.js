import React from 'react';

const SOURCE_CARDS = [
  {
    title: 'What employers look for',
    image: '/career-sources/employers-look-for.png',
    blurb: 'NACE-backed skills employers scan for on early-career resumes: problem solving, teamwork, communication, and more.',
    href: 'https://www.naceweb.org/talent-acquisition/candidate-selection/what-are-employers-looking-for-when-reviewing-college-students-resumes',
    linkLabel: 'NACE resume research',
  },
  {
    title: 'Campus recruiting map',
    image: '/career-sources/campus-recruiting-timeline.png',
    blurb: 'How universities and employers run early-talent recruiting — fairs, Handshake, interviews, and offer season.',
    href: 'https://www.colorado.edu/career/',
    linkLabel: 'CU Career Services',
  },
  {
    title: 'Networking playbook',
    image: '/career-sources/networking-map.png',
    blurb: 'Alumni tools, informational interviews, and outreach habits from top university career centers.',
    href: 'https://career.ucla.edu/blog/2024/08/08/how-to-use-linkedins-alumni-tool-for-networking/',
    linkLabel: 'UCLA LinkedIn alumni guide',
  },
];

const CareerSourcesSection = () => (
  <section className="career-sources-section" aria-labelledby="career-sources-title">
    <h3 id="career-sources-title" className="features-title">Recruiting sources & visuals</h3>
    <p className="career-sources-intro">
      Grounded in university career centers, NACE employer research, and official company university pages.
      Upload the docs in <code>docs/career_knowledge/</code> during chat for even sharper advisor answers.
    </p>
    <div className="career-sources-grid">
      {SOURCE_CARDS.map((card) => (
        <article key={card.title} className="career-source-card">
          <img src={card.image} alt="" className="career-source-image" loading="lazy" />
          <h4 className="feature-title">{card.title}</h4>
          <p className="feature-description">{card.blurb}</p>
          <a className="career-source-link" href={card.href} target="_blank" rel="noopener noreferrer">
            {card.linkLabel} →
          </a>
        </article>
      ))}
    </div>
  </section>
);

export default CareerSourcesSection;
