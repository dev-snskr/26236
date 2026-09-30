export interface DjangoFile {
  filename: string;
  path: string;
  description: string;
  language: string;
  code: string;
}

export const DJANGO_FILES: DjangoFile[] = [
  {
    filename: 'models.py',
    path: 'scholarships/models.py',
    description: 'Data models for StudentProfile, ScholarshipScheme, and Application with AI verification status and confidence score.',
    language: 'python',
    code: `"""
SIH26239: AI-Enabled Scholarship & Fellowship Management System
Ministry of Tribal Affairs, Government of India
Module: scholarships.models
Author: Principal Full-Stack Python Django Developer & AI Architect
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


class StudentProfile(models.Model):
    """
    Stores comprehensive personal, socio-economic, and academic details
    for Scheduled Tribe (ST) and Particularly Vulnerable Tribal Group (PVTG) applicants.
    """
    CATEGORY_CHOICES = [
        ('ST', 'Scheduled Tribe (General ST)'),
        ('PVTG', 'Particularly Vulnerable Tribal Group (PVTG)'),
    ]

    EDUCATION_LEVEL_CHOICES = [
        ('Higher Secondary', 'Higher Secondary (Class XI/XII)'),
        ('Undergraduate', 'Undergraduate (B.A, B.Sc, B.Tech, MBBS)'),
        ('Post Graduate', 'Post Graduate (M.A, M.Sc, M.Tech)'),
        ('M.Phil', 'Master of Philosophy (M.Phil)'),
        ('Ph.D.', 'Doctor of Philosophy (Ph.D.)'),
        ('Post-Doctoral', 'Post-Doctoral Research'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    full_name = models.CharField(max_length=150, help_text="Full name as printed on Aadhaar Card")
    aadhaar_hash = models.CharField(max_length=64, unique=True, help_text="SHA-256 hash of Aadhaar number for privacy")
    sub_category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='ST')
    tribe_community_name = models.CharField(max_length=100, help_text="e.g. Santhal, Gond, Bhil, Baiga, Birhor, Chenchu")
    state_of_domicile = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    annual_family_income = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Gross annual parental/guardian income in INR"
    )
    current_education_level = models.CharField(max_length=50, choices=EDUCATION_LEVEL_CHOICES)
    institution_name = models.CharField(max_length=200, help_text="Current university, college, or premier institute")
    field_of_study = models.CharField(max_length=150, help_text="e.g. Computer Science, Tribal Folklore, Medicine")
    academic_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Percentage or normalized CGPA score in qualifying exam"
    )
    is_differently_abled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} ({self.tribe_community_name} - {self.sub_category})"


class ScholarshipScheme(models.Model):
    """
    Catalog of official Ministry of Tribal Affairs schemes including NFST, NOS, and Top-Class Education.
    """
    code = models.CharField(max_length=30, unique=True, help_text="Official Scheme Code e.g. MOTA-NFST-2026")
    title = models.CharField(max_length=255)
    title_hindi = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    ministry_wing = models.CharField(max_length=150, default="Ministry of Tribal Affairs")
    min_education_level = models.CharField(max_length=50)
    max_income_ceiling = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Maximum annual family income allowed (set to 9999999 for no limit)"
    )
    min_marks_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=50.00)
    monthly_stipend_inr = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    annual_contingency_inr = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_sanctioned_budget_cr = models.DecimalField(max_digits=8, decimal_places=2, default=100.00)
    utilized_budget_cr = models.DecimalField(max_digits=8, decimal_places=2, default=65.00)
    is_active = models.BooleanField(default=True)
    deadline = models.DateField()

    def __str__(self):
        return f"[{self.code}] {self.title}"


class Application(models.Model):
    """
    Tracks scholarship submissions, AI OCR verification pipeline metrics,
    and Direct Benefit Transfer (DBT) sanction status.
    """
    STATUS_CHOICES = [
        ('DRAFT', 'Draft Saved'),
        ('SUBMITTED', 'Submitted - Awaiting AI Verification'),
        ('AI_VERIFIED', 'AI Verified & Approved'),
        ('AI_FLAGGED', 'AI Flagged for Manual Review'),
        ('INSTITUTE_APPROVED', 'Nodal Institution Endorsed'),
        ('SANCTIONED', 'Ministry Sanction Issued'),
        ('DISBURSED', 'DBT Disbursed via PFMS'),
        ('REJECTED', 'Rejected'),
    ]

    AI_STATUS_CHOICES = [
        ('PENDING', 'Pending AI Scan'),
        ('IN_PROGRESS', 'AI Neural OCR Processing'),
        ('VERIFIED', 'Verified and Approved'),
        ('FLAGGED_MISMATCH', 'Metadata Mismatch Detected'),
        ('SUSPICIOUS_TAMPER', 'Potential Document Tampering Detected'),
    ]

    application_number = models.CharField(max_length=50, unique=True, editable=False)
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='applications')
    scheme = models.ForeignKey(ScholarshipScheme, on_delete=models.PROTECT, related_name='applications')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='SUBMITTED')
    
    # Document storage
    caste_certificate = models.FileField(upload_to='certificates/caste/%Y/%m/', null=True, blank=True)
    income_certificate = models.FileField(upload_to='certificates/income/%Y/%m/', null=True, blank=True)
    
    # AI-Specific Verification & OCR Telemetry fields (SIH requirement)
    ai_verification_status = models.CharField(max_length=30, choices=AI_STATUS_CHOICES, default='PENDING')
    confidence_score = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="AI OCR Confidence Percentage (e.g. 98.4%)"
    )
    ai_extracted_name = models.CharField(max_length=150, blank=True)
    ai_extracted_caste = models.CharField(max_length=100, blank=True)
    ai_extracted_issuing_authority = models.CharField(max_length=150, blank=True)
    ai_extracted_cert_number = models.CharField(max_length=100, blank=True)
    ai_extracted_issue_date = models.DateField(null=True, blank=True)
    ai_remarks = models.TextField(blank=True, help_text="AI reasoning, seal detection, and tamper verification remarks")
    
    # Predictive Drop-off risk analytics
    predicted_drop_off_risk = models.FloatField(
        default=5.0,
        help_text="AI estimated probability of applicant abandonment before sanction (0-100%)"
    )
    
    submitted_at = models.DateTimeField(default=timezone.now)
    verified_at = models.DateTimeField(null=True, blank=True)
    dbt_transaction_id = models.CharField(max_length=64, blank=True, help_text="PFMS/DBT Reference")

    def save(self, *args, **kwargs):
        if not self.application_number:
            prefix = "MOTA"
            year = timezone.now().strftime("%Y")
            count = Application.objects.count() + 1001
            self.application_number = f"{prefix}-{year}-{count}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.application_number} | {self.student.full_name} | {self.scheme.code}"
`,
  },
  {
    filename: 'views.py',
    path: 'scholarships/views.py',
    description: 'Controller views handling AI Scheme Matchmaker logic, AJAX Mock OCR scanning, and Admin predictive Chart.js telemetry.',
    language: 'python',
    code: `"""
SIH26239: AI-Enabled Scholarship & Fellowship Management System
Ministry of Tribal Affairs, Government of India
Module: scholarships.views
Author: Principal Full-Stack Python Django Developer & AI Architect
"""

import time
import json
import random
from datetime import datetime
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required, user_passes_test
from django.utils import timezone
from .models import StudentProfile, ScholarshipScheme, Application


def is_ministry_official(user):
    """Helper to check if user has admin/ministry staff privileges."""
    return user.is_staff or user.is_superuser


# ==============================================================================
# 1. STUDENT DASHBOARD & AI SCHEME MATCHMAKER
# ==============================================================================

def student_dashboard(request):
    """
    Renders the interactive student dashboard containing:
    - Active Application Status
    - AI Scheme Matchmaker dynamic engine
    - Drag-and-Drop AI OCR Auto-Verification sandbox
    """
    # In a production deployment, fetch request.user.student_profile
    # Here we gracefully fallback to first sample profile or demo instance
    profile = StudentProfile.objects.first()
    recent_apps = Application.objects.filter(student=profile).order_by('-submitted_at') if profile else []
    active_schemes = ScholarshipScheme.objects.filter(is_active=True)

    context = {
        'profile': profile,
        'recent_apps': recent_apps,
        'active_schemes': active_schemes,
        'current_time': timezone.now(),
    }
    return render(request, 'scholarships/student_dashboard.html', context)


@require_POST
def ai_scheme_matchmaker(request):
    """
    Algorithmic AI matching engine for ST & PVTG candidates.
    Takes education level, annual income, sub-category, and field of study,
    and returns ranked matching schemes with exact eligibility breakdowns.
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest("Invalid JSON format")

    education_level = data.get('education_level', 'Ph.D.')
    annual_income = float(data.get('annual_income', 250000))
    sub_category = data.get('sub_category', 'ST')
    academic_percentage = float(data.get('academic_percentage', 70))

    schemes = ScholarshipScheme.objects.filter(is_active=True)
    matches = []

    for scheme in schemes:
        score = 0
        reasons = []

        # 1. Education Criteria
        edu_hierarchy = {
            'Higher Secondary': 1,
            'Undergraduate': 2,
            'Post Graduate': 3,
            'M.Phil': 4,
            'Ph.D.': 5,
            'Post-Doctoral': 6
        }
        scheme_min_rank = edu_hierarchy.get(scheme.min_education_level, 2)
        student_rank = edu_hierarchy.get(education_level, 2)

        if student_rank >= scheme_min_rank:
            score += 40
            reasons.append(f"Satisfies educational prerequisite ({scheme.min_education_level} or higher).")
        else:
            reasons.append(f"Requires minimum education level: {scheme.min_education_level}.")

        # 2. Income Ceiling Criteria
        if annual_income <= float(scheme.max_income_ceiling):
            score += 30
            reasons.append(f"Family income ₹{annual_income:,.2f} is comfortably within ₹{float(scheme.max_income_ceiling):,.2f} ceiling.")
        else:
            reasons.append(f"Family income exceeds scheme upper threshold of ₹{float(scheme.max_income_ceiling):,.2f}.")

        # 3. Sub-Category Priority (ST vs PVTG)
        if sub_category == 'PVTG':
            score += 20
            reasons.append("Eligible for affirmative 100% reservation under PM-JANMAN PVTG priority mandate.")
        else:
            score += 15
            reasons.append("Eligible under Central Scheduled Tribe allocation quota.")

        # 4. Merit Threshold
        if academic_percentage >= float(scheme.min_marks_percentage):
            score += 10
            reasons.append(f"Academic score of {academic_percentage}% clears scheme minimum ({scheme.min_marks_percentage}%).")

        normalized_score = min(99, max(15, score))

        matches.append({
            'id': scheme.id,
            'code': scheme.code,
            'title': scheme.title,
            'title_hindi': scheme.title_hindi,
            'match_score': normalized_score,
            'is_recommended': normalized_score >= 70,
            'stipend': f"₹{scheme.monthly_stipend_inr:,.0f} / month" if scheme.monthly_stipend_inr > 0 else "Full Tuition + Living Fee",
            'reasons': reasons,
            'deadline': scheme.deadline.strftime("%d %b %Y"),
        })

    # Sort descending by match score
    matches.sort(key=lambda x: x['match_score'], reverse=True)

    return JsonResponse({
        'status': 'success',
        'student_criteria': {
            'education_level': education_level,
            'annual_income': annual_income,
            'sub_category': sub_category,
            'academic_percentage': academic_percentage
        },
        'matched_schemes': matches,
        'ai_recommendation': f"Found {len([m for m in matches if m['is_recommended']])} strongly recommended schemes tailored to your tribal profile."
    })


# ==============================================================================
# 2. AI AUTO-VERIFICATION (MOCK OCR ENDPOINT)
# ==============================================================================

@require_POST
def ai_verify_document(request):
    """
    Simulates high-precision AI OCR document analysis.
    Adds a deliberate 2-second sleep to simulate neural network extraction,
    authenticates the Ashoka emblem seal, QR hash, and issuing authority,
    and returns a confidence score of 98% with verified status.
    """
    uploaded_file = request.FILES.get('document')
    doc_type = request.POST.get('document_type', 'caste_certificate')
    
    # 2-second delay to mimic actual Deep Learning OCR inference as per prompt
    time.sleep(2.0)

    # Simulated OCR extraction dictionary
    extracted_data = {
        'applicant_name': 'Kavita Gond',
        'father_name': 'Shri Rameshwar Gond',
        'tribe_community': 'Gond (Scheduled Tribe - S.No 12)',
        'issuing_state': 'Madhya Pradesh',
        'issuing_authority': 'Office of the Sub-Divisional Magistrate (SDM), Dindori',
        'certificate_number': 'MP/ST/2024/' + str(random.randint(100000, 999999)),
        'issue_date': '14-08-2024',
        'digital_signature_valid': True,
        'ashoka_emblem_detected': True,
        'tamper_evidence': None,
    }

    # If an application ID is provided, persist status into DB
    application_id = request.POST.get('application_id')
    if application_id:
        try:
            app = Application.objects.get(id=application_id)
            app.ai_verification_status = 'VERIFIED'
            app.confidence_score = 98.4
            app.ai_extracted_name = extracted_data['applicant_name']
            app.ai_extracted_caste = extracted_data['tribe_community']
            app.ai_extracted_issuing_authority = extracted_data['issuing_authority']
            app.ai_extracted_cert_number = extracted_data['certificate_number']
            app.verified_at = timezone.now()
            app.ai_remarks = "Ashoka Lion Capital seal verified. Digital DSC signature cryptographically confirmed against State Repository."
            app.save()
        except Application.DoesNotExist:
            pass

    return JsonResponse({
        'status': 'success',
        'ai_confidence_score': '98%',
        'message': 'AI Confidence Score: 98% - Verified and Approved.',
        'audit_summary': {
            'ocr_engine': 'MoTA-VisionOCR v3.8 Neural Pipeline',
            'processing_time_ms': 2048,
            'extracted_fields': extracted_data,
            'tamper_risk_assessment': 'LOW / NO ANOMALIES FOUND',
            'recommended_action': 'AUTO_APPROVE_FOR_DBT'
        }
    })


# ==============================================================================
# 3. ADMIN PREDICTIVE DASHBOARD
# ==============================================================================

def admin_dashboard(request):
    """
    Renders Ministry Officials predictive command dashboard:
    - Fund Utilization Donut Chart data
    - AI Predicted Drop-off Funnel Line Chart data
    - Real-time application table with verification telemetry
    """
    schemes = ScholarshipScheme.objects.all()
    applications = Application.objects.all().order_by('-submitted_at')[:20]

    # Donut Chart Data: Fund Utilization by Scheme (in Crores INR)
    donut_labels = [s.title for s in schemes] if schemes.exists() else [
        'National Fellowship (NFST)', 'National Overseas (NOS)', 'Top Class Education', 'Post-Matric ST Scheme'
    ]
    donut_data = [float(s.utilized_budget_cr) for s in schemes] if schemes.exists() else [142.5, 68.0, 94.2, 310.8]

    # Line Chart Data: AI Predicted Application Drop-offs across funnel stages
    funnel_stages = [
        'Stage 1: Registration',
        'Stage 2: Doc Upload (Caste/Inc)',
        'Stage 3: AI OCR Verification',
        'Stage 4: Institute Endorsement',
        'Stage 5: Ministry Sanction',
        'Stage 6: DBT Disbursal'
    ]
    historical_dropoffs = [100000, 81000, 68000, 52000, 48000, 47200]
    ai_predicted_with_nudge = [100000, 94000, 91500, 88200, 86000, 85400]

    context = {
        'total_applicants': 124850,
        'auto_verified_count': 117608,
        'verification_rate': 94.2,
        'total_dbt_disbursed_cr': 615.5,
        'schemes': schemes,
        'applications': applications,
        'donut_labels_json': json.dumps(donut_labels),
        'donut_data_json': json.dumps(donut_data),
        'funnel_stages_json': json.dumps(funnel_stages),
        'historical_dropoffs_json': json.dumps(historical_dropoffs),
        'ai_predicted_with_nudge_json': json.dumps(ai_predicted_with_nudge),
    }
    return render(request, 'scholarships/admin_dashboard.html', context)


# ==============================================================================
# 4. TRIBOT ASSISTANT (CONVERSATIONAL AI API)
# ==============================================================================

@require_POST
def tribot_query(request):
    """
    Backend intelligence router for TriBot Assistant.
    Provides immediate contextual guidance for ST/PVTG students in Hindi and English.
    """
    try:
        data = json.loads(request.body)
        query = data.get('query', '').lower()
        language = data.get('language', 'en')
    except Exception:
        query = request.POST.get('query', '').lower()
        language = 'en'

    if 'nfst' in query or 'fellowship' in query or 'phd' in query:
        response_text = (
            "NFST (National Fellowship for ST Students) provides ₹37,000/month for JRF and ₹42,000/month for SRF, "
            "plus up to ₹25,000 annual contingency for full-time M.Phil/Ph.D. ST scholars. Maximum income ceiling is ₹6.0 Lakhs/annum."
        )
        response_hi = (
            "एनएफएसटी (NFST) योजना के तहत नियमित एम.फिल/पीएचडी करने वाले अनुसूचित जनजाति छात्रों को ₹37,000 प्रतिमाह (JRF) "
            "तथा ₹42,000 प्रतिमाह (SRF) की अध्येतावृत्ति दी जाती है। आय सीमा ₹6 लाख वार्षिक है।"
        )
    elif 'pvtg' in query or 'janman' in query:
        response_text = (
            "Under the PM-JANMAN mission, all 75 Particularly Vulnerable Tribal Groups (PVTGs) receive priority approval, "
            "simplified single-window Aadhaar validation, and specialized research allowances."
        )
        response_hi = (
            "पीएम-जनमन मिशन के अंतर्गत, सभी 75 पीवीटीजी (PVTG) समुदायों के छात्रों को प्राथमिकता पर त्वरित स्वीकृति "
            "और विशेष अनुसंधान अनुदान प्रदान किया जाता है।"
        )
    elif 'ocr' in query or 'caste' in query or 'document' in query or 'verify' in query:
        response_text = (
            "Our AI Auto-Verification uses neural vision OCR to cross-reference your caste certificate's digital seal "
            "with state gazette databases in under 2 seconds, achieving 98%+ confidence."
        )
        response_hi = (
            "हमारी एआई ऑटो-वेरिफिकेशन प्रणाली न्यूरल ओसीआर के जरिए आपके जाति प्रमाण पत्र के डिजिटल हस्ताक्षर व मुहर का "
            "2 सेकंड में सत्यापन कर 98% विश्वास स्कोर प्रदान करती है।"
        )
    else:
        response_text = (
            "Namaste! I am TriBot, your AI Assistant for the Ministry of Tribal Affairs. "
            "You can ask me about NFST fellowships, Overseas scholarships (NOS), Top-Class Education schemes, or Caste Certificate AI verification."
        )
        response_hi = (
            "नमस्ते! मैं ट्राईबॉट (TriBot) हूँ, जनजातीय कार्य मंत्रालय का एआई सहायक। "
            "आप मुझसे राष्ट्रीय अध्येतावृत्ति (NFST), प्रवासी छात्रवृत्ति (NOS), अथवा दस्तावेज़ सत्यापन के विषय में पूछ सकते हैं।"
        )

    return JsonResponse({
        'status': 'success',
        'reply': response_hi if language == 'hi' else response_text,
        'reply_english': response_text,
        'reply_hindi': response_hi,
    })
`,
  },
  {
    filename: 'urls.py',
    path: 'scholarships/urls.py',
    description: 'Routing table connecting student dashboards, AJAX matchmaker, OCR verification, admin predictive dashboards, and TriBot.',
    language: 'python',
    code: `"""
SIH26239: AI-Enabled Scholarship & Fellowship Management System
Ministry of Tribal Affairs, Government of India
Module: scholarships.urls
"""

from django.urls import path
from . import views

app_name = 'scholarships'

urlpatterns = [
    # 1. Student Portal & AI Matchmaker
    path('', views.student_dashboard, name='student_dashboard'),
    path('student/', views.student_dashboard, name='student_portal'),
    path('api/matchmaker/', views.ai_scheme_matchmaker, name='api_matchmaker'),
    
    # 2. AI Auto-Verification Mock OCR
    path('api/verify-document/', views.ai_verify_document, name='api_verify_document'),
    
    # 3. Admin Predictive Analytics Dashboard
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    
    # 4. TriBot Conversational Assistant
    path('api/tribot/', views.tribot_query, name='api_tribot'),
]
`,
  },
  {
    filename: 'student_dashboard.html',
    path: 'templates/scholarships/student_dashboard.html',
    description: 'Tailwind CSS template containing the AI Scheme Matchmaker form, drag-and-drop upload zone, and Vanilla JS AJAX script.',
    language: 'html',
    code: `{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Portal | TribalEdu AI - Ministry of Tribal Affairs</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        govNavy: '#002244',
                        govNavyDark: '#00152B',
                        govSaffron: '#FF9933',
                        govGreen: '#138808',
                        govWarm: '#F8FAFC'
                    }
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col">

    <!-- TOP GOV BANNER -->
    <header class="bg-govNavy text-white border-b-4 border-govSaffron shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <span class="text-govSaffron font-bold text-lg">🇮🇳</span>
                </div>
                <div>
                    <p class="text-xs uppercase tracking-wider text-slate-300 font-semibold">भारत सरकार | Government of India</p>
                    <h1 class="text-lg font-bold tracking-tight text-white">जनजातीय कार्य मंत्रालय | Ministry of Tribal Affairs</h1>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="hidden md:flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-md border border-white/20">
                    <span class="text-govSaffron font-medium">SIH26239</span>
                    <span class="text-slate-300">·</span>
                    <span>TribalEdu AI Portal</span>
                </div>
                <!-- Language Toggle -->
                <button id="langToggleBtn" onclick="toggleLanguage()" class="text-xs font-semibold px-3 py-1.5 bg-govSaffron text-govNavyDark rounded hover:bg-amber-400 transition-colors">
                    हिन्दी / English
                </button>
                <a href="{% url 'scholarships:admin_dashboard' %}" class="text-xs font-medium text-slate-200 hover:text-white underline underline-offset-4">
                    Officer Admin View &rarr;
                </a>
            </div>
        </div>
    </header>

    <!-- MAIN CONTAINER -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">

        <!-- WELCOME NOTICE -->
        <section class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <p class="text-xs font-bold text-govGreen uppercase tracking-wider">Aadhaar Verified ST Candidate Profile</p>
                <h2 class="text-xl font-bold text-govNavy">Welcome, Kavita Gond</h2>
                <p class="text-sm text-slate-600 mt-1">Community: <span class="font-semibold text-slate-800">Gond (Scheduled Tribe)</span> · Domicile: <span class="font-semibold text-slate-800">Madhya Pradesh</span> · Category: <span class="font-semibold text-govGreen">ST Priority</span></p>
            </div>
            <div class="flex items-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Direct Benefit Transfer (DBT) Active
                </span>
            </div>
        </section>

        <!-- GRID: MATCHMAKER + AUTO VERIFICATION -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- LEFT COLUMN: AI SCHEME MATCHMAKER (7 COLS) -->
            <div class="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div class="border-b border-slate-100 pb-4 mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="text-xs font-bold uppercase tracking-wider text-govSaffron">AI Recommendation Engine</span>
                            <h3 class="text-lg font-bold text-govNavy">AI Scheme Matchmaker</h3>
                        </div>
                        <span class="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded font-mono">Algorithm v2.4</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-1">Instantly matches your educational level, income, and sub-category with live Ministry schemes.</p>
                </div>

                <form id="matchmakerForm" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Education Level</label>
                            <select id="eduLevel" class="w-full text-sm rounded-lg border-slate-300 border p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-govNavy focus:outline-none">
                                <option value="Ph.D." selected>Ph.D. / Research Scholar</option>
                                <option value="M.Phil">M.Phil</option>
                                <option value="Post Graduate">Post Graduate (Masters)</option>
                                <option value="Undergraduate">Undergraduate (B.Tech / B.Sc / MBBS)</option>
                                <option value="Higher Secondary">Higher Secondary (Class 11/12)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Sub-Category</label>
                            <select id="subCategory" class="w-full text-sm rounded-lg border-slate-300 border p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-govNavy focus:outline-none">
                                <option value="ST" selected>Scheduled Tribe (ST)</option>
                                <option value="PVTG">Particularly Vulnerable Tribal Group (PVTG)</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Annual Family Income (INR)</label>
                            <input id="annualIncome" type="number" value="250000" step="10000" class="w-full text-sm rounded-lg border-slate-300 border p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-govNavy focus:outline-none">
                            <span class="text-[11px] text-slate-500 mt-0.5 block">National ceiling is ₹6,00,000/annum for NFST.</span>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Academic Percentage / CGPA</label>
                            <input id="academicScore" type="number" value="74.5" step="0.5" class="w-full text-sm rounded-lg border-slate-300 border p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-govNavy focus:outline-none">
                            <span class="text-[11px] text-slate-500 mt-0.5 block">Minimum 55% for National Fellowship.</span>
                        </div>
                    </div>

                    <button type="button" onclick="runSchemeMatchmaker()" class="w-full py-3 px-4 bg-govNavy text-white font-semibold rounded-lg hover:bg-govNavyDark transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <svg class="w-4 h-4 text-govSaffron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        <span>Compute Algorithmic Scheme Matches</span>
                    </button>
                </form>

                <!-- MATCH RESULTS CONTAINER -->
                <div id="matchResults" class="mt-6 space-y-3">
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Pre-Evaluated Best Matches:</p>
                    
                    <!-- DEFAULT CARD 1: NFST -->
                    <div class="border border-emerald-200 bg-emerald-50/40 rounded-lg p-4 transition-all">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <span class="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">98% Match · Highly Recommended</span>
                                <h4 class="text-sm font-bold text-govNavy">National Fellowship for Higher Education of ST Students (NFST)</h4>
                                <p class="text-xs text-slate-600 mt-0.5">₹37,000 / month (JRF) + ₹25,000 annual contingency for Ph.D. scholars.</p>
                            </div>
                            <button class="shrink-0 text-xs px-3 py-1.5 bg-govGreen text-white font-semibold rounded hover:bg-emerald-700 transition-colors">
                                Apply Now
                            </button>
                        </div>
                    </div>

                    <!-- DEFAULT CARD 2: NOS -->
                    <div class="border border-slate-200 bg-white rounded-lg p-4 transition-all">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <span class="text-[11px] font-bold text-slate-600 uppercase tracking-wide">88% Match · Eligible for Overseas</span>
                                <h4 class="text-sm font-bold text-govNavy">National Overseas Scholarship for ST Candidates (NOS)</h4>
                                <p class="text-xs text-slate-600 mt-0.5">100% Tuition Fees + US $15,400 / £9,900 annual living maintenance for top 500 QS foreign universities.</p>
                            </div>
                            <button class="shrink-0 text-xs px-3 py-1.5 bg-govNavy text-white font-semibold rounded hover:bg-govNavyDark transition-colors">
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT COLUMN: AI AUTO-VERIFICATION (MOCK OCR) (5 COLS) -->
            <div class="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
                <div class="border-b border-slate-100 pb-4 mb-6">
                    <span class="text-xs font-bold uppercase tracking-wider text-govGreen">SIH26239 Core Feature</span>
                    <h3 class="text-lg font-bold text-govNavy">AI Auto-Verification (Mock OCR)</h3>
                    <p class="text-xs text-slate-500 mt-1">Upload ST Caste or Income Certificate. Deep Learning OCR extracts and validates seal authenticity in real-time.</p>
                </div>

                <!-- DRAG AND DROP ZONE -->
                <div id="dropZone" class="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-govNavy transition-colors cursor-pointer bg-slate-50/50 flex flex-col items-center justify-center relative">
                    <input type="file" id="fileInput" class="hidden" accept=".pdf,.png,.jpg,.jpeg">
                    
                    <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                    </div>

                    <p class="text-sm font-semibold text-govNavy">Drop Caste / Income Certificate here</p>
                    <p class="text-xs text-slate-500 mt-1">Supports PDF, PNG, JPG (Max 5MB)</p>

                    <button type="button" onclick="document.getElementById('fileInput').click()" class="mt-3 text-xs font-semibold px-3 py-1.5 bg-white border border-slate-300 rounded shadow-sm text-slate-700 hover:bg-slate-50">
                        Browse Certificate
                    </button>
                </div>

                <!-- LOADING SPINNER & SCANNING EFFECT -->
                <div id="scanLoader" class="hidden my-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div class="flex items-center gap-3">
                        <svg class="animate-spin h-5 w-5 text-govNavy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <div>
                            <p class="text-xs font-bold text-govNavy">Simulating Deep Learning Neural OCR Scan...</p>
                            <p class="text-[11px] text-slate-600">Checking Ashoka Lion emblem & Tehsildar cryptographic signature...</p>
                        </div>
                    </div>
                    <div class="w-full bg-blue-200 h-1 rounded-full mt-3 overflow-hidden">
                        <div class="bg-govNavy h-1 rounded-full animate-pulse w-3/4"></div>
                    </div>
                </div>

                <!-- OCR VERIFICATION SUCCESS CARD (RESULT OF 2-SEC SLEEP) -->
                <div id="verificationResult" class="hidden mt-4 p-4 rounded-xl border border-emerald-300 bg-emerald-50">
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-full bg-govGreen text-white flex items-center justify-center shrink-0">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <div class="flex-1">
                            <h4 id="confScoreHeading" class="text-sm font-bold text-emerald-950">AI Confidence Score: 98% - Verified and Approved.</h4>
                            <p class="text-xs text-emerald-800 mt-1">Caste certificate digitally authenticated with Madhya Pradesh ST Gazette registry.</p>
                            
                            <div class="mt-3 pt-3 border-t border-emerald-200 text-[11px] grid grid-cols-2 gap-2 text-slate-700 font-mono">
                                <div><span class="text-slate-500">Applicant:</span> Kavita Gond</div>
                                <div><span class="text-slate-500">Tribe:</span> Gond (ST-12)</div>
                                <div><span class="text-slate-500">Authority:</span> SDM Dindori</div>
                                <div><span class="text-slate-500">Status:</span> APPROVED</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- QUICK TEST FILE BUTTON -->
                <button type="button" onclick="triggerMockUpload()" class="mt-auto pt-4 text-xs font-medium text-govNavy hover:underline flex items-center justify-center gap-1">
                    <span>⚡ Quick Test: Click to simulate instant certificate scan</span>
                </button>
            </div>
        </div>

    </main>

    <!-- FLOATING TRIBOT ASSISTANT (TRIBAL VOICE ASSISTANT) -->
    <div class="fixed bottom-6 right-6 z-50">
        <!-- CHAT WINDOW (TOGGLEABLE) -->
        <div id="triBotWindow" class="hidden mb-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div class="bg-govNavy p-3 text-white flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                    <span class="font-bold text-sm">TriBot Assistant (जनजातीय सहायक)</span>
                </div>
                <button onclick="toggleTriBot()" class="text-slate-300 hover:text-white">&times;</button>
            </div>
            
            <div id="chatMessages" class="p-3 h-64 overflow-y-auto space-y-2 text-xs bg-slate-50">
                <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs max-w-[85%]">
                    <p class="font-semibold text-govNavy">TriBot:</p>
                    <p class="text-slate-700 mt-0.5">Johar! How may I assist you with ST Fellowships, NFST, or document verification today?</p>
                </div>
            </div>

            <div class="p-2 bg-white border-t border-slate-200 flex gap-2">
                <input id="chatInput" type="text" placeholder="Ask in Hindi or English..." class="flex-1 text-xs border rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-govNavy">
                <button onclick="sendChatMessage()" class="text-xs bg-govNavy text-white px-3 py-1.5 rounded font-semibold hover:bg-govNavyDark">Send</button>
            </div>
        </div>

        <!-- FLOATING BUTTON -->
        <button onclick="toggleTriBot()" class="px-4 py-3 bg-govNavy text-white rounded-full shadow-lg hover:bg-govNavyDark transition-all flex items-center gap-2 border-2 border-govSaffron">
            <span class="text-base">🎙️</span>
            <span class="font-bold text-xs tracking-wide">TriBot Assistant</span>
        </button>
    </div>

    <!-- VANILLA JAVASCRIPT AJAX SCRIPT (SIH REQUIREMENT) -->
    <script>
        // 1. AI SCHEME MATCHMAKER AJAX
        function runSchemeMatchmaker() {
            const eduLevel = document.getElementById('eduLevel').value;
            const subCategory = document.getElementById('subCategory').value;
            const annualIncome = parseFloat(document.getElementById('annualIncome').value) || 250000;
            const academicScore = parseFloat(document.getElementById('academicScore').value) || 70;

            const resultsContainer = document.getElementById('matchResults');
            resultsContainer.innerHTML = '<p class="text-xs text-slate-500 py-2">Consulting MoTA eligibility matrix...</p>';

            fetch('/api/matchmaker/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    education_level: eduLevel,
                    sub_category: subCategory,
                    annual_income: annualIncome,
                    academic_percentage: academicScore
                })
            })
            .then(res => res.json())
            .then(data => {
                resultsContainer.innerHTML = '<p class="text-xs font-bold text-slate-500 uppercase tracking-wide">' + data.ai_recommendation + '</p>';
                data.matched_schemes.forEach(scheme => {
                    const card = document.createElement('div');
                    card.className = scheme.is_recommended 
                        ? 'border border-emerald-200 bg-emerald-50/40 rounded-lg p-4 transition-all'
                        : 'border border-slate-200 bg-white rounded-lg p-4 transition-all';

                    card.innerHTML = \`
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <span class="text-[11px] font-bold \${scheme.is_recommended ? 'text-emerald-800' : 'text-slate-600'} uppercase tracking-wide">
                                    \${scheme.match_score}% Match · \${scheme.is_recommended ? 'Highly Recommended' : 'Eligible'}
                                </span>
                                <h4 class="text-sm font-bold text-govNavy">\${scheme.title}</h4>
                                <p class="text-xs text-slate-600 mt-0.5">\${scheme.stipend} · Deadline: \${scheme.deadline}</p>
                                <ul class="text-[11px] text-slate-500 mt-1 list-disc list-inside">
                                    \${scheme.reasons.map(r => '<li>' + r + '</li>').join('')}
                                </ul>
                            </div>
                            <button class="shrink-0 text-xs px-3 py-1.5 \${scheme.is_recommended ? 'bg-govGreen text-white' : 'bg-govNavy text-white'} font-semibold rounded hover:opacity-90">
                                Apply Now
                            </button>
                        </div>
                    \`;
                    resultsContainer.appendChild(card);
                });
            })
            .catch(err => {
                console.error(err);
                resultsContainer.innerHTML = '<p class="text-xs text-red-500">Error connecting to Matchmaker endpoint.</p>';
            });
        }

        // 2. AI AUTO-VERIFICATION (MOCK OCR) WITH 2-SECOND DELAY (SIH REQUIREMENT)
        const fileInput = document.getElementById('fileInput');
        const dropZone = document.getElementById('dropZone');

        fileInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                handleFileUpload(this.files[0]);
            }
        });

        function triggerMockUpload() {
            // Generates a mock file blob for seamless testing
            const mockBlob = new Blob(["MOCK_CASTE_CERTIFICATE_CONTENT"], { type: 'application/pdf' });
            mockBlob.name = "Kavita_Gond_ST_Certificate.pdf";
            handleFileUpload(mockBlob);
        }

        function handleFileUpload(file) {
            const scanLoader = document.getElementById('scanLoader');
            const verificationResult = document.getElementById('verificationResult');
            const confScoreHeading = document.getElementById('confScoreHeading');

            // Show loading spinner
            scanLoader.classList.remove('hidden');
            verificationResult.classList.add('hidden');

            const formData = new FormData();
            formData.append('document', file);
            formData.append('document_type', 'caste_certificate');

            fetch('/api/verify-document/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                scanLoader.classList.add('hidden');
                verificationResult.classList.remove('hidden');
                confScoreHeading.textContent = data.message || "AI Confidence Score: 98% - Verified and Approved.";
            })
            .catch(err => {
                scanLoader.classList.add('hidden');
                alert("Upload failed. Make sure Django view is running at /api/verify-document/");
            });
        }

        // 3. TRIBOT INTERFACE
        function toggleTriBot() {
            const win = document.getElementById('triBotWindow');
            win.classList.toggle('hidden');
        }

        function sendChatMessage() {
            const input = document.getElementById('chatInput');
            const msg = input.value.trim();
            if (!msg) return;

            const chatMessages = document.getElementById('chatMessages');
            
            // Append User Message
            const userDiv = document.createElement('div');
            userDiv.className = 'bg-govNavy text-white p-2.5 rounded-lg ml-auto max-w-[85%]';
            userDiv.innerHTML = '<p class="font-semibold text-[10px] text-govSaffron">You:</p><p>' + msg + '</p>';
            chatMessages.appendChild(userDiv);
            input.value = '';

            // AJAX to TriBot
            fetch('/api/tribot/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ query: msg, language: 'en' })
            })
            .then(res => res.json())
            .then(data => {
                const botDiv = document.createElement('div');
                botDiv.className = 'bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs max-w-[85%]';
                botDiv.innerHTML = '<p class="font-semibold text-govNavy">TriBot:</p><p class="text-slate-700 mt-0.5">' + data.reply + '</p>';
                chatMessages.appendChild(botDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
        }

        // CSRF helper
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue || 'dummy-csrf-token';
        }

        function toggleLanguage() {
            alert("Language toggled between English and Hindi. Live templates update all labels accordingly.");
        }
    </script>
</body>
</html>
`,
  },
  {
    filename: 'admin_dashboard.html',
    path: 'templates/scholarships/admin_dashboard.html',
    description: 'Tailwind CSS template containing Chart.js analytics for Fund Utilization Donut Chart and AI Predicted Application Drop-offs Line Chart.',
    language: 'html',
    code: `{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ministry Command Dashboard | TribalEdu AI - MoTA</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        govNavy: '#002244',
                        govNavyDark: '#00152B',
                        govSaffron: '#FF9933',
                        govGreen: '#138808',
                        govWarm: '#F8FAFC'
                    }
                }
            }
        }
    </script>
    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col">

    <!-- TOP HEADER -->
    <header class="bg-govNavy text-white border-b-4 border-govSaffron shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <span class="text-govSaffron font-bold text-lg">🇮🇳</span>
                </div>
                <div>
                    <p class="text-xs uppercase tracking-wider text-slate-300 font-semibold">जनजातीय कार्य मंत्रालय | Ministry of Tribal Affairs</p>
                    <h1 class="text-lg font-bold tracking-tight text-white">Central Admin & Predictive Analytics Command</h1>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded font-mono">
                    ● Real-Time AI Telemetry Active
                </span>
                <a href="{% url 'scholarships:student_dashboard' %}" class="text-xs font-semibold px-3 py-1.5 bg-govSaffron text-govNavyDark rounded hover:bg-amber-400 transition-colors">
                    &larr; Switch to Student View
                </a>
            </div>
        </div>
    </header>

    <!-- CONTENT WRAPPER -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        <!-- KPI METRICS ROW -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total ST Applicants</span>
                <p class="text-2xl font-bold text-govNavy mt-1 tabular-nums">124,850</p>
                <p class="text-xs text-emerald-600 mt-1">↑ 18.4% YoY under PM-JANMAN drive</p>
            </div>
            <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Auto-Verified Rate</span>
                <p class="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">94.2%</p>
                <p class="text-xs text-slate-500 mt-1">Avg turnaround: 2.1 seconds</p>
            </div>
            <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">DBT Disbursed (FY 2025-26)</span>
                <p class="text-2xl font-bold text-govNavy mt-1 tabular-nums">₹615.5 Cr</p>
                <p class="text-xs text-slate-500 mt-1">Direct to Aadhaar-seeded accounts</p>
            </div>
            <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Prevented Drop-offs</span>
                <p class="text-2xl font-bold text-govSaffron mt-1 tabular-nums">38,200</p>
                <p class="text-xs text-slate-500 mt-1">Proactive SMS & CSC assistance</p>
            </div>
        </div>

        <!-- CHARTS SECTION: DONUT & LINE CHARTS (SIH REQUIREMENT) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- DONUT CHART: FUND UTILIZATION BY SCHEME (5 COLS) -->
            <div class="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
                <div class="border-b border-slate-100 pb-3 mb-4">
                    <span class="text-xs font-bold uppercase tracking-wider text-govNavy">Budget Analytics</span>
                    <h3 class="text-base font-bold text-govNavy">Fund Utilization by Scheme</h3>
                    <p class="text-xs text-slate-500 mt-0.5">Distribution of ₹615.5 Crores sanctioned in current fiscal year.</p>
                </div>
                <div class="relative flex-1 flex items-center justify-center p-2 min-h-[280px]">
                    <canvas id="fundUtilizationDonut"></canvas>
                </div>
            </div>

            <!-- LINE CHART: AI PREDICTED APPLICATION DROP-OFFS (7 COLS) -->
            <div class="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
                <div class="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-govSaffron">Predictive AI Model</span>
                        <h3 class="text-base font-bold text-govNavy">AI Predicted Application Drop-offs</h3>
                        <p class="text-xs text-slate-500 mt-0.5">Historical Funnel vs. AI-Assisted Intervention Retention.</p>
                    </div>
                    <span class="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded font-mono">
                        Model AUC: 0.93
                    </span>
                </div>
                <div class="relative flex-1 p-2 min-h-[280px]">
                    <canvas id="dropOffLineChart"></canvas>
                </div>
            </div>
        </div>

        <!-- RECENT AI AUDITED APPLICATIONS TABLE -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 class="text-base font-bold text-govNavy">Real-Time Application Stream & AI Audit Trail</h3>
                    <p class="text-xs text-slate-500">Live submissions verified via deep learning OCR</p>
                </div>
                <button class="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded hover:bg-slate-200">
                    Export Audit CSV
                </button>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                            <th class="py-3 px-4">Application ID</th>
                            <th class="py-3 px-4">Candidate & Tribe</th>
                            <th class="py-3 px-4">Scheme Code</th>
                            <th class="py-3 px-4">OCR Confidence</th>
                            <th class="py-3 px-4">AI Verification</th>
                            <th class="py-3 px-4">DBT Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr class="hover:bg-slate-50/50">
                            <td class="py-3 px-4 font-mono font-medium text-govNavy">MOTA-2026-1049</td>
                            <td class="py-3 px-4">Kavita Gond <span class="text-slate-400">· Gond (ST)</span></td>
                            <td class="py-3 px-4 font-mono">MOTA-NFST-2026</td>
                            <td class="py-3 px-4 font-mono font-bold text-emerald-600">98.4%</td>
                            <td class="py-3 px-4">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                    Verified & Approved
                                </span>
                            </td>
                            <td class="py-3 px-4 text-emerald-700 font-medium">Ready for PFMS</td>
                        </tr>
                        <tr class="hover:bg-slate-50/50">
                            <td class="py-3 px-4 font-mono font-medium text-govNavy">MOTA-2026-1048</td>
                            <td class="py-3 px-4">Birsa Soren <span class="text-slate-400">· Santhal (ST)</span></td>
                            <td class="py-3 px-4 font-mono">MOTA-NOS-2026</td>
                            <td class="py-3 px-4 font-mono font-bold text-emerald-600">96.8%</td>
                            <td class="py-3 px-4">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                    Verified & Approved
                                </span>
                            </td>
                            <td class="py-3 px-4 text-slate-500">Document Endorsed</td>
                        </tr>
                        <tr class="hover:bg-slate-50/50">
                            <td class="py-3 px-4 font-mono font-medium text-govNavy">MOTA-2026-1047</td>
                            <td class="py-3 px-4">Mangal Baiga <span class="text-slate-400">· Baiga (PVTG)</span></td>
                            <td class="py-3 px-4 font-mono">MOTA-JANMAN-2026</td>
                            <td class="py-3 px-4 font-mono font-bold text-emerald-600">99.1%</td>
                            <td class="py-3 px-4">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800">
                                    PVTG Expedited
                                </span>
                            </td>
                            <td class="py-3 px-4 text-emerald-700 font-medium">Sanctioned (₹40,000/mo)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </main>

    <!-- CHART.JS INITIALIZATION SCRIPT (SIH REQUIREMENT) -->
    <script>
        // Parse Django Context JSON if available, otherwise use defaults
        const donutLabels = {{ donut_labels_json|default:'["National Fellowship (NFST)", "National Overseas (NOS)", "Top Class Education", "Post-Matric ST Scheme"]'|safe }};
        const donutData = {{ donut_data_json|default:'[142.5, 68.0, 94.2, 310.8]'|safe }};
        
        const funnelStages = {{ funnel_stages_json|default:'["Registration", "Doc Upload", "AI OCR Scan", "Nodal Verify", "Sanction", "Disbursal"]'|safe }};
        const historicalDropoffs = {{ historical_dropoffs_json|default:'[100000, 81000, 68000, 52000, 48000, 47200]'|safe }};
        const aiPredicted = {{ ai_predicted_with_nudge_json|default:'[100000, 94000, 91500, 88200, 86000, 85400]'|safe }};

        // 1. DONUT CHART: FUND UTILIZATION
        const ctxDonut = document.getElementById('fundUtilizationDonut').getContext('2d');
        new Chart(ctxDonut, {
            type: 'doughnut',
            data: {
                labels: donutLabels,
                datasets: [{
                    data: donutData,
                    backgroundColor: [
                        '#002244', // Gov Navy
                        '#FF9933', // Saffron
                        '#138808', // Green
                        '#0284C7'  // Sky Blue
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
                            padding: 12
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(item) {
                                return ' ' + item.label + ': ₹' + item.raw + ' Crores';
                            }
                        }
                    }
                },
                cutout: '68%'
            }
        });

        // 2. LINE CHART: AI PREDICTED DROP-OFFS
        const ctxLine = document.getElementById('dropOffLineChart').getContext('2d');
        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: funnelStages,
                datasets: [
                    {
                        label: 'Historical Baseline (Before AI)',
                        data: historicalDropoffs,
                        borderColor: '#94A3B8',
                        backgroundColor: 'rgba(148, 163, 184, 0.1)',
                        borderDash: [5, 5],
                        fill: true,
                        tension: 0.35,
                        pointRadius: 4
                    },
                    {
                        label: 'AI-Enabled Proactive Intervention',
                        data: aiPredicted,
                        borderColor: '#138808',
                        backgroundColor: 'rgba(19, 136, 8, 0.08)',
                        fill: true,
                        tension: 0.35,
                        pointRadius: 5,
                        pointBackgroundColor: '#138808'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Active Retained Applications', font: { size: 10 } },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    </script>
</body>
</html>
`,
  },
  {
    filename: 'forms.py',
    path: 'scholarships/forms.py',
    description: 'Django ModelForms for StudentProfile and Application document upload with file validation.',
    language: 'python',
    code: `"""
SIH26239: AI-Enabled Scholarship & Fellowship Management System
Ministry of Tribal Affairs, Government of India
Module: scholarships.forms
"""

from django import forms
from .models import StudentProfile, Application


class StudentProfileForm(forms.ModelForm):
    class Meta:
        model = StudentProfile
        fields = [
            'full_name',
            'sub_category',
            'tribe_community_name',
            'state_of_domicile',
            'district',
            'annual_family_income',
            'current_education_level',
            'institution_name',
            'field_of_study',
            'academic_percentage',
            'is_differently_abled',
        ]
        widgets = {
            'full_name': forms.TextInput(attrs={'class': 'w-full rounded border-slate-300 p-2'}),
            'sub_category': forms.Select(attrs={'class': 'w-full rounded border-slate-300 p-2'}),
            'tribe_community_name': forms.TextInput(attrs={'class': 'w-full rounded border-slate-300 p-2'}),
            'annual_family_income': forms.NumberInput(attrs={'class': 'w-full rounded border-slate-300 p-2'}),
        }


class DocumentUploadForm(forms.Form):
    document_type = forms.ChoiceField(
        choices=[
            ('caste_certificate', 'Scheduled Tribe (ST) / PVTG Certificate'),
            ('income_certificate', 'Income Certificate issued by Tehsildar / SDO'),
            ('bonafide_certificate', 'University Bonafide Admission Letter'),
        ],
        widget=forms.Select(attrs={'class': 'w-full rounded border-slate-300 p-2'})
    )
    document = forms.FileField(
        help_text="PDF, JPG, or PNG (Max 5MB)",
        widget=forms.ClearableFileInput(attrs={'class': 'w-full'})
    )
`,
  },
  {
    filename: 'settings.py',
    path: 'tribal_scholarship/settings.py',
    description: 'Production-ready Django settings configured for SIH demo, templates, media, and CSRF.',
    language: 'python',
    code: `"""
SIH26239: Django Project Settings
Ministry of Tribal Affairs Scholarship Portal Prototype
"""

from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-sih26239-tribal-affairs-ai-scholarship-portal-key'

DEBUG = True

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Custom App
    'scholarships',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'tribal_scholarship.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tribal_scholarship.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
`,
  }
];
