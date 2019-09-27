'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _reactAdmin = require('react-admin');

var _app = require('firebase/app');

var _app2 = _interopRequireDefault(_app);

require('firebase/firestore');

require('firebase/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* globals localStorage */
var baseConfig = {
  userProfilePath: '/users/',
  userAdminProp: 'isAdmin',
  localStorageTokenName: 'RAFirebaseClientToken',
  handleAuthStateChange: function () {
    var _ref = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee(auth, config) {
      var snapshot, profile, firebaseToken, user;
      return _regenerator2['default'].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!auth) {
                _context.next = 17;
                break;
              }

              _context.next = 3;
              return _app2['default'].firestore().doc(config.userProfilePath + auth.user.uid).get();

            case 3:
              snapshot = _context.sent;
              profile = snapshot.data();

              if (!(profile && profile[config.userAdminProp])) {
                _context.next = 12;
                break;
              }

              firebaseToken = auth.user.getIdToken();
              user = { auth: auth, profile: profile, firebaseToken: firebaseToken };

              localStorage.setItem(config.localStorageTokenName, firebaseToken);
              return _context.abrupt('return', user);

            case 12:
              _app2['default'].auth().signOut();
              localStorage.removeItem(config.localStorageTokenName);
              throw new Error('sign_in_error');

            case 15:
              _context.next = 19;
              break;

            case 17:
              localStorage.removeItem(config.localStorageTokenName);
              throw new Error('sign_in_error');

            case 19:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function handleAuthStateChange(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }()
};

exports['default'] = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  config = (0, _extends3['default'])({}, baseConfig, config);

  var firebaseLoaded = function firebaseLoaded() {
    return new _promise2['default'](function (resolve) {
      _app2['default'].auth().onAuthStateChanged(resolve);
    });
  };

  return function () {
    var _ref2 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee2(type, params) {
      var token, username, password, alreadySignedIn, auth;
      return _regenerator2['default'].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(type === _reactAdmin.AUTH_LOGOUT)) {
                _context2.next = 3;
                break;
              }

              config.handleAuthStateChange(null, config)['catch'](function () {});
              return _context2.abrupt('return', _app2['default'].auth().signOut());

            case 3:
              if (!_app2['default'].auth().currentUser) {
                _context2.next = 6;
                break;
              }

              _context2.next = 6;
              return _app2['default'].auth().currentUser.reload();

            case 6:
              if (!(type === _reactAdmin.AUTH_CHECK)) {
                _context2.next = 12;
                break;
              }

              _context2.next = 9;
              return firebaseLoaded();

            case 9:
              if (_app2['default'].auth().currentUser) {
                _context2.next = 11;
                break;
              }

              throw new Error('sign_in_error');

            case 11:
              return _context2.abrupt('return', true);

            case 12:
              if (!(type === _reactAdmin.AUTH_GET_PERMISSIONS)) {
                _context2.next = 21;
                break;
              }

              _context2.next = 15;
              return firebaseLoaded();

            case 15:
              if (_app2['default'].auth().currentUser) {
                _context2.next = 17;
                break;
              }

              throw new Error('sign_in_error');

            case 17:
              _context2.next = 19;
              return _app2['default'].auth().currentUser.getIdTokenResult();

            case 19:
              token = _context2.sent;
              return _context2.abrupt('return', token.claims);

            case 21:
              if (!(type === _reactAdmin.AUTH_LOGIN)) {
                _context2.next = 29;
                break;
              }

              username = params.username, password = params.password, alreadySignedIn = params.alreadySignedIn;
              auth = _app2['default'].auth().currentUser;

              if (!(!auth || !alreadySignedIn)) {
                _context2.next = 28;
                break;
              }

              _context2.next = 27;
              return _app2['default'].auth().signInWithEmailAndPassword(username, password);

            case 27:
              auth = _context2.sent;

            case 28:
              return _context2.abrupt('return', config.handleAuthStateChange(auth, config));

            case 29:
              return _context2.abrupt('return', false);

            case 30:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }();
};

module.exports = exports['default'];