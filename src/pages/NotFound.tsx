import { Link } from "react-router-dom";
import { NodeField } from "@/components/NodeField";
import { Arrow } from "@/components/icons";

const NotFound = () => (
  <div>
    <section className="nf">
      <div className="nf-canvas">
        <NodeField density={0.6} />
      </div>
      <div className="wrap nf-in">
        <span
          className="tag mono"
          style={{ justifyContent: "center", marginBottom: 18 }}
        >
          <span className="node" />
          BROKEN LINK · LOST NODE
        </span>
        <h1 className="nf-code display">
          4<span className="amp">0</span>4
        </h1>
        <p
          style={{
            color: "var(--text-dim)",
            fontSize: "1.2rem",
            margin: "20px auto 30px",
            maxWidth: "32ch",
          }}
        >
          This page isn't connected to anything. Even our graph has dead ends.
        </p>
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" className="btn btn-primary">
            Back home <Arrow />
          </Link>
          <Link to="/events" className="btn btn-ghost">
            See events <Arrow />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default NotFound;
