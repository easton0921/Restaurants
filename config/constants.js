module.exports = {
    ROLE: {
        USER: 1,
        ADMIN: 2,
        SUB_ADMIN: 3,
        STAFF: 4,
        OWNER : 5
    },
    SUB_ROLE: {
        ADMIN: 1,
        VENDOR: 2
    },
    SOCIAL_ACCOUNT: {
        PUBLIC: 0,
        PRIVATE: 1
    },
    OTP_TYPE: {
        SIGNUP: 1,
        LOGIN: 2,
        FORGET: 3,
        UPDATE: 4
    },
    ADDRESS_LABEL: {
        APERTMENT: 1,
        HOUSE: 2,
        OFFICE: 3,
        OTHER: 4,
    },
    COUNTRY_TYPE: {
        INDIA: 1,
        ALBANIA: 2,
        AZERBAIJAN: 3,
        BULGARIA: 4,
        CYPRUS: 5,
        CZECHIA: 6,
        GERMANY: 7,
        DENMARK: 8,
        ESTONIA: 9,
        FINLAND: 10,
    },
    FOLLOW_STATUS:{
        PENDING: 0,
        ACCEPT: 1,
        REJECT: 2
    },
    STUDY_PREFERENCES: {
        ENGINEERING: 1,
        MEDICINE: 2,
        BUSINESS: 3,
        ARTS_HUMANITIES: 4,
        PSYCHOLOGY: 5,
        SCIENCE_RESEARCH: 6
    },
    STUDY_LOCATION: {
        INDIA: 1,
        CANADA: 2,
        UNITED_KINGDOM: 3,
        AUSTRALIA: 4,
        UNITED_STATES: 5,
        OTHER: 6
    },
    UNIVERSITY_TYPES : {
        PUBLIC_UNIVERSITIES: 1,
        PRIVATE_UNIVERSITIES: 2,
        COMMUNITY_COLLEGES: 3,
        ONLINE_POGRAMS: 4
      },
    ERROR_VALUES: {
        PHONE_ALREADY_IN_USE: 1,
        EMAIL_ALREADY_IN_USE: 2
    },
    MODULE: {
        VEHICLE: 1,
        FOOD: 2,
        BOTH: 3,
    },
    GENDER: {
        MALE: 0,
        FEMALE: 1,
        OTHER: 2,
        DEFAULT: 3
    },
    DEVICETYPE: {
        WEB: "WEB",
        ANDROID: "ANDROID",
        IOS: "IOS"
    },
    SNS_TYPE: {
        NORMAL: 1,
        GOOGLE: 2,
        FACEBOOK: 3,
        APPLE: 4
    },
    ADDRESS_FOR: {
        HOME: 1,
        WORK: 2,
        OTHER: 3
    },
    PROJECTION_TYPES: {
        USER_RESTRICT_BASIC_DETAILS: 1
    },
    REQUIRED_DOCS: {
        USER: 3,
        VENDOR: 4,
        CORPORATE_ORGANISATION: 5,
        SUBVENDOR: 6,
        SUBCORPORATE: 7,
        DRIVER: 8,
        EMPLOYEE: 9,
        CLIENT: 10,
        CAR: 11
    },
    UPLOADS_TYPE: {
        IMAGE: 1,
        VIDEO: 2,
        PDF: 3,
        TEXT: 4
    },
    ACCESS_TYPE: {
        REQUEST: 1,
        VIEW: 2,
        MANAGE: 3
    },

    DOCUMENT_STATUS: {
        PENDING: 1,
        ACCEPTED: 2,
        REJECTED: 3
    },
    USER_STATUS: {
        NEW: 1,
        ACTIVE: 2
    },
    VERIFICATION_TYPE: {
        SIGNUP: 1,
        LOGIN: 2,
        PROFILE_UPDATE: 3,
        FORGET: 4
    },
    APPROVE_STATUS: {
        PENDING: 1,
        APPROVED: 2,
        REJECTED: 3
    },
    MESSAGE_TYPE: {
        MESSAGE: 1,
        VIDEO: 2,
        IMAGE: 3
    },
    MODULES: {
        Dashboard: 1,
        Users: 2,
        Staffs: 3,
        Business: 4,
        LiveSessions: 5,
        Forum: 6,
        discounts: 7,
        ReportManagement: 8,
        AdBanner: 9,
        Subscription: 10,
        subAdmin: 11,
        payment: 12,
        notification: 13,
        Cms: 14,
        CustomerSupport: 15,
        Analytics: 16,
        Faq: 17,
        Service: 18,
        Merchandise: 19,
    },
    PAYMENT_STATUS: {
        PENDING: 1,
        COMPLETED: 2,
        REFUNDED: 3,
        PAYMENTVOID: 4
    },
    PAYMENT_TYPE: {
        CASH: 0,
        CARD: 1
    },
    PUSH_TYPE_KEYS: {
        DEFAULT: 0,
        USER_REGISTER: 1,
        CORPORATE_REGISTER: 2,
        VENDOR_REGISTER: 3,
        SEND_CREDENTIALS: 4,
        PROFILE_ACCEPTED: 5,
        PROFILE_REJECTED: 6,
        CAR_ADDED: 7,
        CAR_ACCEPTED: 8,
        CAR_REJECTED: 9,
        ROLE_UPDATED: 10,
        DOCUMENT_REJECTED: 11,
        DOCUMENT_APPROVED: 12,
        CAR_BLOCKED: 13,
        CAR_UNBLOCKED: 14,
        USER_UPDATED_DOCS: 15,
        CORPORATE_UPDATED_DOCS: 16,
        VENDOR_UPDATED_DOCS: 17,
    },
    AREA_OPTION: {
        FIXED: 1,
        GEO_FENCING: 2
    },
    PUSH_TYPE_KEYS: {
        DEFAULT: 0,

    },
    NOTIFICATION_TYPE: {
        SOCKET: 1,
        PUSH: 2,
        BROADCAST: 3,
        MAIL: 4
    },
    DEFAULT_VALUE: {
        REFERRAL_CODE_LENGTH: 4
    },
    SIDEBAR_IDS: {
        DASHBOARD: 'one'
    },
    DISCOUNT_TYPE: {
        USER: 1,
        BUSINESS: 2,
        SERVICE: 3
    },

    SUBSCRIPTION_TYPE: {
        BASIC: 1,
        PREMIUM: 2,
        ELITE: 3
    },

    UPLOAD_TYPE: {
        IMAGE: 1,
        VIDEO: 2
    },

    SUBSCRIPTION_STATUS : {
        ACTIVE: 1,
        CANCELLED: 2,
        EXPIRED: 3,
        PAYMENT_FAILED: 4,
        INACTIVE: 5
    },

    STRIPE_SUB_STATUS : {
        ACTIVE: "active",
        CANCELLED: "cancelled",
        EXPIRED: "expired",
        PAYMENT_FAILED: "payment_failed",
        INACTIVE: "inactive"
    },

    USER_ACTIVITY_TYPE: {
        USER : 1,
        DISCOUNT : 6,
        POST : 7,
        COMMENT : 8,
        COMMUNITY_FORUM : 9,
        SUBSCRIPTION : 10
    },

    NOTIFICATION_TYPE: {
        SELECTED_USER: 1,
        USER: 2,
        STAFF: 3,
        ALL: 4
    },

    PUSH_TYPE: {
        DEFAULT: 0,
        OFFER_APPLIED: 1,
        SUBSCRIPTION_BOUGHT: 2,
        SUBSCRIPTION_CANCELLED: 3,
        SUBSCRIPTION_EXPIRED: 4,
        POST_LIKED: 5,
        POST_COMMENTED: 6,
        POST_SHARED: 7,
        POST_REPORTED: 8,
        COMMUNITY_FORUM_LIKED: 9,
        COMMUNITY_FORUM_COMMENTED: 10,
        COMMUNITY_FORUM_REPORTED: 11,
        COMMUNITY_FORUM_SHARED: 12,
        LIVE_SESSION_STARTED: 13,
        LIVE_SESSION_ENDED: 14
    },

    LIVE_SESSION_STATUS: {
        UPCOMING: 1,
        ONGOING: 2,
        COMPLETED: 3
    },

    SOCIAL_TYPE: {
        FACEBOOK: 1,
        APPLE: 2,
        GOOGLE: 3
    },

    QUERY_TYPE: {
        HISTORY: "History",
        USER: "User",
        POST: "post",
        COMMUNITY_FORUM: "community",
        EXPLORE: "explore"
    },

    COMMUNITY_FORUM_STATUS: {
        PENDING: 1,
        APPROVED: 2,
        REJECTED: 3
    },

    LIKE_TYPE: {
        POST: 1,
        LIVE_SESSION: 2,
        COMMUNITY_FORUM: 3
    },

    FIGHT_CATEGORY : {
        MMA : 1,
        BOXING : 2,
        MUAY_THAI : 3
    }
};