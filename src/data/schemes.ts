export interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  code: string;
  shortDesc: string;
  shortDescHi: string;
  eligibility: {
    minEducation: string[];
    maxIncome: number; // in INR per annum (Infinity for no ceiling)
    subCategories: ('ST' | 'PVTG')[];
    minMarksPercentage?: number;
  };
  benefits: {
    amount: string;
    duration: string;
    contingency: string;
    details: string;
  };
  ministryWing: string;
  applicationDeadline: string;
  totalSeats?: number;
}

export const SCHEMES: Scheme[] = [
  {
    id: 'nfst',
    name: 'National Fellowship for Higher Education of ST Students (NFST)',
    nameHi: 'अनुसूचित जनजाति छात्रों के उच्च अध्ययन हेतु राष्ट्रीय अध्येतावृत्ति (NFST)',
    code: 'MOTA-NFST-2026',
    shortDesc: 'Financial assistance to ST students pursuing regular full-time M.Phil. and Ph.D. degrees in Indian Universities/Institutions.',
    shortDescHi: 'भारतीय विश्वविद्यालयों में नियमित एम.फिल और पीएचडी करने वाले एसटी छात्रों को मासिक अध्येतावृत्ति।',
    eligibility: {
      minEducation: ['M.Phil', 'Ph.D.'],
      maxIncome: 600000,
      subCategories: ['ST', 'PVTG'],
      minMarksPercentage: 55,
    },
    benefits: {
      amount: '₹37,000 / month (JRF) & ₹42,000 / month (SRF)',
      duration: 'Up to 5 Years',
      contingency: '₹20,500/year (Hum/Social) to ₹25,000/year (Sci)',
      details: '100% tuition coverage + HRA + Escort allowances for differently-abled scholars.',
    },
    ministryWing: 'Higher Education Wing, MoTA',
    applicationDeadline: '30 October 2026',
    totalSeats: 750,
  },
  {
    id: 'nos',
    name: 'National Overseas Scholarship for ST Candidates (NOS)',
    nameHi: 'अनुसूचित जनजाति उम्मीदवारों के लिए राष्ट्रीय प्रवासी छात्रवृत्ति (NOS)',
    code: 'MOTA-NOS-2026',
    shortDesc: 'Full funding for meritorious ST candidates pursuing Master’s, Ph.D., and Post-Doctoral studies at top 500 QS-ranked foreign universities.',
    shortDescHi: 'शीर्ष 500 विदेशी विश्वविद्यालयों में मास्टर्स और पीएचडी करने वाले मेधावी एसटी छात्रों को पूर्ण वित्तपोषण।',
    eligibility: {
      minEducation: ['Post Graduate', 'M.Phil', 'Ph.D.'],
      maxIncome: 600000,
      subCategories: ['ST', 'PVTG'],
      minMarksPercentage: 60,
    },
    benefits: {
      amount: 'Full Tuition Fees + US $15,400 / £9,900 Annual Maintenance',
      duration: 'Course duration (1 to 4 years)',
      contingency: 'US $1,500 / £1,100 + Economy Airfare & Visa Fees',
      details: 'Comprehensive global health insurance and return flight tickets included.',
    },
    ministryWing: 'Overseas Cell, MoTA',
    applicationDeadline: '15 November 2026',
    totalSeats: 100,
  },
  {
    id: 'top-class',
    name: 'National Scholarship for Higher Education (Top Class Education Scheme)',
    nameHi: 'एसटी छात्रों के लिए श्रेष्ठ संस्थान छात्रवृत्ति योजना (टॉप क्लास एजुकेशन)',
    code: 'MOTA-TCES-2026',
    shortDesc: 'Full financial support to ST students who secure admission in notified premier institutions (IITs, IIMs, NITs, AIIMS, NLU, etc.).',
    shortDescHi: 'आईआईटी, आईआईएम, एम्स और एनएलयू जैसे अधिसूचित प्रतिष्ठित संस्थानों में प्रवेश पाने वाले एसटी छात्रों हेतु।',
    eligibility: {
      minEducation: ['Undergraduate', 'Post Graduate'],
      maxIncome: 600000,
      subCategories: ['ST', 'PVTG'],
      minMarksPercentage: 50,
    },
    benefits: {
      amount: 'Full Tuition & Non-refundable Fees (up to ₹2.0 Lakhs in private inst.)',
      duration: 'Complete duration of the degree',
      contingency: '₹3,000/month living + ₹2,220/year books + ₹45,000 computer grant',
      details: 'One-time laptop/computer grant and recurring living expenditure assistance.',
    },
    ministryWing: 'Tribal Welfare Directorate',
    applicationDeadline: '25 October 2026',
    totalSeats: 1000,
  },
  {
    id: 'pm-janman',
    name: 'PM-JANMAN PVTG Special Education & Research Grant',
    nameHi: 'पीएम-जनमन पीवीटीजी विशेष शिक्षा एवं अनुसंधान अनुदान',
    code: 'MOTA-JANMAN-2026',
    shortDesc: 'Dedicated accelerated fellowship package exclusively for Particularly Vulnerable Tribal Groups (PVTGs) with relaxed income verification.',
    shortDescHi: 'विशेष रूप से कमजोर जनजातीय समूहों (PVTG) के लिए समर्पित तीव्र अध्येतावृत्ति पैकेज।',
    eligibility: {
      minEducation: ['Higher Secondary', 'Undergraduate', 'Post Graduate', 'M.Phil', 'Ph.D.'],
      maxIncome: 800000,
      subCategories: ['PVTG'],
      minMarksPercentage: 45,
    },
    benefits: {
      amount: '₹40,000 / month + 100% Institutional waiver',
      duration: 'Complete tenure',
      contingency: '₹35,000/year unconditional tribal research equipment fund',
      details: 'Priority direct bank transfer under PM-JANMAN mission with community mentor support.',
    },
    ministryWing: 'Special PVTG Mission Wing, MoTA',
    applicationDeadline: 'Open Year-Round',
    totalSeats: 500,
  },
  {
    id: 'post-matric',
    name: 'Post-Matric Scholarship Scheme for ST Students',
    nameHi: 'अनुसूचित जनजाति छात्रों के लिए मैट्रिकोत्तर छात्रवृत्ति योजना',
    code: 'MOTA-PMSS-2026',
    shortDesc: 'State-administered DBT scholarship enabling ST students to complete post-matriculation or post-secondary courses.',
    shortDescHi: 'कक्षा 11वीं, 12वीं और स्नातक करने वाले एसटी छात्रों हेतु राज्य-प्रशासित डीबीटी छात्रवृत्ति।',
    eligibility: {
      minEducation: ['Higher Secondary', 'Undergraduate', 'Post Graduate'],
      maxIncome: 250000,
      subCategories: ['ST', 'PVTG'],
      minMarksPercentage: 40,
    },
    benefits: {
      amount: 'Compulsory non-refundable fees + ₹1,200 to ₹1,400 monthly allowance',
      duration: 'Annual renewal until course completion',
      contingency: 'Study tour & book grant allowances',
      details: 'Direct Benefit Transfer (DBT) directly into Aadhaar-seeded bank account.',
    },
    ministryWing: 'Centrally Sponsored Scheme Cell',
    applicationDeadline: '30 November 2026',
    totalSeats: 300000,
  },
];

