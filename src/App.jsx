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

const WHATSAPP_RECIPIENTS = ['+212 671-078310', '212664879503']
const WHATSAPP_ROUTING_KEY = 'whatsapp-routing-index'

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

  return 'https://testservice-mu.vercel.app'
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

const createWhatsAppLink = (branchTitle, language = 'fr') => {
  const text =
    language === 'ar'
      ? `مرحبا، أريد مزيدا من المعلومات حول تخصص ${branchTitle} في ألمانيا.`
      : `Bonjour, je veux plus d'informations sur la filière ${branchTitle} en Allemagne.`
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

const AR_TEXT_MAP = {
  'Soins infirmiers / aide soignant': 'التمريض / مساعد تمريض',
  'Cuisine / restauration': 'الطبخ / المطاعم',
  'Mécanique automobile et industrielle': 'الميكانيك السياراتي والصناعي',
  'Mécatronique': 'الميكاترونيك',
  'Électricité bâtiment / industrie': 'كهرباء المباني / الصناعة',
  'Logistique / entrepôt': 'اللوجستيك / المستودعات',
  'Vente / magasin': 'البيع / المتجر',
  'Hôtellerie': 'الفندقة',
  'Service / restaurant': 'الخدمة / المطعم',
  'Soins aux personnes âgées': 'رعاية كبار السن',
  'Maintenance automobile': 'صيانة السيارات',
  'Support informatique': 'الدعم المعلوماتي',
  "Collecte d'emails d'entreprises": 'جمع عناوين بريد الشركات',
  'Nous trouvons les emails RH utiles selon votre profil.': 'نبحث لك عن عناوين بريد الموارد البشرية المناسبة لملفك.',
  'Envoi des contacts aux clients': 'إرسال جهات الاتصال للعميل',
  'Nous vous envoyons une liste claire d’emails d’entreprises.': 'نرسل لك قائمة واضحة بعناوين بريد الشركات.',
  'Traduction des dossiers': 'ترجمة الملفات',
  'Nous traduisons CV, lettres et documents essentiels.': 'نترجم السيرة الذاتية والرسائل والوثائق الأساسية.',
  'Informations et consultations': 'معلومات واستشارات',
  'Nous donnons des infos pratiques et des consultations rapides.': 'نقدم معلومات عملية واستشارات سريعة.',
  'Conseils de candidature': 'نصائح التقديم',
  'Nous vous guidons pour mieux contacter les entreprises.': 'نرشدك للتواصل مع الشركات بشكل أفضل.',
  'Analyse du besoin': 'تحليل الحاجة',
  'On définit votre profil et votre cible.': 'نحدد ملفك والجهة المستهدفة.',
  'Collecte des emails': 'جمع العناوين الإلكترونية',
  'On prépare les contacts RH utiles.': 'نجهز جهات اتصال الموارد البشرية المناسبة.',
  'Traduction du dossier': 'ترجمة الملف',
  'On traduit les documents importants.': 'نترجم الوثائق المهمة.',
  'Consultation et orientation': 'الاستشارة والتوجيه',
  'On vous guide pour les prochaines étapes.': 'نرشدك للخطوات القادمة.',
  'Emails d’entreprises ciblés': 'عناوين بريد شركات مستهدفة',
  'Contacts envoyés rapidement': 'إرسال جهات الاتصال بسرعة',
  'Traduction des dossiers de candidature': 'ترجمة ملفات التقديم',
  'Infos pratiques utiles': 'معلومات عملية مفيدة',
  'Consultations personnalisées': 'استشارات مخصصة',
  'Accompagnement simple': 'مرافقة بسيطة',
  'À qui s’adresse ce service ?': 'لمن هذه الخدمة؟',
  'À toute personne qui veut candidater en Allemagne.': 'لكل شخص يريد التقديم في ألمانيا.',
  'Est-ce que vous gérez le visa ?': 'هل تتكفلون بالفيزا؟',
  'Non, nous ne gérons pas le visa.': 'لا، نحن لا نتكفل بالفيزا.',
  'Vous faites quoi exactement ?': 'ماذا تقدمون بالضبط؟',
  'Emails d’entreprises, traduction de dossier, infos et consultations.': 'عناوين بريد الشركات، ترجمة الملفات، معلومات واستشارات.',
  'Vous aidez si mon allemand est faible ?': 'هل تساعدونني إذا كان مستواي ضعيفا في الألمانية؟',
  'Oui, nous adaptons les documents à votre niveau.': 'نعم، نكيف الوثائق حسب مستواك.',
  'Préparé professionnellement': 'معد باحتراف',
  'Accompagnement dossier complet': 'مرافقة ملف كامل',
  'Recherche ciblée': 'بحث موجه',
  'Organisation des contacts RH': 'تنظيم جهات اتصال الموارد البشرية',
  'Étudiants': 'الطلاب',
  'Jeunes diplômés': 'الخريجون الجدد',
  'Débutants dans les candidatures allemandes': 'المبتدئون في التقديم لألمانيا',
  'Candidats en Ausbildung': 'مترشحو التكوين المهني',
  'Personnes qui veulent partir travailler en Allemagne': 'أشخاص يريدون العمل في ألمانيا',
  'Personnes ayant besoin d’aide pour leurs documents': 'أشخاص يحتاجون مساعدة في وثائقهم',
}

const servicesPlaceholderImage = '/services-placeholder.svg'
const siteQrImage = '/qr-service-for-deutschland.png'
const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const supportEmail = 'baloua96@hotmail.fr'

const teamMembers = [
  { name: 'Contact 1', phone: '212664879503', specialties: ['Pflege', 'Altenpflege', 'IT Support', 'Koch / Köchin', 'Gastronomie', 'Hotellerie'] },
  { name: 'Contact 2', phone: '+212 671-078310', specialties: ['Pflege', 'Altenpflege', 'IT Support', 'Koch / Köchin', 'Gastronomie', 'Hotellerie'] },
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

const createRegistrationMessage = ({ name, email, domain, level, language = 'fr' }) => {
  if (language === 'ar') {
    return [
      'مرحبا، أريد التسجيل في الخدمة.',
      `الاسم: ${name || 'غير محدد'}`,
      `البريد الإلكتروني: ${email || 'غير محدد'}`,
      `المجال المختار: ${domain}`,
      `مستوى اللغة: ${level}`,
      'أرغب في المتابعة مع مستشار.',
    ].join('\n')
  }

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
  const [activeLanguage, setActiveLanguage] = useState('fr')
  const [candidateName, setCandidateName] = useState('')
  const [candidateEmail, setCandidateEmail] = useState('')
  const [candidateWebsite, setCandidateWebsite] = useState('')
  const [selectedDomain, setSelectedDomain] = useState(branches[0].title)
  const [selectedLevel, setSelectedLevel] = useState('B1')
  const [leadSubmissionError, setLeadSubmissionError] = useState('')
  const [leadSubmissionSuccess, setLeadSubmissionSuccess] = useState('')
  const [leadSubmitting, setLeadSubmitting] = useState(false)

  const isArabic = activeLanguage === 'ar'
  const t = (fr, ar) => (isArabic ? ar : fr)
  const tr = (text) => (isArabic ? AR_TEXT_MAP[text] ?? text : text)

  const localizeBranchDetail = (detail) => {
    if (!isArabic) {
      return detail
    }

    return detail
      .replace('Niveau requis:', 'المستوى المطلوب:')
      .replace('Durée:', 'المدة:')
      .replace('Ville/Région:', 'المدينة/المنطقة:')
      .replace('Salaire moyen:', 'الراتب المتوسط:')
      .replace('Documents nécessaires:', 'الوثائق المطلوبة:')
      .replace('Date limite pour postuler:', 'آخر موعد للتقديم:')
  }

  const branchQuestionMessage = (branchTitle) =>
    t(
      `Bonjour, je veux plus d'informations sur la filière ${branchTitle} en Allemagne.`,
      `مرحبا، أريد مزيدا من المعلومات حول تخصص ${branchTitle} في ألمانيا.`,
    )

  const generalInfoMessage = t(
    'Bonjour, je veux des informations pour ma candidature en Allemagne.',
    'مرحبا، أريد معلومات حول طلبي في ألمانيا.',
  )

  useEffect(() => {
    trackAnalyticsEvent('page_view', 'landing')
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    document.documentElement.lang = isArabic ? 'ar' : 'fr'
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
  }, [isArabic])

  const consultationMessage = createRegistrationMessage({
    name: candidateName,
    email: candidateEmail,
    domain: selectedDomain,
    level: selectedLevel,
    language: activeLanguage,
  })

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const saveLead = async ({ activeMember, source }) => {
    const trimmedName = candidateName.trim()
    const trimmedEmail = candidateEmail.trim()

    setLeadSubmissionError('')
    setLeadSubmissionSuccess('')

    if (trimmedName.length < 2) {
      setLeadSubmissionError(t('Veuillez saisir votre nom complet (minimum 2 caracteres).', 'يرجى كتابة الاسم الكامل (على الأقل حرفان).'))
      return false
    }

    if (!isValidEmail(trimmedEmail)) {
      setLeadSubmissionError(t('Veuillez saisir un email valide.', 'يرجى إدخال بريد إلكتروني صالح.'))
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

        if (response.status === 409) {
          throw new Error(t('Cet email a deja postule. Utilisez un autre email.', 'هذا البريد الإلكتروني سبق أن تقدم. استخدم بريدا إلكترونيا آخر.'))
        }

        if (apiError === 'Suspicious submission blocked by anti-spam check' || apiError === 'Soumission bloquee par la protection anti-spam') {
          throw new Error(t('Soumission bloquee par anti-spam. Videz les champs auto-remplis puis reessayez.', 'تم حظر الإرسال بواسطة نظام مكافحة السبام. احذف الحقول المعبأة تلقائيا ثم حاول مرة أخرى.'))
        }

        if (apiError === 'This email has already been used for an application' || apiError === 'Cet email a deja postule') {
          throw new Error(t('Cet email a deja postule. Utilisez un autre email.', 'هذا البريد الإلكتروني سبق أن تقدم. استخدم بريدا إلكترونيا آخر.'))
        }

        throw new Error(apiError || t('Impossible d\'enregistrer votre demande pour le moment.', 'لا يمكن تسجيل طلبك حاليا.'))
      }

      setLeadSubmissionSuccess(t('Votre demande a bien ete enregistree.', 'تم تسجيل طلبك بنجاح.'))
      await trackAnalyticsEvent('lead_submit_success', source, {
        domain: selectedDomain,
        languageLevel: selectedLevel,
      })
      return true
    } catch (error) {
      setLeadSubmissionError(error instanceof Error ? error.message : t('Erreur reseau, veuillez reessayer.', 'خطأ في الشبكة، يرجى المحاولة مرة أخرى.'))
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
      isArabic
        ? `${consultationMessage}\n\nالقناة المختارة: واتساب\nالمستشار المعين: ${activeMember.name} (+${activeMember.phone})\nيرجى التواصل معي لإكمال طلبي.`
        : `${consultationMessage}\n\nCanal choisi: WhatsApp\nConseiller assigne: ${activeMember.name} (+${activeMember.phone})\nMerci de me contacter pour finaliser ma candidature.`,
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

    const emailSubject = encodeURIComponent(t('Nouvelle candidature - Service Carriere Allemagne', 'طلب جديد - خدمة المسار المهني ألمانيا'))
    const emailBody = encodeURIComponent(
      isArabic
        ? `${consultationMessage}\n\nالقناة المختارة: البريد الإلكتروني\nالمستشار المعين: ${activeMember.name} (+${activeMember.phone})`
        : `${consultationMessage}\n\nCanal choisi: Email\nConseiller assigne: ${activeMember.name} (+${activeMember.phone})`,
    )
    const emailLink = `mailto:${supportEmail}?subject=${emailSubject}&body=${emailBody}`

    advanceApplicationMember()
    window.location.href = emailLink
  }


  return (
    <div className="page-shell" dir={isArabic ? 'rtl' : 'ltr'}>
      <section className="hero-section">
        <div className="hero-glow" />
        <div className="hero-glow hero-glow-alt" />

        <header className="topbar">
          <div className="brand">
            <div className="brand-mark"><Briefcase className="icon-sm" /></div>
            <div>
              <p className="brand-title">{t('Service Carrière Allemagne', 'خدمة المسار المهني ألمانيا')}</p>
              <p className="brand-subtitle">{t('Emploi • Ausbildung • Aide à la candidature', 'وظيفة • تدريب مهني • دعم التقديم')}</p>
            </div>
          </div>

          <div className="topbar-actions">
            <p className="topbar-note">{t('Accompagnement professionnel pour candidater en Allemagne', 'مرافقة مهنية للتقديم في ألمانيا')}</p>
            <Button
              type="button"
              size="sm"
              className={`translate-button ${activeLanguage === 'fr' ? 'translate-button-active' : ''}`}
              onClick={() => setActiveLanguage('fr')}
              aria-label={t('Afficher le site en français', 'عرض الموقع بالفرنسية')}
              aria-pressed={activeLanguage === 'fr'}
            >
              <Globe className="icon-xs" /> FR
            </Button>
            <Button
              type="button"
              size="sm"
              className={`translate-button ${activeLanguage === 'ar' ? 'translate-button-active' : ''}`}
              onClick={() => setActiveLanguage('ar')}
              aria-label={t('Afficher le site en arabe', 'عرض الموقع بالعربية')}
              aria-pressed={activeLanguage === 'ar'}
            >
              <Globe className="icon-xs" /> AR
            </Button>
          </div>
        </header>

        <div className="hero-grid">
          <Animated.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="hero-copy">
            <div className="eyebrow"><Sparkles className="icon-xs" /> {t('Accompagnement complet pour travailler ou se former en Allemagne', 'مرافقة كاملة للعمل أو التكوين في ألمانيا')}</div>

            <h1>{t('Construisez votre chemin vers un ', 'ابنِ طريقك نحو ')}<span>{t('emploi', 'وظيفة')}</span>{t(' ou une ', ' أو ')}<span className="blue">Ausbildung</span>{t(' en Allemagne.', ' في ألمانيا.')}</h1>

            <p className="hero-text">{t('Nous collectons des emails d’entreprises, traduisons vos dossiers et vous conseillons pour candidater plus vite.', 'نجمع لك عناوين بريد الشركات، نترجم ملفاتك، ونرشدك للتقديم بشكل أسرع.')}</p>

            <div className="hero-actions">
              <Button
                size="lg"
                className="rounded-2xl px-6 text-base"
                onClick={() => scrollToSection('contact')}
                aria-label={t('Aller au formulaire de contact', 'الذهاب إلى نموذج التواصل')}
              >
                {t('Commencer ma candidature', 'ابدأ طلبي الآن')} <ArrowRight className="icon-xs ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl border-white/20 bg-white/5 px-6 text-base text-white hover:bg-white/10"
                onClick={() => scrollToSection('services-list')}
                aria-label={t('Voir la section des services', 'عرض قسم الخدمات')}
              >
                {t('Voir les services', 'عرض الخدمات')}
              </Button>
            </div>

            <div className="highlight-grid">
              {highlights.slice(0, 4).map((item) => (
                <div key={item} className="info-card"><CheckCircle2 className="icon-sm success" /><p>{tr(item)}</p></div>
              ))}
            </div>
          </Animated.div>

          <Animated.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="hero-panel">
            <div className="stats-grid">
              {stats.map((stat) => (
                <Card key={stat.label} className="glass-card stat-card"><CardContent className="card-content"><p className="stat-value">{stat.value}</p><p className="stat-label">{tr(stat.label)}</p></CardContent></Card>
              ))}
            </div>
          </Animated.div>
        </div>
      </section>

      <section className="content-section video-section" id="video">
        <div className="section-intro narrow">
          <p className="section-kicker">{t('Aperçu des services', 'نظرة على الخدمات')}</p>
          <h2>{t('Image de présentation des services', 'صورة تقديمية للخدمات')}</h2>
          <p>{t('La vidéo est temporairement désactivée. Voici le visuel des services.', 'الفيديو متوقف مؤقتا. إليك الصورة التوضيحية للخدمات.')}</p>
        </div>

        <div className="video-frame">
          <img className="promo-video" src={servicesPlaceholderImage} alt={t('Visuel temporaire présentant nos services', 'صورة مؤقتة تعرض خدماتنا')} loading="lazy" />

          <div className="video-overlay">
            <div className="video-badge">
              <Sparkles className="icon-xs" />
              {t('Aperçu des services', 'نظرة على الخدمات')}
            </div>

            <div className="video-overlay-copy">
              <h3>{t('Nos services clés en un coup d’oeil', 'خدماتنا الأساسية في نظرة سريعة')}</h3>
              <p>{t('Collecte d’emails, traduction des dossiers et accompagnement candidature.', 'جمع العناوين الإلكترونية، ترجمة الملفات ومرافقة التقديم.')}</p>
            </div>

            <a className="ui-button button-default button-md video-cta" href="#services-list">
              {t('Voir nos services', 'عرض خدماتنا')}
            </a>
          </div>
        </div>
      </section>

      <section className="content-section" id="services-list">
        <div className="section-intro">
          <p className="section-kicker">{t('Choisissez une filière', 'اختر تخصصا')}</p>
          <h2>{t('Cliquez sur une branche et posez-nous vos questions directement sur WhatsApp', 'اضغط على التخصص واطرح أسئلتك مباشرة عبر واتساب')}</h2>
          <p>{t('Choisissez une filière et posez vos questions directement sur WhatsApp.', 'اختر تخصصا واطرح أسئلتك مباشرة على واتساب.')}</p>
        </div>

        <div className="branch-grid">
          {branches.map((branch, index) => {
            const Icon = branch.icon
            return (
              <Animated.a
                key={branch.title}
                href={createWhatsAppLink(branch.title, activeLanguage)}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="branch-link"
                onClick={(event) => {
                  event.preventDefault()
                  openRotatingWhatsAppLink(branchQuestionMessage(branch.title))
                }}
              >
                <Card className="glass-card branch-card">
                  <CardContent className="card-content">
                    <div className="branch-icon-wrap"><Icon className="icon-md success-text" /></div>
                    <h3>{branch.title}</h3>
                    <p>{tr(branch.subtitle)}</p>
                    <ul className="branch-details">
                      {branch.details.map((detail) => (
                        <li key={detail} className="branch-detail-item">
                          <AlertCircle className="icon-xs" />
                          <span>{localizeBranchDetail(detail)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pill-link">{t('Poser une question sur WhatsApp', 'اطرح سؤالك على واتساب')} <ArrowRight className="icon-xs" /></div>
                  </CardContent>
                </Card>
              </Animated.a>
            )
          })}
        </div>
      </section>

      <section className="content-section">
        <div className="section-intro narrow">
          <p className="section-kicker">{t('Nos services', 'خدماتنا')}</p>
          <h2>{t('Nos services essentiels', 'خدماتنا الأساسية')}</h2>
          <p>{t('Tout le nécessaire pour candidater simplement.', 'كل ما تحتاجه للتقديم بسهولة.')}</p>
        </div>

        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Animated.div key={service.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.05 }}>
                <Card className="glass-card service-card">
                  <CardContent className="card-content">
                    <div className="service-icon-wrap"><Icon className="icon-sm success-text" /></div>
                    <h3>{tr(service.title)}</h3>
                    <p>{tr(service.description)}</p>
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
            <p className="section-kicker blue-kicker">{t('Comment ça marche', 'كيف يعمل')}</p>
            <h2>{t('Processus simple en 4 étapes', 'عملية بسيطة في 4 خطوات')}</h2>
            <p>{t('Clair, rapide et pratique.', 'واضح وسريع وعملي.')}</p>

            <div className="step-list">
              {steps.map((step) => (
                <div key={step.number} className="step-card">
                  <div className="step-number">{step.number}</div>
                  <div><h3>{tr(step.title)}</h3><p>{tr(step.text)}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="split-side">
            <Card className="glass-card side-card"><CardContent className="card-content"><h3>{t('Pourquoi les clients choisissent ce service', 'لماذا يختار العملاء هذه الخدمة')}</h3><div className="check-list large">{highlights.map((item) => (<div key={item} className="check-row"><CheckCircle2 className="icon-sm success" /><p>{tr(item)}</p></div>))}</div></CardContent></Card>
            <Card className="glass-card side-card alt-card"><CardContent className="card-content"><h3>{t('Idéal pour', 'مناسب لـ')}</h3><div className="tag-grid">{['Étudiants', 'Jeunes diplômés', 'Débutants dans les candidatures allemandes', 'Candidats en Ausbildung', 'Personnes qui veulent partir travailler en Allemagne', 'Personnes ayant besoin d’aide pour leurs documents'].map((group) => (<div key={group} className="tag-item">{tr(group)}</div>))}</div></CardContent></Card>
          </div>
        </div>
      </section>

      <section className="content-section faq-section">
        <div className="section-intro narrow">
          <p className="section-kicker">{t('FAQ', 'الأسئلة الشائعة')}</p>
          <h2>{t('Questions fréquentes', 'الأسئلة الشائعة')}</h2>
          <p>{t('Réponses courtes et directes.', 'أجوبة قصيرة ومباشرة.')}</p>
        </div>

        <div className="faq-list">
          {faq.map((item) => (
            <details key={item.q} className="faq-item"><summary><span>{tr(item.q)}</span><span className="faq-arrow">⌄</span></summary><p>{tr(item.a)}</p></details>
          ))}
        </div>
      </section>

      <section className="content-section cta-section" id="contact">
        <Card className="glass-card cta-card">
          <CardContent className="cta-content card-content">
            <div>
              <p className="section-kicker">{t('Commencer', 'ابدأ')}</p>
              <h2>{t('Prêt à commencer ?', 'جاهز للبدء؟')}</h2>
              <p>{t('Envoyez votre profil, on vous répond rapidement.', 'أرسل ملفك وسنرد عليك بسرعة.')}</p>
              <div className="cta-meta">
                <a
                  className="meta-item"
                  href={buildWhatsAppLink(getNextWhatsAppRecipient(), generalInfoMessage)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t('Contacter le support via WhatsApp', 'التواصل مع الدعم عبر واتساب')}
                  onClick={(event) => {
                    event.preventDefault()
                    openRotatingWhatsAppLink(generalInfoMessage)
                  }}
                >
                  <Phone className="icon-xs" /> {t('WhatsApp', 'واتساب')}: {whatsappNumbersFormatted}
                </a>
                <a className="meta-item" href={`mailto:${supportEmail}`} aria-label={t('Contacter le support par email', 'التواصل مع الدعم عبر البريد الإلكتروني')}>
                  <Mail className="icon-xs" /> {t('Suivi par email', 'المتابعة عبر البريد الإلكتروني')}
                </a>
              </div>
            </div>

            <div className="cta-form">
              <div className="honeypot-field" aria-hidden="true">
                <label htmlFor="company-website">{t('Site web', 'الموقع الإلكتروني')}</label>
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
                placeholder={t('Votre nom complet', 'الاسم الكامل')}
                value={candidateName}
                onChange={(event) => setCandidateName(event.target.value)}
              />
              <Input
                placeholder={t('Votre email', 'بريدك الإلكتروني')}
                type="email"
                value={candidateEmail}
                onChange={(event) => setCandidateEmail(event.target.value)}
              />

              <select
                className="ui-input"
                value={selectedDomain}
                onChange={(event) => setSelectedDomain(event.target.value)}
                aria-label={t('Choisir un domaine', 'اختر المجال')}
              >
                {branches.map((branch) => (
                  <option key={branch.title} value={branch.title}>
                    {branch.title}
                  </option>
                ))}
              </select>

              <fieldset className="language-level">
                <legend>{t('Niveau de langue (allemand)', 'مستوى اللغة (الألمانية)')}</legend>
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

              <p className="cta-choice-label">{t('Choisissez votre mode de candidature', 'اختر طريقة التقديم')}</p>
              {leadSubmissionError && <p className="lead-feedback lead-feedback-error">{leadSubmissionError}</p>}
              {leadSubmissionSuccess && (
                <p className="lead-feedback lead-feedback-success" role="status" aria-live="polite">
                  <CheckCircle2 className="icon-xs" />
                  {leadSubmissionSuccess}
                </p>
              )}
              <div className="cta-choice-buttons">
                <Button className="cta-button" type="button" onClick={handleApplyWhatsApp} disabled={leadSubmitting}>
                  {leadSubmitting ? t('Enregistrement...', 'جار الحفظ...') : t('Postuler via WhatsApp', 'التقديم عبر واتساب')} <Phone className="icon-xs ml-2" />
                </Button>
                <Button className="cta-button" type="button" variant="outline" onClick={handleApplyEmail} disabled={leadSubmitting}>
                  {leadSubmitting ? t('Enregistrement...', 'جار الحفظ...') : t('Postuler par email', 'التقديم بالبريد الإلكتروني')} <Mail className="icon-xs ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="content-section footer-contact-section" id="contacts-footer">
        <div className="section-intro narrow">
          <p className="section-kicker">{t('Contacts', 'جهات الاتصال')}</p>
          <h2>{t('Contacts directs + QR Code du site', 'اتصال مباشر + رمز QR للموقع')}</h2>
          <p>{t('Scannez le QR code pour ouvrir le site, ou contactez directement notre equipe.', 'امسح رمز QR لفتح الموقع، أو تواصل مباشرة مع فريقنا.')}</p>
        </div>

        <div className="footer-contact-grid">
          <Card className="glass-card contact-list-card">
            <CardContent className="card-content contact-list-content">
              {teamMembers.map((member) => (
                <div key={member.phone} className="contact-person-card">
                  <h3>{t(member.name, member.name.replace('Contact', 'جهة اتصال'))}</h3>
                  <p>WhatsApp: {formatWhatsAppNumber(member.phone)}</p>
                  <a
                    className="ui-button button-outline button-md"
                    href={buildWhatsAppLink(member.phone, generalInfoMessage)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Phone className="icon-xs" /> {t('Ouvrir WhatsApp', 'فتح واتساب')}
                  </a>
                </div>
              ))}

              <div className="contact-person-card">
                <h3>{t('Email Support', 'دعم البريد الإلكتروني')}</h3>
                <p>{supportEmail}</p>
                <a className="ui-button button-outline button-md" href={`mailto:${supportEmail}`}>
                  <Mail className="icon-xs" /> {t('Envoyer un email', 'إرسال بريد إلكتروني')}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card qr-card">
            <CardContent className="card-content qr-content">
              <h3>{t('QR Code du site', 'رمز QR للموقع')}</h3>
              <p>{t('Scannez ce code avec votre telephone pour ouvrir la page.', 'امسح هذا الرمز بهاتفك لفتح الصفحة.')}</p>
              <img className="qr-image" src={siteQrImage} alt={t('QR code vers service-deutschland.vercel.app', 'رمز QR نحو service-deutschland.vercel.app')} loading="lazy" />
            </CardContent>
          </Card>
        </div>

        <footer className="site-footer">
          <p>{t('Informations legales:', 'معلومات قانونية:')}</p>
          <div className="site-footer-links">
            <a className="site-footer-link" href="/legal.html">
              {t('Mentions legales et confidentialite', 'الإشعارات القانونية والخصوصية')}
            </a>
          </div>
        </footer>
      </section>

      <a
        className="mobile-whatsapp-fab"
        href={buildWhatsAppLink(getNextWhatsAppRecipient(), generalInfoMessage)}
        target="_blank"
        rel="noreferrer"
        aria-label={t('Contacter sur WhatsApp', 'التواصل عبر واتساب')}
        onClick={(event) => {
          event.preventDefault()
          openRotatingWhatsAppLink(generalInfoMessage)
        }}
      >
        <Phone className="icon-sm" />
        {t('WhatsApp', 'واتساب')}
      </a>

      <a className="mobile-email-fab" href={`mailto:${supportEmail}`} aria-label={t('Contacter par email', 'التواصل عبر البريد الإلكتروني')}>
        <Mail className="icon-sm" />
        {t('Email', 'بريد إلكتروني')}
      </a>
    </div>
  )
}

