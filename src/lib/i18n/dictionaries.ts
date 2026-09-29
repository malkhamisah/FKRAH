import type { Locale } from "./config";

/**
 * Translation dictionaries. Keep keys flat and grouped by area.
 * Every user-facing string in Phase 1 lives here so the UI stays bilingual.
 */
const dictionaries = {
  ar: {
    "app.name": "فكرة",
    "app.tagline": "منصة إدارة الأفكار",

    "nav.dashboard": "لوحة المعلومات",
    "nav.ideas": "الأفكار",
    "nav.challenges": "التحديات",
    "nav.profile": "الملف الشخصي",
    "nav.admin": "الإدارة",
    "nav.users": "المستخدمون",
    "nav.logout": "تسجيل الخروج",
    "nav.comingSoon": "قريبًا",

    "lang.toggle": "English",

    "auth.login.title": "تسجيل الدخول",
    "auth.login.subtitle": "أدخل بياناتك للوصول إلى حسابك",
    "auth.login.submit": "دخول",
    "auth.login.noAccount": "ليس لديك حساب؟",
    "auth.login.registerLink": "إنشاء حساب جديد",
    "auth.login.forgot": "نسيت كلمة المرور؟",

    "auth.register.title": "إنشاء حساب جديد",
    "auth.register.subtitle": "انضم إلى المنصة وابدأ بمشاركة أفكارك",
    "auth.register.submit": "إنشاء الحساب",
    "auth.register.hasAccount": "لديك حساب بالفعل؟",
    "auth.register.loginLink": "تسجيل الدخول",

    "auth.forgot.title": "إعادة تعيين كلمة المرور",
    "auth.forgot.subtitle": "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين",
    "auth.forgot.submit": "إرسال رابط إعادة التعيين",
    "auth.forgot.back": "العودة لتسجيل الدخول",
    "auth.forgot.notConnected":
      "ملاحظة: إرسال البريد الإلكتروني غير مُفعّل بعد في هذه المرحلة. سيتم توليد الرابط وحفظه فقط.",
    "auth.forgot.done":
      "إذا كان البريد الإلكتروني مسجلًا لدينا، فسيتم إنشاء رابط إعادة تعيين.",

    "field.name": "الاسم الكامل",
    "field.email": "البريد الإلكتروني",
    "field.password": "كلمة المرور",
    "field.confirmPassword": "تأكيد كلمة المرور",
    "field.jobTitle": "المسمى الوظيفي",
    "field.department": "القسم",
    "field.bio": "نبذة تعريفية",
    "field.role": "الدور",
    "field.status": "الحالة",
    "field.optional": "اختياري",

    "profile.title": "الملف الشخصي",
    "profile.subtitle": "إدارة معلومات حسابك",
    "profile.save": "حفظ التغييرات",
    "profile.saved": "تم حفظ التغييرات بنجاح",
    "profile.accountInfo": "معلومات الحساب",
    "profile.security": "الأمان",
    "profile.changePassword": "تغيير كلمة المرور",
    "profile.currentPassword": "كلمة المرور الحالية",
    "profile.newPassword": "كلمة المرور الجديدة",
    "profile.passwordChanged": "تم تغيير كلمة المرور بنجاح",

    "users.title": "إدارة المستخدمين",
    "users.subtitle": "عرض المستخدمين وإدارة أدوارهم وحالاتهم",
    "users.count": "مستخدم",
    "users.empty": "لا يوجد مستخدمون بعد",
    "users.you": "أنت",
    "users.activate": "تفعيل",
    "users.deactivate": "تعطيل",
    "users.roleUpdated": "تم تحديث الدور",

    "status.active": "نشط",
    "status.disabled": "معطّل",

    "home.welcome": "مرحبًا بك في",
    "home.placeholder":
      "لوحة المعلومات الكاملة ستُبنى في مرحلة لاحقة. هذه صفحة مؤقتة بعد تسجيل الدخول.",
    "home.signedInAs": "تم تسجيل الدخول باسم",

    "common.loading": "جارٍ التحميل...",
    "common.error": "حدث خطأ",
    "common.required": "هذا الحقل مطلوب",
    "common.cancel": "إلغاء",
    "common.confirm": "تأكيد",
  },
  en: {
    "app.name": "FKRAH",
    "app.tagline": "Idea Management Platform",

    "nav.dashboard": "Dashboard",
    "nav.ideas": "Ideas",
    "nav.challenges": "Challenges",
    "nav.profile": "Profile",
    "nav.admin": "Administration",
    "nav.users": "Users",
    "nav.logout": "Sign out",
    "nav.comingSoon": "Soon",

    "lang.toggle": "العربية",

    "auth.login.title": "Sign in",
    "auth.login.subtitle": "Enter your credentials to access your account",
    "auth.login.submit": "Sign in",
    "auth.login.noAccount": "Don't have an account?",
    "auth.login.registerLink": "Create one",
    "auth.login.forgot": "Forgot password?",

    "auth.register.title": "Create your account",
    "auth.register.subtitle": "Join the platform and start sharing your ideas",
    "auth.register.submit": "Create account",
    "auth.register.hasAccount": "Already have an account?",
    "auth.register.loginLink": "Sign in",

    "auth.forgot.title": "Reset your password",
    "auth.forgot.subtitle": "Enter your email and we'll send you a reset link",
    "auth.forgot.submit": "Send reset link",
    "auth.forgot.back": "Back to sign in",
    "auth.forgot.notConnected":
      "Note: email delivery is not connected yet at this stage. The link is only generated and stored.",
    "auth.forgot.done":
      "If that email is registered, a reset link has been generated.",

    "field.name": "Full name",
    "field.email": "Email",
    "field.password": "Password",
    "field.confirmPassword": "Confirm password",
    "field.jobTitle": "Job title",
    "field.department": "Department",
    "field.bio": "Bio",
    "field.role": "Role",
    "field.status": "Status",
    "field.optional": "optional",

    "profile.title": "Profile",
    "profile.subtitle": "Manage your account information",
    "profile.save": "Save changes",
    "profile.saved": "Changes saved successfully",
    "profile.accountInfo": "Account information",
    "profile.security": "Security",
    "profile.changePassword": "Change password",
    "profile.currentPassword": "Current password",
    "profile.newPassword": "New password",
    "profile.passwordChanged": "Password changed successfully",

    "users.title": "User management",
    "users.subtitle": "View users and manage their roles and status",
    "users.count": "users",
    "users.empty": "No users yet",
    "users.you": "You",
    "users.activate": "Activate",
    "users.deactivate": "Deactivate",
    "users.roleUpdated": "Role updated",

    "status.active": "Active",
    "status.disabled": "Disabled",

    "home.welcome": "Welcome to",
    "home.placeholder":
      "The full dashboard will be built in a later phase. This is a temporary page after sign-in.",
    "home.signedInAs": "Signed in as",

    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.required": "This field is required",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
  },
} as const;

export type DictKey = keyof (typeof dictionaries)["en"];

export function getDictionary(locale: Locale): Record<DictKey, string> {
  return dictionaries[locale];
}
