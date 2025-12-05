import React from "react";
import { useNavigate } from "react-router-dom";
// =================================================================
// 1. DÉFINITION DES INTERFACES TYPESCRIPT
// =================================================================

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: string; // Emoji comme placeholder pour l'icône
}

interface AuftragsStep {
  id: number;
  title: string;
  image: string; // Emoji comme placeholder pour l'icône
}

// =================================================================
// 2. DONNÉES DUMMY (EN FRANÇAIS)
// =================================================================

const placementProcess: ProcessStep[] = [
  {
    id: 1,
    title: "Detaillierte Bedarfsanalyse",
    description:
      "Wir tauchen tief in Ihre Anforderungen und das Stellenprofil ein , um ein präzises und realistisches Rekrutierungsziel festzulegen.",
    icon: "🔍",
  },
  {
    id: 2,
    title: "Vorstellung geeigneter Subunternehmer",
    description:
      "Wir stellen Ihnen eine Auswahlliste der relevantesten Profile vor, die bereit sind, Ihr Projekt umzusetzen. Organisation der Abschlussgespräche.",
    icon: "📝",
  },
  {
    id: 3,
    title: "Entscheidungsunterstützung und Integration",
    description:
      "Wir unterstützen Sie von den Gehaltsverhandlungen bis zur Vertragsunterzeichnung. Wir sorgen für eine Nachbetreuung nach der Einstellung, um eine nachhaltige Integration und Zufriedenheit zu gewährleisten.",
    icon: "✅",
  },
];

const aufträgeSubunternehmen: AuftragsStep[] = [
  {
    id: 1,
    title: "Malerarbeiten",
    image: require("../../../images/1.png"),
  },
  {
    id: 2,
    title: "Elektroinstallationen",
    image: require("../../../images/2.png"),
  },
  {
    id: 3,
    title: "Bauplanung",
    image: require("../../../images/3.png"),
  },
];

// =================================================================
// 3. COMPOSANTS RÉACT
// =================================================================

/**
 * Composant représentant une étape du processus de placement.
 */
const ProcessStepCard: React.FC<ProcessStep> = ({
  icon,
  title,
  description,
}) => (
  <div style={styles.card}>
    <div style={styles.cardIcon}>{icon}</div>
    <h3 style={styles.cardTitle}>{title}</h3>
    <p style={styles.cardDescription}>{description}</p>
  </div>
);
const AuftragStepCard: React.FC<AuftragsStep> = ({ image, title }) => (
  <div style={styles.card}>
    <div style={styles.cardImage}>
      <img src={image} alt={title} />
    </div>
    <h3 style={styles.cardTitle}>{title}</h3>
  </div>
);

/**
 * Le composant principal de la page de Placement de Personnel.
 */
