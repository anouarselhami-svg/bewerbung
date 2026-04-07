import { motion } from 'framer-motion'
import {
  Briefcase,
  GraduationCap,
  FileText,
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  ShieldCheck,
  Globe,
  Phone,
  Sparkles,
  Wrench,
  ChefHat,
  HeartHandshake,
  Car,
  Building2,
  Stethoscope,
  Hammer,
  Truck,
  Laptop,
  Factory,
  ShoppingBag,
  Utensils,
} from 'lucide-react'
import heroPoster from './assets/hero.png'
import { Card, CardContent } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import './App.css'

const Animated = motion

const WHATSAPP_NUMBER = '212600000000'

const buildBranchDetails = ({ duration, city, salary, documents, visa, deadline }) => [
  'Niveau requis: B1-B2',
  `Durée: ${duration}`,
  `Ville/Région: ${city}`,
  `Salaire moyen: ${salary}`,
  `Documents nécessaires: ${documents}`,
  `Statut visa: ${visa}`,
  `Date limite pour postuler: ${deadline}`,
]

const branches = [
  {
    title: 'Pflege',
    subtitle: 'Soins infirmiers / aide soignant',
    icon: HeartHandshake,
    details: buildBranchDetails({
      duration: '3 ans',
      city: 'Berlin / Hamburg',
      salary: '2400-3200 EUR',
      documents: 'CV, passeport, diplôme',
      visa: 'Contrat + dossier complet',
      deadline: '30/09/2026',
    }),
  },
  {
    title: 'Koch / Köchin',
    subtitle: 'Cuisine / restauration',
    icon: ChefHat,
    details: buildBranchDetails({
      duration: '2-3 ans',
      city: 'Munich / Cologne',
      salary: '2100-2900 EUR',
      documents: 'CV, lettre de motivation, certificats',
      visa: 'Contrat employeur',
      deadline: '15/10/2026',
    }),
  },
  {
    title: 'Mechaniker/in',
    subtitle: 'Mécanique automobile et industrielle',
    icon: Wrench,
    details: buildBranchDetails({
      duration: '3 ans',
      city: 'Stuttgart / Dortmund',
      salary: '2500-3400 EUR',
      documents: 'CV, attestations techniques',
      visa: 'Qualification reconnue',
      deadline: '10/10/2026',
    }),
  },
  {
    title: 'Mechatroniker/in',
    subtitle: 'Mécatronique',
    icon: Factory,
    details: buildBranchDetails({
      duration: '3.5 ans',
      city: 'Bremen / Hanover',
      salary: '2600-3600 EUR',
      documents: 'CV, diplôme, expérience',
      visa: 'Contrat + assurance',
      deadline: '01/11/2026',
    }),
  },
  {
    title: 'Elektriker/in',
    subtitle: 'Électricité bâtiment / industrie',
    icon: Hammer,
    details: buildBranchDetails({
      duration: '3 ans',
      city: 'Frankfurt / Leipzig',
      salary: '2400-3300 EUR',
      documents: 'CV, certificats professionnels',
      visa: 'Équivalence utile',
      deadline: '20/10/2026',
    }),
  },
  {
    title: 'Lagerlogistik',
    subtitle: 'Logistique / entrepôt',
    icon: Truck,
    details: buildBranchDetails({
      duration: '2-3 ans',
      city: 'Duisburg / Nuremberg',
      salary: '2100-2800 EUR',
      documents: 'CV, pièce d’identité',
      visa: 'Offre + logement conseillé',
      deadline: '05/11/2026',
    }),
  },
  {
    title: 'Verkäufer/in',
    subtitle: 'Vente / magasin',
    icon: ShoppingBag,
    details: buildBranchDetails({
      duration: '2-3 ans',
      city: 'Berlin / Essen',
      salary: '2000-2700 EUR',
      documents: 'CV, lettre de motivation',
      visa: 'Contrat de travail requis',
      deadline: '12/10/2026',
    }),
  },
  {
    title: 'Hotellerie',
    subtitle: 'Hôtellerie',
    icon: Building2,
    details: buildBranchDetails({
      duration: '2-3 ans',
      city: 'Hamburg / Berlin',
      salary: '2100-2900 EUR',
      documents: 'CV, références',
      visa: 'Contrat + hébergement',
      deadline: '25/10/2026',
    }),
  },
  {
    title: 'Gastronomie',
    subtitle: 'Service / restaurant',
    icon: Utensils,
    details: buildBranchDetails({
      duration: '2-3 ans',
      city: 'Cologne / Bonn',
      salary: '2000-2800 EUR',
      documents: 'CV, disponibilité',
      visa: 'Contrat employeur',
      deadline: '08/11/2026',
    }),
  },
  {
    title: 'Altenpflege',
    subtitle: 'Soins aux personnes âgées',
    icon: Stethoscope,
    details: buildBranchDetails({
      duration: '3 ans',
      city: 'Dresden / Hanover',
      salary: '2500-3400 EUR',
      documents: 'CV, diplôme, casier',
      visa: 'Dossier santé complet',
      deadline: '30/10/2026',
    }),
  },
  {
    title: 'KFZ-Technik',
    subtitle: 'Maintenance automobile',
    icon: Car,
    details: buildBranchDetails({
      duration: '3 ans',
      city: 'Stuttgart / Wolfsburg',
      salary: '2500-3500 EUR',
      documents: 'CV, attestation atelier',
      visa: 'Contrat + qualification',
      deadline: '14/11/2026',
    }),
  },
  {
    title: 'IT Support',
    subtitle: 'Support informatique',
    icon: Laptop,
    details: buildBranchDetails({
      duration: '2-3 ans',
      city: 'Berlin / Munich',
      salary: '2800-3800 EUR',
      documents: 'CV, projets, certificats',
      visa: 'Contrat tech',
      deadline: '22/11/2026',
    }),
  },
]

