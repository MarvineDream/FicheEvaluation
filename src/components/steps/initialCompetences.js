"use client";

const initialCompetences = {
  savoir: [
    {
      critere: "Acquis de la formation initiale",
      description:
        "Niveau de connaissance et compétences obtenus lors de la formation de base avant l’entrée en poste.",
      note: null, // TB, B, P, I, PC
      axeAmelioration: "",
    },
    {
      critere: "Acquis de la formation continue",
      description:
        "Capacité à intégrer et appliquer les connaissances acquises lors des formations complémentaires ou mises à jour professionnelles.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Connaissance de l’entreprise",
      description:
        "Compréhension de la mission, de la vision, des valeurs, et de l’organisation générale de l’entreprise.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Connaissance des procédures liées à son activité",
      description:
        "Maîtrise des règles, processus et pratiques spécifiques à son métier ou poste.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Connaissance des logiciels d'exploitation",
      description:
        "Aptitude à utiliser efficacement les logiciels essentiels au fonctionnement opérationnel.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Connaissance des logiciels techniques/bancaires",
      description:
        "Niveau de maîtrise des outils spécifiques liés aux fonctions techniques ou bancaires propres à l’activité.",
      note: null,
      axeAmelioration: "",
    },
  ],
  savoirFaire: [
    {
      critere: "Organisation du travail",
      description: "Capacité à planifier et gérer efficacement ses tâches.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Application des procédures",
      description:
        "Respect et mise en œuvre rigoureuse des protocoles et processus établis.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Fiabilité des tâches exécutées",
      description: "Qualité et précision dans la réalisation des missions confiées.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Fiabilité des contrôles réalisés",
      description:
        "Capacité à effectuer des vérifications pertinentes garantissant la conformité et la qualité.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Reporting : Fiabilité des infos / Respect des délais",
      description:
        "Exactitude et ponctualité dans la communication des données et rapports.",
      note: null,
      axeAmelioration: "",
    },
  ],
  savoirEtre: [
    {
      critere: "Autonomie",
      description:
        "Capacité à travailler de manière indépendante sans supervision constante.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Initiative",
      description:
        "Aptitude à proposer des actions ou solutions nouvelles sans attendre d’être sollicité.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Rigueur",
      description: "Précision et sérieux dans l’exécution des tâches.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Disponibilité",
      description:
        "Accessibilité et réactivité envers les collègues et les demandes professionnelles.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Ponctualité",
      description: "Respect des horaires et délais fixés.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Courtoisie",
      description: "Respect et politesse dans les échanges avec les autres.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Travail d'équipe",
      description: "Capacité à collaborer efficacement avec les autres.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Assiduité",
      description: "Présence régulière et assidue au travail.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Présentation (habillement, coiffure.)",
      description: "Soigne et professionnelle dans l’apparence personnelle.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Humanisme",
      description:
        "Respect et considération envers les autres, favorisant un climat bienveillant.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Agilité",
      description: "Capacité à s’adapter rapidement aux changements et aux imprévus.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Résilience",
      description: "Aptitude à surmonter les difficultés et à rebondir après un échec.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Diversité",
      description: "Ouverture à la diversité culturelle, sociale et professionnelle.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Innovation",
      description: "Capacité à proposer et mettre en œuvre des idées nouvelles.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Éco-responsabilité",
      description:
        "Comportement respectueux de l’environnement dans les pratiques professionnelles.",
      note: null,
      axeAmelioration: "",
    },
  ],
  valeursHardie: [
    {
      critere: "Honnêteté",
      description: "Agir avec intégrité et transparence en toutes circonstances.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Assiduité",
      description: "Être constant, régulier et appliqué dans son travail.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Responsabilité",
      description: "Assumer pleinement ses missions et leurs conséquences.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Dynamisme",
      description: "Faire preuve d’énergie, de réactivité et d’enthousiasme.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Innovation",
      description: "Proposer des solutions nouvelles et créatives face aux défis.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Exemplarité",
      description: "Montrer l’exemple dans son comportement et ses performances.",
      note: null,
      axeAmelioration: "",
    },
  ],
  discipline: [
    {
      critere: "Respect du code de déontologie",
      description:
        "Adhésion aux principes éthiques et moraux propres à la profession.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Respect du règlement intérieur",
      description: "Application stricte des règles internes à l’entreprise.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Respect du livret sécurité informatique",
      description:
        "Conformité aux consignes de sécurité liées aux systèmes informatiques.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Respect de la charte informatique",
      description:
        "Usage responsable et conforme des outils informatiques mis à disposition.",
      note: null,
      axeAmelioration: "",
    },
    {
      critere: "Respect de la charte métier",
      description:
        "Adhésion aux bonnes pratiques et règles spécifiques à la profession exercée.",
      note: null,
      axeAmelioration: "",
    },
  ],
};

export default initialCompetences;