export interface StudentMatchCriteria {
  educationLevel: string;
  annualIncome: number;
  subCategory: 'ST' | 'PVTG';
  fieldOfStudy: string;
  percentageScore: number;
}

export function matchSchemes(criteria: StudentMatchCriteria): { scheme: Scheme; matchScore: number; reasons: string[] }[] {
  return SCHEMES.map(scheme => {
    let score = 0;
    const reasons: string[] = [];

    // Check SubCategory
    if (scheme.eligibility.subCategories.includes(criteria.subCategory)) {
      score += 35;
      reasons.push(criteria.subCategory === 'PVTG' ? 'Eligible under PVTG affirmative category priority' : 'Eligible for Scheduled Tribe quotas');
    }

    // Check Education level
    if (scheme.eligibility.minEducation.includes(criteria.educationLevel)) {
      score += 35;
      reasons.push(`Degree level (${criteria.educationLevel}) satisfies scheme criteria`);
    } else {
      score -= 20;
    }

    // Check Income
    if (criteria.annualIncome <= scheme.eligibility.maxIncome) {
      score += 20;
      reasons.push(`Family income (₹${criteria.annualIncome.toLocaleString('en-IN')}) is within limit of ₹${scheme.eligibility.maxIncome.toLocaleString('en-IN')}`);
    } else {
      score -= 30;
      reasons.push(`Income exceeds scheme limit of ₹${scheme.eligibility.maxIncome.toLocaleString('en-IN')}`);
    }

    // Academic merit
    const minMarks = scheme.eligibility.minMarksPercentage || 40;
    if (criteria.percentageScore >= minMarks) {
      score += 10;
      reasons.push(`Academic score (${criteria.percentageScore}%) clears threshold (${minMarks}%)`);
    }

    const normalizedScore = Math.max(10, Math.min(99, score));
    return { scheme, matchScore: normalizedScore, reasons };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
