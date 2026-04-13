import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
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
import { Card, CardContent } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import './App.css'

const Animated = motion

const WHATSAPP_RECIPIENTS = ['212602910235', '212664879503']
const WHATSAPP_ROUTING_KEY = 'whatsapp-routing-index'
const DEFAULT_SITE_ORIGIN = 'https://testservice-mu.vercel.app'

const resolveApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL?.trim()

  if (envBase) {
    return envBase
  }

  if (typeof window === 'undefined') {
    return ''
  }

  const host = window.location.hostname.toLowerCase()

  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return ''
  }

  if (host.includes('translate.goog') || host.includes('translate.google')) {
    return DEFAULT_SITE_ORIGIN
  }

  return DEFAULT_SITE_ORIGIN
}

const API_BASE_URL = resolveApiBaseUrl()

const trackAnalyticsEvent = async (eventType, source, metadata = {}) => {
  const payload = {
    eventType,
    path: typeof window !== 'undefined' ? window.location.pathname : '/',
    source,
    metadata,
  }

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    navigator.sendBeacon(`${API_BASE_URL}/api/analytics/events`, blob)
    return
  }

  try {
    await fetch(`${API_BASE_URL}/api/analytics/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    // Ignore analytics failures to keep primary flows responsive.
  }
}

const formatWhatsAppNumber = (phoneNumber) => `+${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 9)} ${phoneNumber.slice(9)}`

const whatsappNumbersFormatted = WHATSAPP_RECIPIENTS.map(formatWhatsAppNumber).join(' / ')

const buildBranchDetails = ({ duration, city, salary, documents, deadline }) => [
  'Niveau requis: B1-B2',
  `Durée: ${duration}`,
  `Ville/Région: ${city}`,
  `Salaire moyen: ${salary}`,
  `Documents nécessaires: ${documents}`,
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
      deadline: '22/11/2026',
    }),
  },
]

const getNextWhatsAppRecipient = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return WHATSAPP_RECIPIENTS[0]
  }

  const storedIndex = Number.parseInt(window.localStorage.getItem(WHATSAPP_ROUTING_KEY) ?? '0', 10)
  const safeIndex = Number.isNaN(storedIndex) ? 0 : storedIndex

  return WHATSAPP_RECIPIENTS[safeIndex % WHATSAPP_RECIPIENTS.length]
}

const advanceWhatsAppRecipient = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  const storedIndex = Number.parseInt(window.localStorage.getItem(WHATSAPP_ROUTING_KEY) ?? '0', 10)
  const safeIndex = Number.isNaN(storedIndex) ? 0 : storedIndex
  const nextIndex = (safeIndex + 1) % WHATSAPP_RECIPIENTS.length

  window.localStorage.setItem(WHATSAPP_ROUTING_KEY, String(nextIndex))
}

const buildWhatsAppLink = (phoneNumber, text) => `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`

const openRotatingWhatsAppLink = (text) => {
  const recipient = getNextWhatsAppRecipient()
  const link = buildWhatsAppLink(recipient, text)

  advanceWhatsAppRecipient()
  window.open(link, '_blank', 'noopener,noreferrer')
}

const createWhatsAppLink = (branchTitle) => {
  const text = `Bonjour, je veux plus d'informations sur la filière ${branchTitle} en Allemagne.`
  return buildWhatsAppLink(getNextWhatsAppRecipient(), text)
}

const services = [
  { icon: Search, title: "Collecte d'emails d'entreprises", description: 'Nous trouvons les emails RH utiles selon votre profil.' },
  { icon: Mail, title: 'Envoi des contacts aux clients', description: 'Nous vous envoyons une liste claire d’emails d’entreprises.' },
  { icon: FileText, title: 'Traduction des dossiers', description: 'Nous traduisons CV, lettres et documents essentiels.' },
  { icon: Globe, title: 'Informations et consultations', description: 'Nous donnons des infos pratiques et des consultations rapides.' },
  { icon: ShieldCheck, title: 'Conseils de candidature', description: 'Nous vous guidons pour mieux contacter les entreprises.' },
]

