const express = require('express');
const router = express.Router();

/**
 * Function to send otp
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const sendOtp = async (req, res, next) => {
    try {
        const { data, message } = await Services.onboarding.sendOtp(req.body);
        return res.success(message, data);
    } catch (err) {
        next(err);
    }
};

/**
 * Function to verify otp
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const verifyOtp = async (req, res, next) => {
    try {
        const { data, message } = await Services.onboarding.verifyOtp(req.body);
        return res.success(message, data);
    } catch (err) {
        next(err);
    }
};

/**
 * Function to login
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const login = async (req, res, next) => {
    try {
        const { data, message } = await Services.onboarding.login(req.body);
        return res.success(message, data);
    } catch (err) {
        next(err);
    }
};

/**
 * Function to change or reset Password
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const changePassword = async (req, res, next) => {
    try {
        const { data, message } = await Services.onboarding.changePassword(req.admin, req.body);
        return res.success(message, data);
    } catch (err) {
        next(err);
    }
};

/**
 * Function to get Profile
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getProfile = async (req, res, next) => {
    try {
        const { data, message } = await Services.onboarding.getProfile(req.admin);
        return res.success(message, data);
    } catch (err) {
        next(err);
    }
};

/**
 * Function to logout
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const logout = async (req, res, next) => {
    try {
        const { data, message } = await Services.onboarding.logout(req.admin);
        return res.success(message, data);
    } catch (err) {
        next(err);
    }
};

/**
 * Function to updateProfile
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const updateProfile = async (req, res, next) => {
    try {
        const { data, message } = await Services.onboarding.updateProfile(req.admin, req.body);
        return res.success(message, data);
    } catch (err) {
        next(err);
    }
};

/**
 * @swagger
 * /admin/onboarding/send-otp:
 * 
 *  post:
 *    summary: sendOtp
 * 
 *    tags:
 *      - Onboarding
 * 
 *    parameters:
 *      - in: header
 *        name: x-portal
 *        required: true
 *        description: Specifies the portal type. Valid options are `admin`.
 *        schema:
 *          type: string
 *          enum:
 *            - admin
 *      
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/onboardingsendOtp'
 * 
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.post("/send-otp", Validator(Validations.Onboarding.sendOtp), sendOtp);

/**
 * @swagger
 * /admin/onboarding/verify-otp:
 * 
 *  post:
 *    summary: Verify OTP
 * 
 *    tags:
 *      - Onboarding
 *    
 *    parameters:
 *      - in: header
 *        name: x-portal
 *        required: true
 *        description: Specifies the portal type. Valid options are `admin`.
 *        schema:
 *          type: string
 *          enum:
 *            - admin
 *      
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/onboardingverifyOtp'
 * 
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.post("/verify-otp", Validator(Validations.Onboarding.verifyOtp), verifyOtp);

/**
 * @swagger
 * /admin/onboarding/login:
 * 
 *  post:
 *    summary: login with email
 * 
 *    tags:
 *      - Onboarding
 * 
 *    parameters:
 *      - in: header
 *        name: x-portal
 *        required: true
 *        description: Specifies the portal type. Valid options are `admin`.
 *        schema:
 *          type: string
 *          enum:
 *            - admin
 *      - in: header
 *        name: appkey
 *        required: false
 *        description: Specifies the appkey when you have to by pass encryption.
 *        schema:
 *          type: string
 *      
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/onboardinglogin'
 * 
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.post("/login", Validator(Validations.Onboarding.login), login);

/**
 * @swagger
 * /admin/onboarding/change-password:
 * 
 *  post:
 *    summary: change or reset password
 * 
 *    tags:
 *      - Onboarding
 * 
 *    parameters:
 *      - in: header
 *        name: x-portal
 *        required: true
 *        description: Specifies the portal type. Valid options are `admin`.
 *        schema:
 *          type: string
 *          enum:
 *            - admin
 *      - in: header
 *        name: appkey
 *        required: false
 *        description: Specifies the appkey when you have to by pass encryption.
 *        schema:
 *          type: string
 * 
 *    security:
 *      - bearerAuth: []
 *      
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/onboardingchangePassword'
 * 
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.post("/change-password", Auth.verify("admin", "sub_admin"), Validator(Validations.Onboarding.changePassword), changePassword);

/**
 * @swagger
 * /admin/onboarding/:
 * 
 *  get:
 *    summary: Get profile
 * 
 *    tags:
 *      - Onboarding
 * 
 *    parameters:
 *      - in: header
 *        name: x-portal
 *        required: true
 *        description: Specifies the portal type. Valid options are `admin`.
 *        schema:
 *          type: string
 *          enum:
 *            - admin
 *      - in: header
 *        name: appkey
 *        required: false
 *        description: Specifies the appkey when you have to by pass encryption.
 *        schema:
 *          type: string
 * 
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.get("/", Auth.verify("admin", "sub_admin"), getProfile);

/**
 * @swagger
 * /admin/onboarding/logout:
 * 
 *  get:
 *    summary: logout
 * 
 *    tags:
 *      - Onboarding
 * 
 *    parameters:
 *      - in: header
 *        name: x-portal
 *        required: true
 *        description: Specifies the portal type. Valid options are `admin`.
 *        schema:
 *          type: string
 *          enum:
 *            - admin
 *      - in: header
 *        name: appkey
 *        required: false
 *        description: Specifies the appkey when you have to by pass encryption.
 *        schema:
 *          type: string
 * 
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.get("/logout", Auth.verify("admin", "sub_admin"), logout);

/**
 * @swagger
 * /admin/onboarding/:
 * 
 *  put:
 *    summary: Update Profile
 * 
 *    tags:
 *      - Onboarding
 * 
 *    parameters:
 *      - in: header
 *        name: x-portal
 *        required: true
 *        description: Specifies the portal type. Valid options are `admin`.
 *        schema:
 *          type: string
 *          enum:
 *            - admin
 *      - in: header
 *        name: appkey
 *        required: false
 *        description: Specifies the appkey when you have to by pass encryption.
 *        schema:
 *          type: string
 * 
 *    security:
 *      - bearerAuth: []
 *      
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/onboardingupdateProfile'
 * 
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.put("/", Auth.verify("admin", "sub_admin"), Validator(Validations.Onboarding.updateProfile), updateProfile);

module.exports = router;