const createWhatsAppLink = (branchTitle) => {
  const text = `Bonjour, je veux plus d'informations sur la filière ${branchTitle} en Allemagne.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

const services = [
  { icon: FileText, title: 'Lebenslauf / CV', description: "Des CV modernes et professionnels au format allemand, adaptés aux emplois, à l'Ausbildung, aux stages et aux apprentissages." },
  { icon: FileText, title: 'Bewerbung complète', description: "Nous préparons tout votre dossier de candidature : Anschreiben, Lebenslauf, optimisation du profil et organisation des documents utiles." },
  { icon: Search, title: "Recherche d'emploi et d'Ausbildung", description: "Nous recherchons des offres pertinentes en Allemagne selon votre profil, votre niveau de langue, votre expérience et la ville visée." },
  { icon: Mail, title: "Gestion des contacts d'entreprises", description: "Nous organisons les emails RH officiels, les contacts carrière et les canaux de candidature pour garder une démarche sérieuse et structurée." },
  { icon: Globe, title: 'Accompagnement pour le marché allemand', description: "Nous vous aidons à comprendre le processus de candidature en Allemagne, les attentes, les documents nécessaires et les erreurs à éviter." },
  { icon: ShieldCheck, title: 'Suivi des candidatures', description: 'Nous vous aidons à suivre les candidatures envoyées, les réponses, les demandes d’entretien et les prochaines étapes.' },
]

const steps = [
  { number: '01', title: 'Analyse du profil', text: "Nous analysons votre parcours scolaire, votre expérience, votre niveau de langue et vos objectifs professionnels." },
  { number: '02', title: 'Préparation des documents', text: "Nous créons ou améliorons votre Lebenslauf et votre Bewerbung complète dans un format solide et adapté à l'Allemagne." },
  { number: '03', title: "Recherche d'offres", text: "Nous trouvons des emplois ou des Ausbildung adaptés et nous organisons les contacts utiles des entreprises." },
  { number: '04', title: 'Accompagnement à la candidature', text: "Nous vous aidons pour l'envoi, la structure des emails, le suivi et la préparation aux entretiens." },
]

const highlights = [
  'Pour les chercheurs d’emploi et les candidats en Ausbildung',
  'Documents de candidature professionnels au format allemand',
  'Recherche ciblée selon votre profil',
  "Organisation des contacts d'entreprises et du suivi",
  'Processus clair et simple pour les débutants',
  'Accompagnement à distance du début jusqu’à la candidature',
]

const faq = [
  { q: 'À qui s’adresse ce service ?', a: "Ce service s'adresse à toute personne qui veut postuler à un emploi ou à une Ausbildung en Allemagne, surtout les débutants qui ont besoin d'aide pour les documents et le processus." },
  { q: 'Est-ce que vous préparez toute la Bewerbung ?', a: 'Oui. Nous pouvons vous aider à préparer toute la Bewerbung, y compris le Lebenslauf, la lettre de motivation et l’organisation des informations importantes.' },
  { q: 'Est-ce que vous cherchez les opportunités pour moi ?', a: 'Oui. Nous identifions des opportunités adaptées et nous vous aidons à organiser les contacts carrière et les canaux de candidature des entreprises.' },
  { q: 'Pouvez-vous m’aider même si mon allemand n’est pas parfait ?', a: 'Oui. Nous adaptons vos documents à votre niveau actuel et nous vous guidons sur ce qui est réaliste pour votre profil.' },
]

const stats = [
  { value: 'CV', label: 'Préparé professionnellement' },
  { value: 'Bewerbung', label: 'Accompagnement dossier complet' },
  { value: 'Offres', label: 'Recherche ciblée' },
  { value: 'Emails', label: 'Organisation des contacts RH' },
]

const promoVideoSrc = '/ad-video.mp4'
const consultationLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour, je veux une consultation pour ma candidature en Allemagne.')}`

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function App() {
  return (
    <div className="page-shell">
      <section className="hero-section">
        <div className="hero-glow" />
        <div className="hero-glow hero-glow-alt" />

        <header className="topbar">
          <div className="brand">
            <div className="brand-mark"><Briefcase className="icon-sm" /></div>
            <div>
              <p className="brand-title">Service Carrière Allemagne</p>
              <p className="brand-subtitle">Emploi • Ausbildung • Aide à la candidature</p>
            </div>
          </div>
          <p className="topbar-note">Accompagnement professionnel pour candidater en Allemagne</p>
        </header>

        <div className="hero-grid">
          <Animated.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="hero-copy">
            <div className="eyebrow"><Sparkles className="icon-xs" /> Accompagnement complet pour travailler ou se former en Allemagne</div>

            <h1>Construisez votre chemin vers un <span>emploi</span> ou une <span className="blue">Ausbildung</span> en Allemagne.</h1>

            <p className="hero-text">Nous vous aidons avec votre <strong>Lebenslauf</strong>, votre <strong>Bewerbung complète</strong>, la recherche ciblée d’opportunités et une organisation claire des contacts officiels des entreprises et des RH.</p>

            <div className="hero-actions">
              <Button
                size="lg"
                className="rounded-2xl px-6 text-base"
                onClick={() => scrollToSection('contact')}
                aria-label="Aller au formulaire de contact"
              >
                Commencer ma candidature <ArrowRight className="icon-xs ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl border-white/20 bg-white/5 px-6 text-base text-white hover:bg-white/10"
                onClick={() => scrollToSection('services-list')}
                aria-label="Voir la section des services"
              >
                Voir les services
              </Button>
            </div>

            <div className="highlight-grid">
              {highlights.slice(0, 4).map((item) => (
                <div key={item} className="info-card"><CheckCircle2 className="icon-sm success" /><p>{item}</p></div>
              ))}
            </div>
          </Animated.div>

          <Animated.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="hero-panel">
            <div className="stats-grid">
              {stats.map((stat) => (
                <Card key={stat.label} className="glass-card stat-card"><CardContent className="card-content"><p className="stat-value">{stat.value}</p><p className="stat-label">{stat.label}</p></CardContent></Card>
              ))}
            </div>

            <Card className="glass-card spotlight-card">
              <CardContent className="card-content">
                <div className="section-heading">
                  <div className="badge-icon"><GraduationCap className="icon-sm blue-text" /></div>
                  <div>
                    <h3>Ce que nous pouvons faire pour vous</h3>
                    <p>Un service simple et complet pour candidater en Allemagne</p>
                  </div>
                </div>
                <div className="check-list">
                  {['Préparation du Lebenslauf', 'Rédaction et structuration de la Bewerbung', 'Recherche d’opportunités adaptées', "Organisation des contacts officiels d'entreprises", 'Suivi et accompagnement'].map((line) => (
                    <div key={line} className="check-row"><CheckCircle2 className="icon-xs success" /><span>{line}</span></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Animated.div>
        </div>
      </section>

      <section className="content-section video-section" id="video">
        <div className="section-intro narrow">
          <p className="section-kicker">Vidéo promotionnelle</p>
          <h2>Une vidéo pour présenter notre service</h2>
          <p>
            Ajoutez ici votre vraie vidéo de présentation. Le bouton visible dans la vidéo dirige
            les visiteurs vers la page des services afin qu’ils puissent découvrir ce que nous
            proposons.
          </p>
        </div>

        <div className="video-frame">
          <video
            className="promo-video"
            controls
            playsInline
            muted
            loop
            autoPlay
            poster={heroPoster}
          >
            <source src={promoVideoSrc} type="video/mp4" />
          </video>

          <div className="video-overlay">
            <div className="video-badge">
              <Sparkles className="icon-xs" />
              Présentation de notre service
            </div>

            <div className="video-overlay-copy">
              <h3>Regardez la vidéo et découvrez comment nous aidons les candidats</h3>
              <p>
                Le lien ci-dessous peut être placé aussi dans la description de la vidéo ou dans
                le bouton à l’écran pour renvoyer les intéressés vers le site.
              </p>
            </div>

            <a className="ui-button button-default button-md video-cta" href="#services-list">
              Voir nos services
            </a>
          </div>
        </div>
      </section>

      <section className="content-section" id="services-list">
        <div className="section-intro">
          <p className="section-kicker">Choisissez une filière</p>
          <h2>Cliquez sur une branche et posez-nous vos questions directement sur WhatsApp</h2>
          <p>Nous vous accompagnons pour les métiers et formations les plus recherchés en Allemagne. Dès qu’un visiteur clique sur une filière, il est redirigé vers WhatsApp avec un message prêt à envoyer.</p>
        </div>

        <div className="branch-grid">
          {branches.map((branch, index) => {
            const Icon = branch.icon
            return (
              <Animated.a key={branch.title} href={createWhatsAppLink(branch.title)} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.04 }} className="branch-link">
                <Card className="glass-card branch-card">
                  <CardContent className="card-content">
                    <div className="branch-icon-wrap"><Icon className="icon-md success-text" /></div>
                    <h3>{branch.title}</h3>
                    <p>{branch.subtitle}</p>
                    <ul className="branch-details">
                      {branch.details.map((detail) => (
                        <li key={detail} className="branch-detail-item">
                          <AlertCircle className="icon-xs" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pill-link">Poser une question sur WhatsApp <ArrowRight className="icon-xs" /></div>
                  </CardContent>
                </Card>
              </Animated.a>
            )
          })}
        </div>
      </section>

      <section className="content-section">
        <div className="section-intro narrow">
          <p className="section-kicker">Nos services</p>
          <h2>Tout ce qu’il faut pour postuler avec confiance</h2>
          <p>Un service complet pour les candidats qui veulent construire un dossier solide pour le marché allemand.</p>
        </div>

        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Animated.div key={service.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.05 }}>
                <Card className="glass-card service-card">
                  <CardContent className="card-content">
                    <div className="service-icon-wrap"><Icon className="icon-sm success-text" /></div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </CardContent>
                </Card>
              </Animated.div>
            )
          })}
        </div>
      </section>

      <section className="split-section">
        <div className="split-wrap">
          <div className="split-copy">
            <p className="section-kicker blue-kicker">Comment ça marche</p>
            <h2>Un processus simple étape par étape</h2>
            <p>Nous gardons le processus clair et bien organisé, surtout pour les personnes qui postulent pour la première fois.</p>

            <div className="step-list">
              {steps.map((step) => (
                <div key={step.number} className="step-card">
                  <div className="step-number">{step.number}</div>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="split-side">
            <Card className="glass-card side-card"><CardContent className="card-content"><h3>Pourquoi les clients choisissent ce service</h3><div className="check-list large">{highlights.map((item) => (<div key={item} className="check-row"><CheckCircle2 className="icon-sm success" /><p>{item}</p></div>))}</div></CardContent></Card>
            <Card className="glass-card side-card alt-card"><CardContent className="card-content"><h3>Idéal pour</h3><div className="tag-grid">{['Étudiants', 'Jeunes diplômés', 'Débutants dans les candidatures allemandes', 'Candidats en Ausbildung', 'Personnes qui veulent partir travailler en Allemagne', 'Personnes ayant besoin d’aide pour leurs documents'].map((group) => (<div key={group} className="tag-item">{group}</div>))}</div></CardContent></Card>
          </div>
        </div>
      </section>

      <section className="content-section faq-section">
        <div className="section-intro narrow">
          <p className="section-kicker">FAQ</p>
          <h2>Questions les plus fréquentes</h2>
          <p>Des réponses claires pour les candidats qui veulent comprendre le service avant de commencer.</p>
        </div>

        <div className="faq-list">
          {faq.map((item) => (
            <details key={item.q} className="faq-item"><summary><span>{item.q}</span><span className="faq-arrow">⌄</span></summary><p>{item.a}</p></details>
          ))}
        </div>
      </section>

      <section className="content-section cta-section" id="contact">
        <Card className="glass-card cta-card">
          <CardContent className="cta-content card-content">
            <div>
              <p className="section-kicker">Commencer</p>
              <h2>Prêt à préparer votre candidature pour l’Allemagne ?</h2>
              <p>Envoyez-nous votre profil et nous vous aiderons à préparer un parcours professionnel pour les emplois ou les opportunités d’Ausbildung.</p>
              <div className="cta-meta"><span className="meta-item"><Phone className="icon-xs" /> Support WhatsApp / appel</span><span className="meta-item"><Mail className="icon-xs" /> Suivi par email</span></div>
            </div>

            <div className="cta-form">
              <Input placeholder="Votre nom complet" />
              <Input placeholder="Votre email" />
              <Input placeholder="Métier ou Ausbildung visé" />
              <a className="ui-button button-default button-md cta-button" href={consultationLink} target="_blank" rel="noreferrer">
                Demander une consultation <ArrowRight className="icon-xs ml-2" />
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