const steps = [
  { number: '01', title: 'Analyse du besoin', text: 'On définit votre profil et votre cible.' },
  { number: '02', title: 'Collecte des emails', text: 'On prépare les contacts RH utiles.' },
  { number: '03', title: 'Traduction du dossier', text: 'On traduit les documents importants.' },
  { number: '04', title: 'Consultation et orientation', text: 'On vous guide pour les prochaines étapes.' },
]

const highlights = [
  'Emails d’entreprises ciblés',
  'Contacts envoyés rapidement',
  'Traduction des dossiers de candidature',
  'Infos pratiques utiles',
  'Consultations personnalisées',
  'Accompagnement simple',
]

const faq = [
  { q: 'À qui s’adresse ce service ?', a: 'À toute personne qui veut candidater en Allemagne.' },
  { q: 'Est-ce que vous gérez le visa ?', a: 'Non, nous ne gérons pas le visa.' },
  { q: 'Vous faites quoi exactement ?', a: 'Emails d’entreprises, traduction de dossier, infos et consultations.' },
  { q: 'Vous aidez si mon allemand est faible ?', a: 'Oui, nous adaptons les documents à votre niveau.' },
]

const stats = [
  { value: 'CV', label: 'Préparé professionnellement' },
  { value: 'Bewerbung', label: 'Accompagnement dossier complet' },
  { value: 'Offres', label: 'Recherche ciblée' },
  { value: 'Emails', label: 'Organisation des contacts RH' },
]

const servicesPlaceholderImage = '/services-placeholder.svg'
const sitePublicUrl = 'https://service-deutschland.vercel.app/'
const siteQrImage = '/qr-service-for-deutschland.png'
const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const supportEmail = 'baloua96@hotmail.fr'

const teamMembers = [
  { name: 'Contact 1', phone: '212664879503', specialties: ['Pflege', 'Altenpflege', 'IT Support', 'Koch / Köchin', 'Gastronomie', 'Hotellerie'] },
  { name: 'Contact 2', phone: '212602910235', specialties: ['Pflege', 'Altenpflege', 'IT Support', 'Koch / Köchin', 'Gastronomie', 'Hotellerie'] },
]

const applicationRoutingKey = 'application-routing-index'

const getNextApplicationMember = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return teamMembers[0]
  }

  const storedIndex = Number.parseInt(window.localStorage.getItem(applicationRoutingKey) ?? '0', 10)
  const safeIndex = Number.isNaN(storedIndex) ? 0 : storedIndex

  return teamMembers[safeIndex % teamMembers.length]
}

const advanceApplicationMember = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  const storedIndex = Number.parseInt(window.localStorage.getItem(applicationRoutingKey) ?? '0', 10)
  const safeIndex = Number.isNaN(storedIndex) ? 0 : storedIndex
  const nextIndex = (safeIndex + 1) % teamMembers.length

  window.localStorage.setItem(applicationRoutingKey, String(nextIndex))
}

