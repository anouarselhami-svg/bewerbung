import { useEffect, useMemo, useRef, useState } from 'react'
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

const WHATSAPP_RECIPIENTS = ['212671078310', '212664879503']
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
const BRAND_LOGO_PATH = '/logo-goglobal.png'

const ALL_COUNTRY_CODES = [
  'AF', 'AL', 'DZ', 'AD', 'AO', 'AG', 'AR', 'AM', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BT', 'BO', 'BA',
  'BW', 'BR', 'BN', 'BG', 'BF', 'BI', 'CV', 'KH', 'CM', 'CA', 'CF', 'TD', 'CL', 'CN', 'CO', 'KM', 'CG', 'CD', 'CR', 'CI', 'HR', 'CU',
  'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'SZ', 'ET', 'FJ', 'FI', 'FR', 'GA', 'GM', 'GE', 'DE', 'GH',
  'GR', 'GD', 'GT', 'GN', 'GW', 'GY', 'HT', 'HN', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IL', 'IT', 'JM', 'JP', 'JO', 'KZ', 'KE',
  'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MR',
  'MU', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NZ', 'NI', 'NE', 'NG', 'MK', 'NO', 'OM', 'PK',
  'PW', 'PA', 'PG', 'PY', 'PE', 'PH', 'PL', 'PT', 'QA', 'RO', 'RU', 'RW', 'KN', 'LC', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC',
  'SL', 'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'SS', 'ES', 'LK', 'SD', 'SR', 'SE', 'CH', 'SY', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TO', 'TT',
  'TN', 'TR', 'TM', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UY', 'UZ', 'VU', 'VA', 'VE', 'VN', 'YE', 'ZM', 'ZW', 'PS',
]

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
    title: 'Soins infirmiers / Sante',
    icon: HeartHandshake,
    details: buildBranchDetails({
      duration: '2-4 ans',
      city: 'Toronto / Montreal / Berlin / Hamburg / Paris / Brussels',
      salary: '3000-5200 EUR / 4800-7500 CAD',
      documents: 'CV, passeport, diplome en sante, preuve de langue, equivalence professionnelle',
      deadline: '30/09/2026',
    }),
  },
  {
    title: 'Technologie / IT',
    icon: Laptop,
    details: buildBranchDetails({
      duration: '1-3 ans',
      city: 'Vancouver / Calgary / Berlin / Munich / Amsterdam / London',
      salary: '3200-6500 EUR / 5500-9800 CAD',
      documents: 'CV, portfolio, diplomes IT, certificats techniques, lettre de motivation',
      deadline: '15/10/2026',
    }),
  },
  {
    title: 'Mecanique / Ingenierie',
    icon: Wrench,
    details: buildBranchDetails({
      duration: '2-4 ans',
      city: 'Windsor / Ontario / Stuttgart / Frankfurt / Zurich / Barcelona',
      salary: '2900-5600 EUR / 5000-8600 CAD',
      documents: 'CV, diplome technique, attestations d experience, passeport, references',
      deadline: '10/10/2026',
    }),
  },
  {
    title: 'Logistique / Transport',
    icon: Truck,
    details: buildBranchDetails({
      duration: '1-3 ans',
      city: 'Toronto / Calgary / Frankfurt / Hamburg / Amsterdam / Brussels',
      salary: '2400-4300 EUR / 3900-6800 CAD',
      documents: 'CV, permis de conduire selon poste, certificats logistiques, casier judiciaire',
      deadline: '01/11/2026',
    }),
  },
  {
    title: 'Restauration / Hotellerie',
    icon: ChefHat,
    details: buildBranchDetails({
      duration: '1-2 ans',
      city: 'Montreal / Vancouver / Munich / Berlin / Paris / Barcelona',
      salary: '2100-3600 EUR / 3600-5700 CAD',
      documents: 'CV, lettre de motivation, certificats d hygiene, references professionnelles',
      deadline: '20/10/2026',
    }),
  },
  {
    title: 'Construction / Batiment',
    icon: Hammer,
    details: buildBranchDetails({
      duration: '2-4 ans',
      city: 'Calgary / Ontario / Stuttgart / Frankfurt / Zurich / Brussels',
      salary: '2600-4700 EUR / 4300-7600 CAD',
      documents: 'CV, certificats metier, attestations de securite, passeport, experience chantier',
      deadline: '05/11/2026',
    }),
  },
  {
    title: 'Vente / Commerce',
    icon: ShoppingBag,
    details: buildBranchDetails({
      duration: '1-3 ans',
      city: 'Toronto / Montreal / Berlin / Hamburg / Paris / London',
      salary: '2200-3900 EUR / 3700-6200 CAD',
      documents: 'CV, lettre de motivation, preuves d experience client, references',
      deadline: '12/10/2026',
    }),
  },
  {
    title: 'Tourisme / Evenements',
    icon: Building2,
    details: buildBranchDetails({
      duration: '1-3 ans',
      city: 'Vancouver / Toronto / Munich / Berlin / Amsterdam / Barcelona',
      salary: '2100-3800 EUR / 3500-6100 CAD',
      documents: 'CV, lettre de motivation, certificats linguistiques, references',
      deadline: '25/10/2026',
    }),
  },
  {
    title: 'Manufactura / Industrie',
    icon: Factory,
    details: buildBranchDetails({
      duration: '2-4 ans',
      city: 'Windsor / Ontario / Stuttgart / Hamburg / Zurich / Brussels',
      salary: '2500-4600 EUR / 4100-7400 CAD',
      documents: 'CV, diplome technique, certificats securite, experience industrielle',
      deadline: '08/11/2026',
    }),
  },
  {
    title: 'Soins aux personnes agees',
    icon: Stethoscope,
    details: buildBranchDetails({
      duration: '1-3 ans',
      city: 'Montreal / Toronto / Berlin / Munich / Paris / London',
      salary: '2600-4300 EUR / 4200-6700 CAD',
      documents: 'CV, diplome en soins, casier judiciaire, references, preuve de langue',
      deadline: '30/10/2026',
    }),
  },
  {
    title: 'Gestion / Administration',
    icon: Briefcase,
    details: buildBranchDetails({
      duration: '1-4 ans',
      city: 'Toronto / Vancouver / Frankfurt / Berlin / Amsterdam / Paris',
      salary: '2400-4800 EUR / 3900-7600 CAD',
      documents: 'CV, lettre de motivation, diplome en gestion, certificats bureautiques, references',
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

const services = [
  { icon: Search, title: "Recherche d'offres d'emploi internationales", description: 'Nous trouvons des offres adaptees a votre profil au Canada, en Allemagne et en Europe.' },
  { icon: Mail, title: 'Envoi des offres pertinentes', description: 'Nous vous envoyons une selection claire d’offres et de contacts utiles.' },
  { icon: FileText, title: 'Preparation et traduction des dossiers', description: 'Nous preparons et traduisons CV, lettres et documents essentiels selon le pays cible.' },
  { icon: Globe, title: 'Informations sur les marches du travail', description: 'Nous partageons des informations pratiques sur le Canada, l’Allemagne et l’Europe.' },
  { icon: ShieldCheck, title: 'Conseils de candidature internationaux', description: 'Nous vous guidons pour postuler efficacement sur plusieurs marches internationaux.' },
]

const serviceOffers = [
  {
    id: 'essential',
    icon: Briefcase,
    nameFr: 'Offre Essentielle',
    nameAr: 'الباقة الأساسية',
    subtitleFr: 'Pour commencer rapidement',
    subtitleAr: 'للبداية بسرعة',
    featuresFr: [
      'Analyse du profil et choix de pays cible',
      'Selection initiale d’offres compatibles',
      'Conseils CV + lettre selon le marche choisi',
    ],
    featuresAr: [
      'تحليل الملف وتحديد الدولة المناسبة',
      'اختيار أولي للفرص المناسبة',
      'نصائح للسيرة الذاتية ورسالة التحفيز حسب البلد',
    ],
  },
  {
    id: 'pro',
    icon: Globe,
    nameFr: 'Offre Pro International',
    nameAr: 'الباقة الاحترافية الدولية',
    subtitleFr: 'Pour candidater sur plusieurs pays',
    subtitleAr: 'للتقديم في عدة دول',
    featuresFr: [
      'Recherche active Canada, Allemagne et Europe',
      'Adaptation avancee du dossier par destination',
      'Suivi des candidatures et relances organisees',
    ],
    featuresAr: [
      'بحث نشط في كندا وألمانيا وأوروبا',
      'تكييف متقدم للملف حسب الوجهة',
      'متابعة الطلبات والتذكير بشكل منظم',
    ],
  },
  {
    id: 'premium',
    icon: ShieldCheck,
    nameFr: 'Offre Premium Accompagnement',
    nameAr: 'الباقة الممتازة للمواكبة',
    subtitleFr: 'Pour un suivi complet jusqu’au contact',
    subtitleAr: 'لمواكبة كاملة حتى التواصل مع الشركات',
    featuresFr: [
      'Plan d’action personnalise semaine par semaine',
      'Simulation entretien + correction dossier',
      'Priorite de suivi via WhatsApp et email',
    ],
    featuresAr: [
      'خطة عمل شخصية أسبوعا بأسبوع',
      'محاكاة مقابلة + تصحيح كامل للملف',
      'أولوية المتابعة عبر واتساب والبريد الإلكتروني',
    ],
  },
]

const steps = [
  { number: '01', title: 'Analyse du besoin', text: 'On definit votre profil, votre metier cible et vos pays preferes.' },
  { number: '02', title: 'Recherche d’offres', text: 'On identifie les offres pertinentes sur les marches internationaux.' },
  { number: '03', title: 'Preparation du dossier', text: 'On prepare et adapte vos documents importants selon la destination.' },
  { number: '04', title: 'Consultation et placement', text: 'On vous oriente vers les prochaines etapes jusqu’au positionnement.' },
]

const highlights = [
  'Offres ciblees Canada, Allemagne et Europe',
  'Selection envoyee rapidement',
  'Dossiers adaptes aux standards internationaux',
  'Informations pays et marches de travail',
  'Consultations personnalisees selon destination',
  'Accompagnement complet et pratique',
]

const faq = [
  { q: 'À qui s’adresse ce service ?', a: 'À toute personne qui veut travailler au Canada, en Allemagne ou en Europe.' },
  { q: 'Est-ce que vous gérez le visa ?', a: 'Non, nous ne gérons pas le visa.' },
  { q: 'Vous faites quoi exactement ?', a: 'Recherche d’offres, preparation de dossier, infos marches et consultations.' },
  { q: 'Vous aidez avec plusieurs langues ?', a: 'Oui, nous adaptons les documents selon votre niveau et la langue du pays cible.' },
]

const stats = [
  { value: 'CV', label: 'Prepares professionnellement' },
  { value: 'Dossiers', label: 'Accompagnement international complet' },
  { value: 'Offres', label: 'Recherche ciblee multi-pays' },
  { value: 'Marches', label: 'Orientation Canada Allemagne Europe' },
]

const AR_TEXT_MAP = {
  'Soins infirmiers / Santé': 'الصحة / التمريض',
  'Technologie / IT': 'التكنولوجيا / تقنية المعلومات',
  'Mécanique / Ingénierie': 'الميكانيكا / الهندسة',
  'Logistique / Transport': 'الخدمات اللوجستية / النقل',
  'Restauration / Hôtellerie': 'الطعام والشراب / الضيافة',
  'Construction / Bâtiment': 'البناء / العقارات',
  'Vente / Commerce': 'البيع / التجارة',
  'Tourisme / Événements': 'السياحة / الأحداث',
  'Manufactura / Industrie': 'التصنيع / الصناعة',
  'Soins aux personnes âgées': 'رعاية المسنين',
  'Gestion / Administration': 'الإدارة / الموارد البشرية',
  'Soins infirmiers / aide soignant': 'التمريض / مساعد تمريض',
  'Cuisine / restauration': 'الطبخ / المطاعم',
  'Mécanique automobile et industrielle': 'الميكانيك السياراتي والصناعي',
  'Mécatronique': 'الميكاترونيك',
  'Électricité bâtiment / industrie': 'كهرباء المباني / الصناعة',
  'Logistique / entrepôt': 'اللوجستيك / المستودعات',
  'Vente / magasin': 'البيع / المتجر',
  'Hôtellerie': 'الفندقة',
  'Service / restaurant': 'الخدمة / المطعم',
  'Maintenance automobile': 'صيانة السيارات',
  'Support informatique': 'الدعم المعلوماتي',
  "Recherche d'offres d'emploi internationales": 'البحث عن فرص عمل دولية',
  'Nous trouvons des offres adaptees a votre profil au Canada, en Allemagne et en Europe.': 'نبحث عن فرص تناسب ملفك في كندا وألمانيا وأوروبا.',
  'Envoi des offres pertinentes': 'إرسال الفرص المناسبة',
  'Nous vous envoyons une selection claire d’offres et de contacts utiles.': 'نرسل لك قائمة واضحة بالفرص وجهات الاتصال المفيدة.',
  'Preparation et traduction des dossiers': 'إعداد وترجمة الملفات',
  'Nous preparons et traduisons CV, lettres et documents essentiels selon le pays cible.': 'نقوم بإعداد وترجمة السيرة الذاتية والرسائل والوثائق الأساسية حسب البلد المستهدف.',
  'Informations sur les marches du travail': 'معلومات حول أسواق العمل',
  'Nous partageons des informations pratiques sur le Canada, l’Allemagne et l’Europe.': 'نشارك معلومات عملية حول كندا وألمانيا وأوروبا.',
  'Conseils de candidature internationaux': 'نصائح تقديم دولية',
  'Nous vous guidons pour postuler efficacement sur plusieurs marches internationaux.': 'نرشدك للتقديم بفعالية في عدة أسواق دولية.',
  'Analyse du besoin': 'تحليل الحاجة',
  'On definit votre profil, votre metier cible et vos pays preferes.': 'نحدد ملفك ومهنتك المستهدفة والدول التي تفضلها.',
  'Recherche d’offres': 'البحث عن فرص',
  'On identifie les offres pertinentes sur les marches internationaux.': 'نحدد الفرص المناسبة في أسواق العمل الدولية.',
  'Preparation du dossier': 'إعداد الملف',
  'On prepare et adapte vos documents importants selon la destination.': 'نجهز ونكيف وثائقك المهمة حسب الوجهة.',
  'Consultation et placement': 'الاستشارة والتوجيه المهني',
  'On vous oriente vers les prochaines etapes jusqu’au positionnement.': 'نوجهك للخطوات القادمة حتى الوصول إلى فرصة مناسبة.',
  'Offres ciblees Canada, Allemagne et Europe': 'فرص مستهدفة في كندا وألمانيا وأوروبا',
  'Selection envoyee rapidement': 'إرسال الاختيارات بسرعة',
  'Dossiers adaptes aux standards internationaux': 'ملفات متوافقة مع المعايير الدولية',
  'Informations pays et marches de travail': 'معلومات عن الدول وأسواق العمل',
  'Consultations personnalisees selon destination': 'استشارات مخصصة حسب الوجهة',
  'Accompagnement complet et pratique': 'مرافقة كاملة وعملية',
  'À qui s’adresse ce service ?': 'لمن هذه الخدمة؟',
  'À toute personne qui veut travailler au Canada, en Allemagne ou en Europe.': 'لكل شخص يريد العمل في كندا أو ألمانيا أو أوروبا.',
  'Est-ce que vous gérez le visa ?': 'هل تتكفلون بالفيزا؟',
  'Non, nous ne gérons pas le visa.': 'لا، نحن لا نتكفل بالفيزا.',
  'Vous faites quoi exactement ?': 'ماذا تقدمون بالضبط؟',
  'Recherche d’offres, preparation de dossier, infos marches et consultations.': 'البحث عن الفرص، إعداد الملف، معلومات عن الأسواق واستشارات.',
  'Vous aidez avec plusieurs langues ?': 'هل تساعدون بعدة لغات؟',
  'Oui, nous adaptons les documents selon votre niveau et la langue du pays cible.': 'نعم، نكيف الوثائق حسب مستواك ولغة البلد المستهدف.',
  'Prepares professionnellement': 'إعداد احترافي',
  'Accompagnement international complet': 'مرافقة دولية كاملة',
  'Recherche ciblee multi-pays': 'بحث موجه متعدد الدول',
  'Orientation Canada Allemagne Europe': 'توجيه نحو كندا وألمانيا وأوروبا',
  'Étudiants': 'الطلاب',
  'Jeunes diplômés': 'الخريجون الجدد',
  'Débutants dans les candidatures internationales': 'المبتدئون في التقديم الدولي',
  'Candidats en formation professionnelle': 'مترشحو التكوين المهني',
  'Personnes qui veulent partir travailler au Canada, en Allemagne ou en Europe': 'أشخاص يريدون العمل في كندا أو ألمانيا أو أوروبا',
  'Personnes ayant besoin d’aide pour leurs documents': 'أشخاص يحتاجون مساعدة في وثائقهم',
}

const servicesPlaceholderImage = BRAND_LOGO_PATH
const siteQrImage = '/qr-service-for-deutschland.png'
const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const languageDiplomas = [
  { value: 'none', label: 'Aucun diplôme', labelAr: 'لا يوجد شهادة' },
  { value: 'delf', label: 'DELF (Français)', labelAr: 'DELF (فرنسي)' },
  { value: 'dalf', label: 'DALF (Français)', labelAr: 'DALF (فرنسي)' },
  { value: 'toefl', label: 'TOEFL (Anglais)', labelAr: 'TOEFL (إنجليزي)' },
  { value: 'ielts', label: 'IELTS (Anglais)', labelAr: 'IELTS (إنجليزي)' },
  { value: 'cambridge', label: 'Cambridge (Anglais)', labelAr: 'Cambridge (إنجليزي)' },
  { value: 'goethe', label: 'Goethe-Institut (Allemand)', labelAr: 'معهد Goethe (ألماني)' },
  { value: 'osd', label: 'ÖSD (Allemand)', labelAr: 'ÖSD (ألماني)' },
  { value: 'telc', label: 'TELC (Allemand)', labelAr: 'TELC (ألماني)' },
]
const supportEmail = 'baloua96@hotmail.fr'

const teamMembers = [
  { name: 'Contact 1', phone: '212664879503', specialties: ['Pflege', 'Altenpflege', 'IT Support', 'Koch / Köchin', 'Gastronomie', 'Hotellerie'] },
  { name: 'Contact 2', phone: '212671078310', specialties: ['Pflege', 'Altenpflege', 'IT Support', 'Koch / Köchin', 'Gastronomie', 'Hotellerie'] },
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

const createRegistrationMessage = ({ name, email, domain, level, countries, language = 'fr' }) => {
  const countriesLabel = countries.length > 0 ? countries.join(', ') : language === 'ar' ? 'غير محدد' : 'Non renseigné'

  if (language === 'ar') {
    return [
      'مرحبا، أريد التسجيل في الخدمة.',
      `الاسم: ${name || 'غير محدد'}`,
      `البريد الإلكتروني: ${email || 'غير محدد'}`,
      `المجال المختار: ${domain}`,
      `البلدان المختارة: ${countriesLabel}`,
      `مستوى اللغة: ${level}`,
      'أرغب في المتابعة مع مستشار.',
    ].join('\n')
  }

  return [
    'Bonjour, je veux m’inscrire au service.',
    `Nom: ${name || 'Non renseigné'}`,
    `Email: ${email || 'Non renseigné'}`,
    `Domaine choisi: ${domain}`,
    `Pays choisis: ${countriesLabel}`,
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
  const [selectedCountries, setSelectedCountries] = useState([])
  const [countrySearch, setCountrySearch] = useState('')
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState('B1')
  const [selectedDiploma, setSelectedDiploma] = useState('')
  const [diplomaDropdownOpen, setDiplomaDropdownOpen] = useState(false)
  const [leadSubmissionError, setLeadSubmissionError] = useState('')
  const [leadSubmissionSuccess, setLeadSubmissionSuccess] = useState('')
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [brandLogoFailed, setBrandLogoFailed] = useState(false)
  const countryPickerRef = useRef(null)
  const diplomaPickerRef = useRef(null)

  const isArabic = activeLanguage === 'ar'
  const t = (fr, ar) => (isArabic ? ar : fr)
  const tr = (text) => (isArabic ? AR_TEXT_MAP[text] ?? text : text)

  const countryFormatter = useMemo(() => {
    try {
      return new Intl.DisplayNames([isArabic ? 'ar' : 'fr'], { type: 'region' })
    } catch {
      return { of: (value) => value }
    }
  }, [isArabic])

  const countryOptions = useMemo(
    () =>
      ALL_COUNTRY_CODES
        .map((code) => ({
          code,
          label: countryFormatter.of(code) || code,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, isArabic ? 'ar' : 'fr')),
    [countryFormatter, isArabic],
  )

  const countryLabelByCode = useMemo(
    () => Object.fromEntries(countryOptions.map((country) => [country.code, country.label])),
    [countryOptions],
  )

  const filteredCountryOptions = useMemo(() => {
    const query = countrySearch.trim().toLowerCase()

    if (!query) {
      return countryOptions
    }

    return countryOptions.filter((country) => {
      const label = country.label.toLowerCase()
      const code = country.code.toLowerCase()
      return label.includes(query) || code.includes(query)
    })
  }, [countryOptions, countrySearch])

  const selectedCountryLabels = useMemo(
    () => selectedCountries.map((code) => countryLabelByCode[code] || code),
    [countryLabelByCode, selectedCountries],
  )

  const handleCountrySelect = (countryCode) => {
    setSelectedCountries((previous) => {
      if (previous[0] === countryCode) {
        return []
      }

      return [countryCode]
    })
    setCountryDropdownOpen(false)
    setCountrySearch('')
  }

  const handleCountryChipRemove = (countryCode) => {
    setSelectedCountries((previous) => previous.filter((code) => code !== countryCode))
  }

  useEffect(() => {
    if (!countryDropdownOpen) {
      return
    }

    const handleOutsideClick = (event) => {
      if (countryPickerRef.current && !countryPickerRef.current.contains(event.target)) {
        setCountryDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [countryDropdownOpen])

  useEffect(() => {
    if (!diplomaDropdownOpen) {
      return
    }

    const handleOutsideClick = (event) => {
      if (diplomaPickerRef.current && !diplomaPickerRef.current.contains(event.target)) {
        setDiplomaDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [diplomaDropdownOpen])

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
      `Bonjour, je veux plus d'informations sur le domaine ${branchTitle} au Canada, en Allemagne ou en Europe.`,
      `مرحبا، أريد مزيدا من المعلومات حول تخصص ${branchTitle} في العالم.`,
    )

  const generalInfoMessage = t(
    'Bonjour, je veux des informations pour ma candidature au Canada, en Allemagne ou en Europe.',
    'مرحبا، أريد معلومات حول طلبي في كندا أو ألمانيا أو أوروبا.',
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
    countries: selectedCountryLabels,
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

    if (selectedCountries.length === 0) {
      setLeadSubmissionError(t('Veuillez choisir au moins un pays cible.', 'يرجى اختيار دولة واحدة على الأقل.'))
      return false
    }

    if (!selectedDiploma || selectedDiploma === 'none') {
      setLeadSubmissionError(t('Veuillez choisir un type de diplôme de langue.', 'يرجى اختيار نوع شهادة اللغة.'))
      return false
    }

    await trackAnalyticsEvent('lead_submit_attempt', source, {
      domain: selectedDomain,
      targetCountriesCount: selectedCountries.length,
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
          targetCountries: selectedCountries,
          languageLevel: selectedLevel,
          languageDiploma: selectedDiploma,
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
        targetCountriesCount: selectedCountries.length,
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

    const emailSubject = encodeURIComponent(t('Nouvelle candidature - Service Carriere Internationale', 'طلب جديد - خدمة المسار المهني الدولي'))
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
            <div className="brand-mark">
              {!brandLogoFailed ? (
                <img
                  src={BRAND_LOGO_PATH}
                  alt={t('Logo GOGLOBAL', 'شعار GOGLOBAL')}
                  className="brand-logo"
                  loading="eager"
                  onError={() => setBrandLogoFailed(true)}
                />
              ) : (
                <Briefcase className="icon-sm" />
              )}
            </div>
            <div>
              <p className="brand-title">{t('Service Carriere Internationale', 'خدمة المسار المهني الدولي')}</p>
              <p className="brand-subtitle">{t('Emploi international • Formation • Accompagnement dossier', 'وظائف دولية • تكوين • مواكبة الملف')}</p>
            </div>
          </div>

          <div className="topbar-actions">
            <p className="topbar-note">{t('Accompagnement professionnel pour candidater au Canada, en Allemagne et en Europe', 'مرافقة مهنية للتقديم في كندا وألمانيا وأوروبا')}</p>
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
            <div className="eyebrow"><Sparkles className="icon-xs" /> {t('Accompagnement complet pour travailler ou se former au Canada, en Allemagne et en Europe', 'مرافقة كاملة للعمل أو التكوين في كندا وألمانيا وأوروبا')}</div>

            <h1>
              {t('Construisez votre chemin', 'ابنِ طريقك')}
              <br />
              <span className="hero-line-accent">{t('au Canada, en Europe ou en Asie.', 'في كندا وأوروبا وآسيا.')}</span>
            </h1>

            <p className="hero-text">{t('Nous identifions les bonnes offres, adaptons votre dossier et vous accompagnons jusqu’au contact avec les recruteurs.', 'نحدد الفرص المناسبة، نجهز ملفك بطريقة احترافية، ونرافقك حتى التواصل مع جهات التوظيف.')}</p>

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
          <img
            className="promo-video"
            src={servicesPlaceholderImage}
            alt={t('Logo GOGLOBAL', 'شعار GOGLOBAL')}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = '/services-placeholder.svg'
            }}
          />

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
            return (
              <Animated.div
                key={branch.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <details className="branch-card glass-card">
                  <summary className="branch-summary">
                    <span className="branch-summary-title">{branch.title}</span>
                    <span className="branch-summary-chevron" aria-hidden="true">
                      <ArrowRight className="icon-xs" />
                    </span>
                  </summary>
                  <CardContent className="card-content branch-card-content">
                    <p className="branch-summary-text">{tr(branch.subtitle)}</p>
                    <ul className="branch-details">
                      {branch.details.map((detail) => (
                        <li key={detail} className="branch-detail-item">
                          <AlertCircle className="icon-xs" />
                          <span>{localizeBranchDetail(detail)}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      type="button"
                      size="sm"
                      className="branch-cta"
                      onClick={() => openRotatingWhatsAppLink(branchQuestionMessage(branch.title))}
                    >
                      {t('Poser une question sur WhatsApp', 'اطرح سؤالك على واتساب')} <ArrowRight className="icon-xs ml-2" />
                    </Button>
                  </CardContent>
                </details>
              </Animated.div>
            )
          })}
        </div>
      </section>

      <section className="content-section offers-section" id="offers">
        <div className="section-intro">
          <p className="section-kicker">{t('Nos offres', 'عروضنا')}</p>
          <h2>{t('Choisissez le niveau d’accompagnement qui vous convient', 'اختر مستوى المواكبة المناسب لك')}</h2>
          <p>{t('Des offres claires pour avancer rapidement, selon votre objectif et votre budget.', 'عروض واضحة للتقدم بسرعة حسب هدفك وميزانيتك.')}</p>
        </div>

        <div className="offer-grid">
          {serviceOffers.map((offer, index) => {
            const Icon = offer.icon
            const features = isArabic ? offer.featuresAr : offer.featuresFr
            return (
              <Animated.div
                key={offer.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: index * 0.06 }}
              >
                <Card className={`glass-card offer-card ${offer.id === 'pro' ? 'offer-card-featured' : ''}`}>
                  <CardContent className="card-content">
                    <div className="offer-head">
                      <div className="service-icon-wrap"><Icon className="icon-sm success-text" /></div>
                      <div>
                        <h3>{isArabic ? offer.nameAr : offer.nameFr}</h3>
                        <p>{isArabic ? offer.subtitleAr : offer.subtitleFr}</p>
                      </div>
                    </div>

                    <ul className="offer-features">
                      {features.map((feature) => (
                        <li key={feature}>
                          <CheckCircle2 className="icon-xs success" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      type="button"
                      className="offer-cta"
                      onClick={() => scrollToSection('contact')}
                      aria-label={t('Choisir cette offre', 'اختيار هذه الباقة')}
                    >
                      {t('Choisir cette offre', 'اختيار هذه الباقة')} <ArrowRight className="icon-xs ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Animated.div>
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
            <Card className="glass-card side-card alt-card"><CardContent className="card-content"><h3>{t('Idéal pour', 'مناسب لـ')}</h3><div className="tag-grid">{['Étudiants', 'Jeunes diplômés', 'Débutants dans les candidatures internationales', 'Candidats en formation professionnelle', 'Personnes qui veulent partir travailler au Canada, en Allemagne ou en Europe', 'Personnes ayant besoin d’aide pour leurs documents'].map((group) => (<div key={group} className="tag-item">{tr(group)}</div>))}</div></CardContent></Card>
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
                <legend>{t('Niveau de langue (anglais / allemand)', 'مستوى اللغة (الإنجليزية / الألمانية)')}</legend>
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

              <div className="diploma-picker" ref={diplomaPickerRef}>
                <label className="country-picker-label" htmlFor="language-diploma-trigger">
                  {t('Type de diplôme de langue (obligatoire)', 'نوع شهادة اللغة (إجباري)')}
                </label>
                <button
                  id="language-diploma-trigger"
                  type="button"
                  className={`ui-input diploma-trigger ${diplomaDropdownOpen ? 'diploma-trigger-open' : ''}`}
                  onClick={() => setDiplomaDropdownOpen((open) => !open)}
                  aria-haspopup="listbox"
                  aria-expanded={diplomaDropdownOpen}
                  aria-label={t('Choisir un type de diplôme de langue', 'اختر نوع شهادة اللغة')}
                >
                  <span className="diploma-trigger-value">
                    {isArabic
                      ? languageDiplomas.find((diploma) => diploma.value === selectedDiploma)?.labelAr ?? t('Aucun diplôme', 'لا يوجد شهادة')
                      : languageDiplomas.find((diploma) => diploma.value === selectedDiploma)?.label ?? t('Aucun diplôme', 'لا يوجد شهادة')}
                  </span>
                  <span className="diploma-trigger-arrow" aria-hidden="true">▾</span>
                </button>

                {diplomaDropdownOpen && (
                  <div className="country-dropdown diploma-dropdown" role="listbox" aria-label={t('Types de diplômes de langue', 'أنواع شهادات اللغة')}>
                    {languageDiplomas.map((diploma) => {
                      const selected = selectedDiploma === diploma.value
                      const isDisabledNone = diploma.value === 'none'

                      return (
                        <button
                          key={diploma.value}
                          type="button"
                          className={`country-dropdown-item diploma-option ${selected ? 'country-dropdown-item-selected' : ''} ${isDisabledNone ? 'diploma-option-disabled' : ''}`}
                          onClick={() => {
                            if (!isDisabledNone) {
                              setSelectedDiploma(diploma.value)
                              setDiplomaDropdownOpen(false)
                            }
                          }}
                          aria-selected={selected}
                          disabled={isDisabledNone}
                        >
                          <span>{isArabic ? diploma.labelAr : diploma.label}</span>
                          {selected && <CheckCircle2 className="icon-xs success" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="country-picker">
                <label htmlFor="target-countries" className="country-picker-label">
                  {t('Pays cible (choix unique)', 'الدولة المستهدفة (اختيار واحد)')}
                </label>
                <div className="country-combobox" ref={countryPickerRef}>
                  <div className={`country-combobox-input-wrap ${countryDropdownOpen ? 'country-combobox-input-wrap-open' : ''}`}>
                    <Search className="icon-sm country-search-icon" />
                    <Input
                      id="target-countries"
                      className="country-search-input"
                      placeholder={t('Rechercher un pays (ex: Canada, Allemagne, Maroc...)', 'ابحث عن دولة (مثال: كندا، ألمانيا، المغرب...)')}
                      value={countrySearch}
                      onFocus={() => setCountryDropdownOpen(true)}
                      onChange={(event) => {
                        setCountrySearch(event.target.value)
                        setCountryDropdownOpen(true)
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                          setCountryDropdownOpen(false)
                        }
                      }}
                      aria-label={t('Rechercher dans la liste des pays', 'البحث داخل قائمة الدول')}
                    />
                  </div>

                  {countryDropdownOpen && (
                    <div className="country-dropdown" role="listbox" aria-label={t('Liste des pays', 'قائمة الدول')}>
                      {filteredCountryOptions.map((country) => {
                        const selected = selectedCountries.includes(country.code)

                        return (
                          <button
                            key={country.code}
                            type="button"
                            className={`country-dropdown-item ${selected ? 'country-dropdown-item-selected' : ''}`}
                            onClick={() => handleCountrySelect(country.code)}
                            aria-selected={selected}
                          >
                            <span>{country.label}</span>
                            {selected && <CheckCircle2 className="icon-xs success" />}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {selectedCountryLabels.length > 0 && (
                  <div className="country-chip-list" aria-label={t('Pays selectionne', 'الدولة المختارة')}>
                    {selectedCountries.map((countryCode) => (
                      <button
                        key={countryCode}
                        type="button"
                        className="country-chip"
                        onClick={() => handleCountryChipRemove(countryCode)}
                        aria-label={t(`Retirer ${countryLabelByCode[countryCode] || countryCode}`, `إزالة ${countryLabelByCode[countryCode] || countryCode}`)}
                      >
                        {countryLabelByCode[countryCode] || countryCode}
                      </button>
                    ))}
                  </div>
                )}

                {filteredCountryOptions.length === 0 && (
                  <p className="country-picker-empty">{t('Aucun pays trouvé pour cette recherche.', 'لم يتم العثور على دولة بهذه الكلمات.')}</p>
                )}
                <p className="country-picker-help">
                  {t(
                    `Choix unique: 1 pays maximum. Selectionne: ${selectedCountries.length}`,
                    `اختيار واحد فقط: دولة واحدة كحد أقصى. المختارة: ${selectedCountries.length}`,
                  )}
                </p>
              </div>

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

