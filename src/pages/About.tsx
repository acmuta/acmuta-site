import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { CommitteeLogo } from "@/components/CommitteeLogo";
import { Ph } from "@/components/Placeholder";
import { PageLoading } from "@/components/Loading";
import { Arrow } from "@/components/icons";
import { getCommittees, type Committee } from "@/lib/api";

const About = () => {
  const [committees, setCommittees] = useState<Committee[] | null>(null);

  useEffect(() => {
    getCommittees().then(setCommittees);
  }, []);

  if (!committees) return <PageLoading />;

  return (
    <div>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <span className="tag mono page-eyebrow">
              <span className="node" />
              ABOUT · EST. ON CAMPUS
            </span>
            <h1 className="page-h1">
              We're ACM
              <br />
              at <span className="amp">UTA.</span>
            </h1>
            <p className="page-intro">
              The Association for Computing Machinery at the University of Texas at
              Arlington, and one of the largest tech communities on campus.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(20px,3vw,40px)" }}>
        <div className="wrap">
          <Reveal className="ab-block">
            <div className="ab-text">
              <span className="tag mono ab-kicker">
                <span className="node" />
                WHO WE ARE
              </span>
              <h2 className="ab-h">
                Where the builders
                <br />
                end <span className="amp">up.</span>
              </h2>
              <p>
                We're where students who want to build things, learn fast, and meet
                people who care about the same stuff end up. One community, a lot of
                doors in.
              </p>
            </div>
            <Ph className="ab-photo" label="group / room shot" src="/assets/homepage/crowd.jpg" alt="ACM members gathered at a general body meeting" />
          </Reveal>

          <Reveal className="ab-block rev">
            <div className="ab-text">
              <span className="tag mono ab-kicker">
                <span className="node" />
                OPEN TO EVERYONE
              </span>
              <h2 className="ab-h">
                No major
                <br />
                required.
              </h2>
              <p>
                You don't need to be a CS major, and you don't need to already know
                how to code. Some of our most active members started with zero
                experience. If you're curious about tech, you belong here.
              </p>
            </div>
            <Ph className="ab-photo" label="workshop / hands-on" src="/assets/homepage/createmeeting.jpg" alt="Members working together on a project" />
          </Reveal>

          <Reveal className="ab-block">
            <div className="ab-text">
              <span className="tag mono ab-kicker">
                <span className="node" />
                WHAT WE ACTUALLY DO
              </span>
              <h2 className="ab-h">
                140+ events
                <br />a <span className="amp">year.</span>
              </h2>
              <p>
                Weekly workshops, semester-long projects you can put on a resume,
                research alongside faculty, socials, industry nights with companies
                that hire, and HackUTA, our flagship hackathon. Over a year it adds
                up.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 26 }}>
                <Link to="/events" className="btn btn-ghost">
                  See events <Arrow />
                </Link>
                <Link to="/hackuta" className="btn btn-ghost">
                  HackUTA <Arrow />
                </Link>
              </div>
            </div>
            <Ph className="ab-photo" label="event / crowd" src="/assets/homepage/hackathon.JPG" alt="A packed room of students at HackUTA" />
          </Reveal>

          <Reveal className="ab-block rev" style={{ borderBottom: "none" }}>
            <div className="ab-text">
              <span className="tag mono ab-kicker">
                <span className="node" />
                HOW WE'RE ORGANIZED
              </span>
              <h2 className="ab-h">
                Six committees,
                <br />
                one org.
              </h2>
              <p style={{ marginBottom: 22 }}>
                Each has its own focus. Join one, jump between events, or just show
                up to whatever interests you.
              </p>
            </div>
            <ul className="ab-orglist">
              {committees.map((c) => (
                <li key={c.id}>
                  <Link to={`/${c.slug}`}>
                    <CommitteeLogo committee={c} size={22} />
                    <span className="nm">{c.name}</span>
                    <span className="ar">
                      <Arrow s={15} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default About;