const createRegistrationMessage = ({ name, email, domain, level }) => {
  return [
    'Bonjour, je veux m’inscrire au service.',
    `Nom: ${name || 'Non renseigné'}`,
    `Email: ${email || 'Non renseigné'}`,
    `Domaine choisi: ${domain}`,
    `Niveau de langue: ${level}`,
    'Je souhaite continuer avec un conseiller.',
  ].join('\n')
}

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function App() {
  const [candidateName, setCandidateName] = useState('')
  const [candidateEmail, setCandidateEmail] = useState('')
  const [candidateWebsite, setCandidateWebsite] = useState('')
  const [selectedDomain, setSelectedDomain] = useState(branches[0].title)
  const [selectedLevel, setSelectedLevel] = useState('B1')
  const [leadSubmissionError, setLeadSubmissionError] = useState('')
  const [leadSubmissionSuccess, setLeadSubmissionSuccess] = useState('')
  const [leadSubmitting, setLeadSubmitting] = useState(false)

  useEffect(() => {
    trackAnalyticsEvent('page_view', 'landing')
  }, [])

  const consultationMessage = createRegistrationMessage({
    name: candidateName,
    email: candidateEmail,
    domain: selectedDomain,
    level: selectedLevel,
  })

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const saveLead = async ({ activeMember, source }) => {
    const trimmedName = candidateName.trim()
    const trimmedEmail = candidateEmail.trim()

    setLeadSubmissionError('')
    setLeadSubmissionSuccess('')

    if (trimmedName.length < 2) {
      setLeadSubmissionError('Veuillez saisir votre nom complet (minimum 2 caracteres).')
      return false
    }

    if (!isValidEmail(trimmedEmail)) {
      setLeadSubmissionError('Veuillez saisir un email valide.')
      return false
    }

    await trackAnalyticsEvent('lead_submit_attempt', source, {
      domain: selectedDomain,
      languageLevel: selectedLevel,
    })

    setLeadSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: trimmedName,
          email: trimmedEmail,
          domain: selectedDomain,
          languageLevel: selectedLevel,
          source,
          recommendedAgent: activeMember.name,
          website: candidateWebsite,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        const apiError = payload?.error

        if (apiError === 'Suspicious submission blocked by anti-spam check') {
          throw new Error('Soumission bloquee par anti-spam. Videz les champs auto-remplis puis reessayez.')
        }

        throw new Error(apiError || 'Impossible d\'enregistrer votre demande pour le moment.')
      }

      setLeadSubmissionSuccess('Votre demande a bien ete enregistree.')
      await trackAnalyticsEvent('lead_submit_success', source, {
        domain: selectedDomain,
        languageLevel: selectedLevel,
      })
      return true
    } catch (error) {
      setLeadSubmissionError(error instanceof Error ? error.message : 'Erreur reseau, veuillez reessayer.')
      return false
    } finally {
      setLeadSubmitting(false)
    }
  }

  const handleApplyWhatsApp = async () => {
    if (leadSubmitting) {
      return
    }

    const activeMember = getNextApplicationMember()
    const leadSaved = await saveLead({ activeMember, source: 'site-web-whatsapp' })

    if (!leadSaved) {
      return
    }

    trackAnalyticsEvent('click_whatsapp', 'contact-cta', {
      domain: selectedDomain,
      languageLevel: selectedLevel,
    })

    const applicationLink = `https://wa.me/${activeMember.phone}?text=${encodeURIComponent(
      `${consultationMessage}\n\nCanal choisi: WhatsApp\nConseiller assigne: ${activeMember.name} (+${activeMember.phone})\nMerci de me contacter pour finaliser ma candidature.`,
    )}`

    advanceApplicationMember()
    window.open(applicationLink, '_blank', 'noopener,noreferrer')
  }

  const handleApplyEmail = async () => {
    if (leadSubmitting) {
      return
    }

    const activeMember = getNextApplicationMember()
    const leadSaved = await saveLead({ activeMember, source: 'site-web-email' })

    if (!leadSaved) {
      return
    }

    trackAnalyticsEvent('click_email', 'contact-cta', {
      domain: selectedDomain,
      languageLevel: selectedLevel,
    })

    const emailSubject = encodeURIComponent('Nouvelle candidature - Service Carriere Allemagne')
    const emailBody = encodeURIComponent(
      `${consultationMessage}\n\nCanal choisi: Email\nConseiller assigne: ${activeMember.name} (+${activeMember.phone})`,
    )
    const emailLink = `mailto:${supportEmail}?subject=${emailSubject}&body=${emailBody}`

    advanceApplicationMember()
    window.location.href = emailLink
  }


  const handleTranslateToArabic = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : sitePublicUrl
    const translateUrl = `https://translate.google.com/translate?sl=auto&tl=ar&u=${encodeURIComponent(currentUrl)}`
    window.location.href = translateUrl
  }

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

          <div className="topbar-actions">
            <p className="topbar-note">Accompagnement professionnel pour candidater en Allemagne</p>
            <Button
              type="button"
              size="sm"
              className="translate-button"
              onClick={handleTranslateToArabic}
              aria-label="Traduire le site en arabe"
            >
              <Globe className="icon-xs" /> Traduire en arabe
            </Button>
          </div>
        </header>

        <div className="hero-grid">
          <Animated.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="hero-copy">
            <div className="eyebrow"><Sparkles className="icon-xs" /> Accompagnement complet pour travailler ou se former en Allemagne</div>

            <h1>Construisez votre chemin vers un <span>emploi</span> ou une <span className="blue">Ausbildung</span> en Allemagne.</h1>

            <p className="hero-text">Nous collectons des emails d’entreprises, traduisons vos dossiers et vous conseillons pour candidater plus vite.</p>

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
          </Animated.div>
        </div>
      </section>

      <section className="content-section video-section" id="video">
        <div className="section-intro narrow">
          <p className="section-kicker">Aperçu des services</p>
          <h2>Image de présentation des services</h2>
          <p>La vidéo est temporairement désactivée. Voici le visuel des services.</p>
        </div>

        <div className="video-frame">
          <img className="promo-video" src={servicesPlaceholderImage} alt="Visuel temporaire présentant nos services" loading="lazy" />

          <div className="video-overlay">
            <div className="video-badge">
              <Sparkles className="icon-xs" />
              Aperçu des services
            </div>

            <div className="video-overlay-copy">
              <h3>Nos services clés en un coup d’oeil</h3>
              <p>Collecte d’emails, traduction des dossiers et accompagnement candidature.</p>
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
          <p>Choisissez une filière et posez vos questions directement sur WhatsApp.</p>
        </div>

        <div className="branch-grid">
          {branches.map((branch, index) => {
            const Icon = branch.icon
            return (
              <Animated.a
                key={branch.title}
                href={createWhatsAppLink(branch.title)}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="branch-link"
                onClick={(event) => {
                  event.preventDefault()
                  openRotatingWhatsAppLink(`Bonjour, je veux plus d'informations sur la filière ${branch.title} en Allemagne.`)
                }}
              >
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
          <h2>Nos services essentiels</h2>
          <p>Tout le nécessaire pour candidater simplement.</p>
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
            <h2>Processus simple en 4 étapes</h2>
            <p>Clair, rapide et pratique.</p>

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
          <h2>Questions fréquentes</h2>
          <p>Réponses courtes et directes.</p>
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
              <h2>Prêt à commencer ?</h2>
              <p>Envoyez votre profil, on vous répond rapidement.</p>
              <div className="cta-meta">
                <a
                  className="meta-item"
                  href={buildWhatsAppLink(getNextWhatsAppRecipient(), 'Bonjour, je veux des informations pour ma candidature en Allemagne.')}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Contacter le support via WhatsApp"
                  onClick={(event) => {
                    event.preventDefault()
                    openRotatingWhatsAppLink('Bonjour, je veux des informations pour ma candidature en Allemagne.')
                  }}
                >
                  <Phone className="icon-xs" /> WhatsApp: {whatsappNumbersFormatted}
                </a>
                <a className="meta-item" href={`mailto:${supportEmail}`} aria-label="Contacter le support par email">
                  <Mail className="icon-xs" /> Suivi par email
                </a>
              </div>
            </div>

            <div className="cta-form">
              <div className="honeypot-field" aria-hidden="true">
                <label htmlFor="company-website">Site web</label>
                <input
                  id="company-website"
                  name="company_website_hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="new-password"
                  inputMode="none"
                  spellCheck={false}
                  value={candidateWebsite}
                  onChange={(event) => setCandidateWebsite(event.target.value)}
                />
              </div>

              <Input
                placeholder="Votre nom complet"
                value={candidateName}
                onChange={(event) => setCandidateName(event.target.value)}
              />
              <Input
                placeholder="Votre email"
                type="email"
                value={candidateEmail}
                onChange={(event) => setCandidateEmail(event.target.value)}
              />

              <select
                className="ui-input"
                value={selectedDomain}
                onChange={(event) => setSelectedDomain(event.target.value)}
                aria-label="Choisir un domaine"
              >
                {branches.map((branch) => (
                  <option key={branch.title} value={branch.title}>
                    {branch.title}
                  </option>
                ))}
              </select>

              <fieldset className="language-level">
                <legend>Niveau de langue (allemand)</legend>
                <div className="language-level-options">
                  {languageLevels.map((level) => (
                    <label key={level} className="language-level-chip">
                      <input
                        type="radio"
                        name="language-level"
                        value={level}
                        checked={selectedLevel === level}
                        onChange={(event) => setSelectedLevel(event.target.value)}
                      />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <p className="cta-choice-label">Choisissez votre mode de candidature</p>
              {leadSubmissionError && <p className="lead-feedback lead-feedback-error">{leadSubmissionError}</p>}
              {leadSubmissionSuccess && (
                <p className="lead-feedback lead-feedback-success" role="status" aria-live="polite">
                  <CheckCircle2 className="icon-xs" />
                  {leadSubmissionSuccess}
                </p>
              )}
              <div className="cta-choice-buttons">
                <Button className="cta-button" type="button" onClick={handleApplyWhatsApp} disabled={leadSubmitting}>
                  {leadSubmitting ? 'Enregistrement...' : 'Postuler via WhatsApp'} <Phone className="icon-xs ml-2" />
                </Button>
                <Button className="cta-button" type="button" variant="outline" onClick={handleApplyEmail} disabled={leadSubmitting}>
                  {leadSubmitting ? 'Enregistrement...' : 'Postuler par email'} <Mail className="icon-xs ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="content-section footer-contact-section" id="contacts-footer">
        <div className="section-intro narrow">
          <p className="section-kicker">Contacts</p>
          <h2>Contacts directs + QR Code du site</h2>
          <p>Scannez le QR code pour ouvrir le site, ou contactez directement notre equipe.</p>
        </div>

        <div className="footer-contact-grid">
          <Card className="glass-card contact-list-card">
            <CardContent className="card-content contact-list-content">
              {teamMembers.map((member) => (
                <div key={member.phone} className="contact-person-card">
                  <h3>{member.name}</h3>
                  <p>WhatsApp: {formatWhatsAppNumber(member.phone)}</p>
                  <a
                    className="ui-button button-outline button-md"
                    href={buildWhatsAppLink(member.phone, 'Bonjour, je veux des informations pour ma candidature en Allemagne.')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Phone className="icon-xs" /> Ouvrir WhatsApp
                  </a>
                </div>
              ))}

              <div className="contact-person-card">
                <h3>Email Support</h3>
                <p>{supportEmail}</p>
                <a className="ui-button button-outline button-md" href={`mailto:${supportEmail}`}>
                  <Mail className="icon-xs" /> Envoyer un email
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card qr-card">
            <CardContent className="card-content qr-content">
              <h3>QR Code du site</h3>
              <p>Scannez ce code avec votre telephone pour ouvrir la page.</p>
              <img className="qr-image" src={siteQrImage} alt="QR code vers service-deutschland.vercel.app" loading="lazy" />
            </CardContent>
          </Card>
        </div>

        <footer className="site-footer">
          <p>Informations legales:</p>
          <div className="site-footer-links">
            <a className="site-footer-link" href="/legal.html">
              Mentions legales et confidentialite
            </a>
            <a className="site-footer-link" href="/admin.html">
              Dashboard admin
            </a>
          </div>
        </footer>
      </section>

      <a
        className="mobile-whatsapp-fab"
        href={buildWhatsAppLink(getNextWhatsAppRecipient(), 'Bonjour, je veux des informations pour ma candidature en Allemagne.')}
        target="_blank"
        rel="noreferrer"
        aria-label="Contacter sur WhatsApp"
        onClick={(event) => {
          event.preventDefault()
          openRotatingWhatsAppLink('Bonjour, je veux des informations pour ma candidature en Allemagne.')
        }}
      >
        <Phone className="icon-sm" />
        WhatsApp
      </a>

      <a className="mobile-email-fab" href={`mailto:${supportEmail}`} aria-label="Contacter par email">
        <Mail className="icon-sm" />
        Email
      </a>
    </div>
  )
}

