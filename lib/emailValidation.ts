/**
 * Email validation and typo correction utility for Maison Ovelzya
 */

export interface EmailValidationResult {
  isValid: boolean;
  isEmpty: boolean;
  errorMessage?: string;
  suggestedEmail?: string;
  domain?: string;
  isCommonProvider?: boolean;
}

const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  // Gmail typos
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gmaile.com': 'gmail.com',
  'gmail.fr': 'gmail.com',
  'gmai.fr': 'gmail.com',
  'gmaill.fr': 'gmail.com',
  'gmail.co': 'gmail.com',

  // Yahoo typos
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yaho.fr': 'yahoo.fr',
  'yahooo.fr': 'yahoo.fr',
  'yhaoo.com': 'yahoo.com',

  // Hotmail & Outlook typos
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'hotmial.fr': 'hotmail.fr',
  'hotmai.fr': 'hotmail.fr',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outlock.com': 'outlook.com',
  'outlok.fr': 'outlook.fr',

  // iCloud typos
  'iclou.com': 'icloud.com',
  'iclould.com': 'icloud.com',
  'iclud.com': 'icloud.com',

  // Menara (Morocco)
  'menara.ma': 'menara.ma',
  'manara.ma': 'menara.ma',
};

const COMMON_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'yahoo.fr',
  'hotmail.com',
  'hotmail.fr',
  'outlook.com',
  'outlook.fr',
  'icloud.com',
  'live.com',
  'live.fr',
  'orange.fr',
  'wanadoo.fr',
  'menara.ma',
];

export function validateEmail(rawEmail: string): EmailValidationResult {
  const email = (rawEmail || '').trim();

  if (!email) {
    return {
      isValid: false,
      isEmpty: true,
      errorMessage: 'Veuillez renseigner votre adresse e-mail',
    };
  }

  // Basic RFC 5322 compatible syntax regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(email)) {
    // Check specific common flaws
    if (!email.includes('@')) {
      return {
        isValid: false,
        isEmpty: false,
        errorMessage: 'Le symbole « @ » est manquant dans votre adresse e-mail',
      };
    }

    const parts = email.split('@');
    if (parts.length > 2) {
      return {
        isValid: false,
        isEmpty: false,
        errorMessage: 'L’adresse ne doit contenir qu’un seul symbole « @ »',
      };
    }

    const domain = parts[1] || '';
    if (!domain.includes('.')) {
      return {
        isValid: false,
        isEmpty: false,
        errorMessage: 'Le domaine doit comporter une extension (ex: .com, .ma, .fr)',
      };
    }

    return {
      isValid: false,
      isEmpty: false,
      errorMessage: 'Format de l’adresse e-mail invalide',
    };
  }

  const [username, domain] = email.split('@');
  const lowerDomain = domain.toLowerCase();

  // Check for common domain typos
  let suggestedEmail: string | undefined;
  if (COMMON_DOMAIN_TYPOS[lowerDomain] && COMMON_DOMAIN_TYPOS[lowerDomain] !== lowerDomain) {
    suggestedEmail = `${username}@${COMMON_DOMAIN_TYPOS[lowerDomain]}`;
  }

  const isCommonProvider = COMMON_DOMAINS.includes(lowerDomain);

  // Check domain TLD length
  const domainParts = lowerDomain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return {
      isValid: false,
      isEmpty: false,
      errorMessage: 'Extension de domaine (.ma, .com, .fr, etc.) invalide',
      domain: lowerDomain,
    };
  }

  return {
    isValid: true,
    isEmpty: false,
    suggestedEmail,
    domain: lowerDomain,
    isCommonProvider,
  };
}

export function isEmailValid(email: string): boolean {
  return validateEmail(email).isValid;
}
