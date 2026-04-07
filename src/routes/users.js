"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _fastify = require("fastify");
var _User = require("../entities/User");
var _cookie = require("@fastify/cookie");
var _datasource = require("../datasource");
var _ValidateTIN = require("../services/ValidateTIN");
var _NotificationService = require("../services/NotificationService");
var _PoolService = require("../services/PoolService");
var _ErrorService = require("../services/ErrorService");
var _typeProviderTypebox = require("@fastify/type-provider-typebox");
var _excluded = ["email", "phone", "password"],
  _excluded2 = ["password"],
  _excluded3 = ["password"];
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; } // noinspection ES6UnusedImports
var bcrypt = require("bcrypt");
var validateTIN = new _ValidateTIN.ValidateTIN();
var signupSchema = {
  tags: ["Users"],
  summary: "Register a new user",
  params: _typeProviderTypebox.Type.Object({
    role: _typeProviderTypebox.Type.Enum(_User.Role)
  }),
  body: _typeProviderTypebox.Type.Object({
    name: _typeProviderTypebox.Type.String({
      minLength: 2
    }),
    surname: _typeProviderTypebox.Type.String({
      minLength: 2
    }),
    email: _typeProviderTypebox.Type.String({
      format: "email"
    }),
    phone: _typeProviderTypebox.Type.String({
      pattern: "^89\\d{9}$"
    }),
    password: _typeProviderTypebox.Type.String({
      minLength: 8
    }),
    tin: _typeProviderTypebox.Type.Optional(_typeProviderTypebox.Type.String({
      minLength: 10,
      maxLength: 12
    }))
  }),
  response: {
    201: _typeProviderTypebox.Type.Object({
      success: _typeProviderTypebox.Type.Boolean(),
      message: _typeProviderTypebox.Type.String(),
      data: _typeProviderTypebox.Type.Any() // Matches your userResponse
    })
  }
};
var loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email"
      },
      password: {
        type: "string",
        format: "password"
      }
    }
  }
};
var updateSchema = {
  body: {
    type: "object",
    properties: {
      phone: {
        type: "string",
        pattern: "^89\\d{9}$"
      },
      gender: {
        type: "string",
        enum: Object.values(_User.Gender)
      },
      city: {
        type: "string",
        minLength: 2,
        maxLength: 100
      },
      socialLinks: {
        type: "array",
        items: {
          type: "string",
          format: "uri"
        }
      },
      description: {
        type: "string",
        maxLength: 500
      },
      // Employer specific
      managerPosition: {
        type: "string",
        maxLength: 150
      },
      companyName: {
        type: "string",
        maxLength: 255
      },
      companyWebsite: {
        type: "string",
        pattern: "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{2,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$"
      },
      tin: {
        type: "string",
        minLength: 10,
        maxLength: 12
      },
      // Specialist specific
      educations: {
        type: "array",
        items: {
          type: "string",
          enum: Object.values(_User.EducationLevel)
        }
      },
      status: {
        type: "string",
        enum: Object.values(_User.ProfileStatus)
      },
      birthDate: {
        type: "string",
        format: "date"
      },
      // Validates "YYYY-MM-DD"
      citizenship: {
        type: "boolean"
      }
    }
  }
};
module.exports = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(fastify) {
    var sanitizeUpdateData;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          sanitizeUpdateData = function sanitizeUpdateData(role, data) {
            var commonFields = ["phone", "gender", "city", "socialLinks", "description"];
            var employerFields = ["managerPosition", "companyName", "companyWebsite", "tin"];
            var specialistFields = ["educations", "status", "birthDate", "citizenship"];
            var sanitized = {};
            var allowedFields = role === _User.Role.EMPLOYER ? [].concat(commonFields, employerFields) : [].concat(commonFields, specialistFields);
            allowedFields.forEach(function (field) {
              if (data[field] !== undefined) sanitized[field] = data[field];
            });
            return sanitized;
          };
          fastify.post("/signup/:role", {
            schema: signupSchema
          }, /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
              var _req$body, email, phone, rawPassword, data, userPool, hashedPassword, user, valid, _user, password, userResponse, _t;
              return _regenerator().w(function (_context) {
                while (1) switch (_context.n) {
                  case 0:
                    _req$body = req.body, email = _req$body.email, phone = _req$body.phone, rawPassword = _req$body.password, data = _objectWithoutProperties(_req$body, _excluded);
                    userPool = _PoolService.PoolService.getUserPool(req.params.role);
                    _context.n = 1;
                    return _datasource.Database.getRepository("User").findOne({
                      where: [{
                        email: email
                      }, {
                        phone: phone
                      }]
                    });
                  case 1:
                    if (!_context.v) {
                      _context.n = 2;
                      break;
                    }
                    throw new _ErrorService.ConflictError("Email or phone already in use");
                  case 2:
                    _context.n = 3;
                    return bcrypt.hash(rawPassword, 12);
                  case 3:
                    hashedPassword = _context.v;
                    Object.assign(data, {
                      email: email,
                      phone: phone,
                      password: hashedPassword
                    });
                    _t = req.params.role;
                    _context.n = _t === _User.Role.EMPLOYER ? 4 : _t === _User.Role.SPECIALIST ? 7 : 8;
                    break;
                  case 4:
                    if (req.body.tin) {
                      _context.n = 5;
                      break;
                    }
                    throw new _ErrorService.RequestError("TIN missing/invalid");
                  case 5:
                    _context.n = 6;
                    return validateTIN.isExists(req.body.tin.toString());
                  case 6:
                    valid = _context.v;
                    user = userPool.create(_objectSpread(_objectSpread({}, data), {}, {
                      verified: valid
                    }));
                    return _context.a(3, 9);
                  case 7:
                    user = userPool.create(_objectSpread({}, data));
                    return _context.a(3, 9);
                  case 8:
                    throw new _ErrorService.RequestError();
                  case 9:
                    _context.n = 10;
                    return userPool.save(user);
                  case 10:
                    _user = user, password = _user.password, userResponse = _objectWithoutProperties(_user, _excluded2);
                    _context.n = 11;
                    return _NotificationService.NotificationService.notifyValidationStatus(user.id, user.verified);
                  case 11:
                    return _context.a(2, res.status(201).send({
                      success: true,
                      message: "User registered successfully",
                      data: userResponse
                    }));
                }
              }, _callee);
            }));
            return function (_x2, _x3) {
              return _ref2.apply(this, arguments);
            };
          }());
          fastify.post("/login", {
            schema: loginSchema
          }, /*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
              var data, userPool, user, token;
              return _regenerator().w(function (_context2) {
                while (1) switch (_context2.n) {
                  case 0:
                    data = req.body;
                    userPool = _PoolService.PoolService.getUserPool();
                    _context2.n = 1;
                    return userPool.findOne({
                      where: {
                        email: data.email
                      }
                    });
                  case 1:
                    user = _context2.v;
                    if (user) {
                      _context2.n = 2;
                      break;
                    }
                    throw new _ErrorService.NotFoundError("User not found");
                  case 2:
                    _context2.n = 3;
                    return bcrypt.compare(data.password, user.password);
                  case 3:
                    if (_context2.v) {
                      _context2.n = 4;
                      break;
                    }
                    throw new _ErrorService.UnauthorizedError("Invalid password");
                  case 4:
                    token = fastify.jwt.sign({
                      id: user.id,
                      role: user.role
                    });
                    return _context2.a(2, res.setCookie("access_token", token, {
                      httpOnly: true,
                      secure: false,
                      sameSite: "lax",
                      signed: true,
                      path: "/"
                    }).status(200).send({
                      success: true,
                      message: "Login successfull",
                      data: {
                        role: user.role,
                        id: user.id,
                        name: user.name
                      }
                    }));
                }
              }, _callee2);
            }));
            return function (_x4, _x5) {
              return _ref3.apply(this, arguments);
            };
          }());
          fastify.post("/logout", {
            preHandler: fastify.authenticate
          }, /*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
              return _regenerator().w(function (_context3) {
                while (1) switch (_context3.n) {
                  case 0:
                    if (req.cookies.access_token) {
                      _context3.n = 1;
                      break;
                    }
                    throw new _ErrorService.UnauthorizedError("Cookie not found");
                  case 1:
                    res.clearCookie("access_token", {
                      httpOnly: true,
                      secure: true,
                      sameSite: "none",
                      signed: true,
                      path: "/"
                    }).status(200).send({
                      success: true,
                      message: "Logged out"
                    });
                  case 2:
                    return _context3.a(2);
                }
              }, _callee3);
            }));
            return function (_x6, _x7) {
              return _ref4.apply(this, arguments);
            };
          }());
          fastify.get("/:id", {
            preHandler: fastify.authenticate
          }, /*#__PURE__*/function () {
            var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
              var userPool, user, _ref6, password, fullData, basicInfo, _t2;
              return _regenerator().w(function (_context4) {
                while (1) switch (_context4.n) {
                  case 0:
                    userPool = _PoolService.PoolService.getUserPool();
                    _context4.n = 1;
                    return userPool.findOne({
                      where: {
                        id: req.params.id
                      }
                    });
                  case 1:
                    user = _context4.v;
                    if (user) {
                      _context4.n = 2;
                      break;
                    }
                    throw new _ErrorService.NotFoundError("User not found");
                  case 2:
                    if (!(req.user.id === req.params.id)) {
                      _context4.n = 3;
                      break;
                    }
                    _ref6 = user, password = _ref6.password, fullData = _objectWithoutProperties(_ref6, _excluded3);
                    return _context4.a(2, res.status(200).send({
                      success: true,
                      message: "OK",
                      data: fullData
                    }));
                  case 3:
                    basicInfo = {
                      name: user.name,
                      surname: user.surname,
                      email: user.email,
                      phone: user.phone,
                      gender: user.gender,
                      description: user.description,
                      socialLinks: user.socialLinks,
                      verified: user.verified
                    };
                    _t2 = user.role;
                    _context4.n = _t2 === _User.Role.EMPLOYER ? 4 : _t2 === _User.Role.SPECIALIST ? 5 : 6;
                    break;
                  case 4:
                    // info only an employer has
                    Object.assign(basicInfo, {
                      position: user.managerPosition,
                      company: user.companyName,
                      companyWebsite: user.companyWebsite,
                      vacancies: user.vacancies
                    });
                    return _context4.a(3, 6);
                  case 5:
                    // info only a specialist has
                    Object.assign(basicInfo, {
                      education: user.education,
                      status: user.status,
                      birthDate: user.birthDate,
                      citizenship: user.citizenship,
                      resumes: user.resumes
                    });
                    return _context4.a(3, 6);
                  case 6:
                    return _context4.a(2, res.status(200).send({
                      success: true,
                      data: _objectSpread({}, basicInfo)
                    }));
                }
              }, _callee4);
            }));
            return function (_x8, _x9) {
              return _ref5.apply(this, arguments);
            };
          }());
          fastify.patch("/update", {
            preHandler: fastify.authenticate,
            schema: updateSchema
          }, /*#__PURE__*/function () {
            var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
              var userPool, user, sanitizedData;
              return _regenerator().w(function (_context5) {
                while (1) switch (_context5.n) {
                  case 0:
                    userPool = _PoolService.PoolService.getUserPool(req.user.role);
                    _context5.n = 1;
                    return userPool.findOne({
                      where: {
                        id: req.user.id
                      }
                    });
                  case 1:
                    user = _context5.v;
                    if (user) {
                      _context5.n = 2;
                      break;
                    }
                    throw new _ErrorService.NotFoundError("User not found");
                  case 2:
                    sanitizedData = sanitizeUpdateData(req.user.role, req.body);
                    if (!(req.user.role === _User.Role.EMPLOYER && sanitizedData.tin)) {
                      _context5.n = 4;
                      break;
                    }
                    _context5.n = 3;
                    return validateTIN.isExists(sanitizedData.tin);
                  case 3:
                    user.verified = _context5.v;
                    _context5.n = 4;
                    return _NotificationService.NotificationService.notifyValidationStatus(user.id, user.verified);
                  case 4:
                    Object.assign(user, sanitizedData);
                    _context5.n = 5;
                    return userPool.save(user);
                  case 5:
                    return _context5.a(2, res.status(204).send({
                      success: true,
                      message: "Successfully Updated"
                    }));
                }
              }, _callee5);
            }));
            return function (_x0, _x1) {
              return _ref7.apply(this, arguments);
            };
          }());
        case 1:
          return _context6.a(2);
      }
    }, _callee6);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();