import _regeneratorRuntime from 'babel-runtime/regenerator';
import _Promise from 'babel-runtime/core-js/promise';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$assign from 'babel-runtime/core-js/object/assign';

var _this = this;

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Methods from './methods';

import { GET_LIST, GET_ONE, GET_MANY, GET_MANY_REFERENCE, CREATE, UPDATE, DELETE, DELETE_MANY } from 'react-admin';

/**
 * @param {string[]|Object[]} trackedResources Array of resource names or array of Objects containing name and
 * optional path properties (path defaults to name)
 * @param {Object} firebaseConfig Options Firebase configuration
 */

var BaseConfiguration = {
  initialQuerytimeout: 10000,
  timestampFieldNames: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

var RestProvider = function RestProvider() {
  var firebaseConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options = _Object$assign({}, BaseConfiguration, options);
  var _options = options,
      timestampFieldNames = _options.timestampFieldNames,
      trackedResources = _options.trackedResources;


  var resourcesStatus = {};
  // const resourcesReferences = {};
  var resourcesData = {};
  var resourcesPaths = {};
  var resourcesUploadFields = {};

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    firebase.firestore().settings({
      timestampsInSnapshots: true
    });
  }

  /* Functions */
  var upload = options.upload || Methods.upload;
  var save = options.save || Methods.save;
  var del = options.del || Methods.del;
  var getItemID = options.getItemID || Methods.getItemID;
  var getOne = options.getOne || Methods.getOne;
  var getMany = options.getMany || Methods.getMany;
  var getManyReference = options.getManyReference || Methods.getManyReference;
  var delMany = options.delMany || Methods.delMany;
  var getList = options.getList || Methods.getList;

  var firebaseSaveFilter = options.firebaseSaveFilter ? options.firebaseSaveFilter : function (data) {
    return data;
  };
  // const firebaseGetFilter = options.firebaseGetFilter ? options.firebaseGetFilter : data => data;

  // Sanitize Resources
  trackedResources.map(function (resource, index) {
    if (typeof resource === 'string') {
      resource = {
        name: resource,
        path: resource,
        uploadFields: []
      };
      trackedResources[index] = resource;
    }

    var _resource = resource,
        name = _resource.name,
        path = _resource.path,
        uploadFields = _resource.uploadFields;

    if (!resource.name) {
      throw new Error('name is missing from resource ' + resource);
    }
    resourcesUploadFields[name] = uploadFields || [];
    resourcesPaths[name] = path || name;
    resourcesData[name] = {};
  });

  /**
   * @param {string} type Request type, e.g GET_LIST
   * @param {string} resourceName Resource name, e.g. "posts"
   * @param {Object} payload Request parameters. Depends on the request type
   * @returns {Promise} the Promise for a REST response
   */

  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(type, resourceName, params) {
      var result, uploadFields, itemId, uploads, currentData, uploadResults;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return resourcesStatus[resourceName];

            case 2:
              result = null;
              _context.t0 = type;
              _context.next = _context.t0 === GET_LIST ? 6 : _context.t0 === GET_MANY ? 10 : _context.t0 === GET_MANY_REFERENCE ? 14 : _context.t0 === GET_ONE ? 18 : _context.t0 === DELETE ? 22 : _context.t0 === DELETE_MANY ? 27 : _context.t0 === UPDATE ? 31 : _context.t0 === CREATE ? 31 : 41;
              break;

            case 6:
              _context.next = 8;
              return getList(params, resourceName, resourcesData[resourceName]);

            case 8:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 10:
              _context.next = 12;
              return getMany(params, resourceName, resourcesData[resourceName]);

            case 12:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 14:
              _context.next = 16;
              return getManyReference(params, resourceName, resourcesData[resourceName]);

            case 16:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 18:
              _context.next = 20;
              return getOne(params, resourceName, resourcesData[resourceName]);

            case 20:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 22:
              // console.log('DELETE');
              uploadFields = resourcesUploadFields[resourceName] ? resourcesUploadFields[resourceName] : [];
              _context.next = 25;
              return del(params.id, resourceName, resourcesPaths[resourceName], uploadFields);

            case 25:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 27:
              _context.next = 29;
              return delMany(params.ids, resourceName, resourcesData[resourceName]);

            case 29:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 31:
              // console.log('UPDATE/CREATE');
              itemId = getItemID(params, type, resourceName, resourcesPaths[resourceName], resourcesData[resourceName]);
              uploads = resourcesUploadFields[resourceName] ? resourcesUploadFields[resourceName].map(function (field) {
                return upload(field, params.data, itemId, resourceName, resourcesPaths[resourceName]);
              }) : [];
              currentData = resourcesData[resourceName][itemId] || {};
              _context.next = 36;
              return _Promise.all(uploads);

            case 36:
              uploadResults = _context.sent;
              _context.next = 39;
              return save(itemId, params.data, currentData, resourceName, resourcesPaths[resourceName], firebaseSaveFilter, uploadResults, type === CREATE, timestampFieldNames);

            case 39:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 41:
              console.error('Undocumented method: ', type);
              return _context.abrupt('return', { data: [] });

            case 43:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x3, _x4, _x5) {
      return _ref.apply(this, arguments);
    };
  }();
};

export default RestProvider;