const PagesHome: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.pageContainer}>
      {/* 1. SECTION HERO / BANDEAU PRINCIPAL */}
      <header style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Ihr Expertenpartner für Personalvermittlung im Bauwesen
          </h1>
          <p style={styles.heroSubtitle}>
            Wir verbinden Sie mit den besten Subunternehmern. Finden Sie schnell
            und präzise die qualifizierten Profile, die den Unterschied machen.
          </p>
          <button
            style={styles.ctaButton}
            onClick={() => navigate("/kunde-formular")}
          >
            Fangen Sie jetzt mit Ihrer Suche an
          </button>
        </div>
      </header>

      <hr style={styles.hr} />

      {/* 2. SECTION INTRODUCTION ET VALEUR AJOUTÉE */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Warum sollten Sie sich für unseren Service entscheiden ?
        </h2>
        <p style={styles.introText}>
          Angesichts des harten Wettbewerbs um die besten Fachkräfte ist die
          Suche nach dem idealen Kandidaten keine reine Verwaltungsaufgabe,
          sondern ein strategischer Schlüsselfaktor für den Erfolg Ihrer
          Bauprojekte. Wir verstehen Ihre Bedürfnisse genau und stützen uns auf
          eine bewährte Methodik, um die Experten zu finden, die sich perfekt in
          Ihr Team integrieren und Ihre Bauprojekte vorantreiben.
        </p>
        <div style={styles.valuePropsGrid}>
          <div style={styles.valuePropItem}>
            <h3>Zeitgewinn</h3>
            <p>
              Konzentrieren Sie sich auf Ihr Projekt, wir kümmern uns um den
              gesamten Personalauswahlprozess.
            </p>
          </div>
          <div style={styles.valuePropItem}>
            <h3>Qualitätssicherung </h3>
            <p>
              Greifen Sie auf einen Pool von Subunternehmern zu, den Sie mit
              Ihren eigenen Mitteln nicht erreichen könnten.
            </p>
          </div>
          <div style={styles.valuePropItem}>
            <h3>Branchenexpertise</h3>
            <p>
              Unsere Berater sind spezialisiert und beherrschen das Gebiet des
              Hochbaus in all seinen Formen.
            </p>
          </div>
        </div>
      </section>

      <hr style={styles.hr} />

      {/* 3. SECTION NOTRE PROCESSUS (Similaire aux 4 étapes du site) */}
      <section style={{ ...styles.section, backgroundColor: "#f9f9f9" }}>
        <h2 style={styles.sectionTitle}>Aufträge für Subunternehmer</h2>
        <div style={styles.processGrid}>
          {aufträgeSubunternehmen.map((step) => (
            <AuftragStepCard key={step.id} {...step} />
          ))}
        </div>
      </section>

      <hr style={styles.hr} />
      {/* 3. SECTION NOTRE PROCESSUS (Similaire aux 4 étapes du site) */}
      <section style={{ ...styles.section, backgroundColor: "#f9f9f9" }}>
        <h2 style={styles.sectionTitle}>Unsere 3 Schritte zum Projekterfolg</h2>
        <div style={styles.processGrid}>
          {placementProcess.map((step) => (
            <ProcessStepCard key={step.id} {...step} />
          ))}
        </div>
      </section>
      <hr style={styles.hr} />
      {/* 4. SECTION APPEL À L'ACTION FINAL */}
      <section style={styles.finalCtaSection}>
        <h2 style={styles.finalCtaTitle}>
          Sind Sie bereit, Ihren nächsten Subunternehmer zu finden?
        </h2>
        <p style={styles.finalCtaText}>
          Kontaktieren Sie uns noch heute für eine freibleibende Beratung und
          erfahren Sie, wie wir arbeiten.
        </p>
        <button
          style={styles.ctaButton}
          onClick={() => navigate("/kunde-formular")}
        >
          Einen kostenlosen Beratungstermin vereinbaren
        </button>
      </section>

      <footer style={styles.footer}>
        <p>&copy; 2025 Arbeitsagentur. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default PagesHome;

// =================================================================
// 4. STYLES (Utilisation de Styles Inline pour l'exemple)
// =================================================================

// NOTE: Dans un projet réel, il est fortement recommandé d'utiliser des CSS Modules, Tailwind CSS, ou Styled-Components.

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    fontFamily: "Arial, sans-serif",
    lineHeight: 1.6,
    color: "#333",
  },

  // Hero Section
  heroSection: {
    padding: "80px 20px",
    backgroundColor: "#004a80", // Bleu foncé institutionnel
    color: "white",
    textAlign: "center",
    backgroundImage: 'url("https://via.placeholder.com/1920x400")', // Placeholder pour l'image
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  heroContent: {
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Surcouche sombre pour lisibilité
    padding: "30px",
    borderRadius: "8px",
  },
  heroTitle: {
    fontSize: "2.8em",
    marginBottom: "15px",
    fontWeight: 700,
  },
  heroSubtitle: {
    fontSize: "1.2em",
    marginBottom: "30px",
  },

  // General Section
  section: {
    padding: "60px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "2em",
    color: "#004a80",
    textAlign: "center",
    marginBottom: "40px",
  },
  introText: {
    fontSize: "1.1em",
    maxWidth: "800px",
    margin: "0 auto 40px",
    textAlign: "center",
  },

  // Value Proposition Grid
  valuePropsGrid: {
    display: "flex",
    justifyContent: "space-around",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "30px",
  },
  valuePropItem: {
    flex: "1 1 300px",
    textAlign: "center",
    padding: "20px",
    borderLeft: "3px solid #ff9900", // Couleur d'accent
  },

  // Process Grid
  processGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    marginTop: "30px",
  },

  // Process Card
  card: {
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "25px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.3s",
  },
  cardIcon: {
    fontSize: "3em",
    marginBottom: "15px",
  },
  cardTitle: {
    fontSize: "1.3em",
    color: "#004a80",
    marginBottom: "10px",
  },
  cardDescription: {
    fontSize: "1em",
    color: "#666",
  },

  // CTA Button
  ctaButton: {
    backgroundColor: "#ff9900", // Orange/Jaune pour le CTA
    color: "white",
    border: "none",
    padding: "12px 25px",
    fontSize: "1.1em",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },

  // Final CTA Section
  finalCtaSection: {
    padding: "80px 20px",
    backgroundColor: "#004a80",
    color: "white",
    textAlign: "center",
  },
  finalCtaTitle: {
    fontSize: "2.5em",
    marginBottom: "15px",
  },
  finalCtaText: {
    fontSize: "1.1em",
    marginBottom: "30px",
  },

  // Footer
  footer: {
    backgroundColor: "#333",
    color: "white",
    padding: "20px",
    textAlign: "center",
    fontSize: "0.9em",
  },

  // Separator
  hr: {
    border: "none",
    borderTop: "1px solid #eee",
    margin: "0 5% 0 5%",
  },
};
