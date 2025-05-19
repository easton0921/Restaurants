const express = require('express');
const router = express.Router();

/**
 * Function to create
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const create = async (req, res, next) => {
  try {
    const { data, message } = await Services.accessRole.create(req.body);
    return res.success(message, data);
  } catch (err) {
    next(err);
  }
};

/**
 * Function to list
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const list = async (req, res, next) => {
  try {
    const { data, message } = await Services.accessRole.list(req.query);
    return res.success(message, data);
  } catch (err) {
    next(err);
  }
};

/**
 * Function to get by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getById = async (req, res, next) => {
  try {
    const { data, message } = await Services.accessRole.getById(req.params, req.query);
    return res.success(message, data);
  } catch (err) {
    next(err);
  }
};

/**
 * Function to update by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const updateById = async (req, res, next) => {
  try {
    const { data, message } = await Services.accessRole.updateById(req.params, req.body);
    return res.success(message, data);
  } catch (err) {
    next(err);
  }
};

/**
 * Function to delete by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const deleteById = async (req, res, next) => {
  try {
    const { data, message } = await Services.accessRole.deleteById(req.params, req.body);
    return res.success(message, data);
  } catch (err) {
    next(err);
  }
};

/**
 * Function to export records
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const exportRecords = async (req, res, next) => {
  try {
    const { data, message } = await Services.accessRole.exportRecords(req.query);
    return res.success(message, data);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /admin/access-role:
 * 
 *  post:
 *    summary: Create
 * 
 *    tags:
 *      - Access Role
 * 
 *    security:
 *      - bearerAuth: []
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
 *            $ref: '#/components/schemas/accessRolecreate'
 * 
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.post(
  "/",
  Auth.verify("admin", "sub_admin"),
  Auth.checkSubAdmin("add", constants.MODULES.SubAdmin),
  Validator(Validations.AccessRole.create),
  create
);

/**
 * @swagger
 * /admin/access-role:
 * 
 *  get:
 *    summary: Listing
 * 
 *    tags:
 *      - Access Role
 * 
 *    security:
 *      - bearerAuth: []
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
 *      - in: query
 *        name: page
 *        description: Current page number
 *        schema:
 *          type: number
 *          example: 1
 *      - in: query
 *        name: limit
 *        description: Page size
 *        schema:
 *          type: number
 *          example: 10
 *     
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.get(
  "/",
  Auth.verify("admin", "sub_admin"),
  Auth.checkSubAdmin("get", constants.MODULES.SubAdmin),
  list
);

/**
 * @swagger
 * /admin/access-role/export:
 * 
 *  get:
 *    summary: Export records
 * 
 *    tags:
 *      - Access Role
 * 
 *    security:
 *      - bearerAuth: []
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
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
// router.get(
//   "/export",
//   Auth.verify("admin", "sub_admin"),
//   Auth.checkSubAdmin("get", constants.MODULES.SubAdmin),
//   exportRecords
// );

/**
 * @swagger
 * /admin/access-role/{id}:
 * 
 *  get:
 *    summary: Get By Id
 * 
 *    tags:
 *      - Access Role
 * 
 *    security:
 *      - bearerAuth: []
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
 *      - in: path
 *        name: id
 *        required: true
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
router.get(
  "/:id",
  Auth.verify("admin", "sub_admin"),
  Auth.checkSubAdmin("get", constants.MODULES.SubAdmin),
  getById
);

/**
 * @swagger
 * /admin/access-role/{id}:
 * 
 *  put:
 *    summary: Update By Id
 * 
 *    tags:
 *      - Access Role
 * 
 *    security:
 *      - bearerAuth: []
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
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 * 
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/accessRoleupdateById'
 *     
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.put(
  "/:id",
  Auth.verify("admin", "sub_admin"),
  Auth.checkSubAdmin("edit", constants.MODULES.SubAdmin),
  Validator(Validations.AccessRole.updateById),
  updateById
);

/**
 * @swagger
 * /admin/access-role/{id}:
 * 
 *  delete:
 *    summary: Delete By Id
 * 
 *    tags:
 *      - Access Role
 * 
 *    security:
 *      - bearerAuth: []
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
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 * 
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/accessRoledeleteById'
 *     
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.delete(
  "/:id",
  Auth.verify("admin", "sub_admin"),
  Auth.checkSubAdmin("delete", constants.MODULES.SubAdmin),
  Validator(Validations.AccessRole.deleteById),
  deleteById
);

module.exports = router;
