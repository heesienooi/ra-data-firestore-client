'use strict';

exports.__esModule = true;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _app = require('firebase/app');

var _app2 = _interopRequireDefault(_app);

require('firebase/firestore');

require('firebase/storage');

var _sortBy = require('sort-by');

var _sortBy2 = _interopRequireDefault(_sortBy);

var _reactAdmin = require('react-admin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var convertFileToBase64 = function convertFileToBase64(file) {
  return new _promise2['default'](function (resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file.rawFile);

    reader.onload = function () {
      return resolve(reader.result);
    };
    reader.onerror = reject;
  });
};

var addUploadFeature = function addUploadFeature(requestHandler) {
  return function (type, resource, params) {
    if (type === 'UPDATE') {
      if (params.data.image && params.data.image.length) {
        var formerPictures = params.data.image.filter(function (p) {
          return !(p.rawFile instanceof File);
        });
        var newPictures = params.data.image.filter(function (p) {
          return p.rawFile instanceof File;
        });

        return _promise2['default'].all(newPictures.map(convertFileToBase64)).then(function (base64Pictures) {
          return base64Pictures.map(function (picture64) {
            return {
              src: picture64,
              title: '' + params.data.title
            };
          });
        }).then(function (transformedNewPictures) {
          return requestHandler(type, resource, (0, _extends3['default'])({}, params, {
            data: (0, _extends3['default'])({}, params.data, {
              image: [].concat(transformedNewPictures, formerPictures)
            })
          }));
        });
      }
    }
    // for other request types and reources, fall back to the defautl request handler
    return requestHandler(type, resource, params);
  };
};

var getImageSize = function getImageSize(file) {
  return new _promise2['default'](function (resolve) {
    var img = document.createElement('img');
    img.onload = function () {
      resolve({
        width: this.width,
        height: this.height
      });
    };
    img.src = file.src;
  });
};

var upload = function () {
  var _ref = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee(fieldName, submitedData, id, resourceName, resourcePath) {
    var file, rawFile, result, ref, snapshot, downloadURL, imageSize;
    return _regenerator2['default'].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            file = submitedData[fieldName];

            file = Array.isArray(file) ? file[0] : file;
            rawFile = file.rawFile;
            result = {};

            if (!(file && rawFile && rawFile.name)) {
              _context.next = 29;
              break;
            }

            ref = _app2['default'].storage().ref().child(resourcePath + '/' + id + '/' + fieldName);
            _context.next = 8;
            return ref.put(rawFile);

          case 8:
            snapshot = _context.sent;
            _context.next = 11;
            return snapshot.ref.getDownloadURL();

          case 11:
            downloadURL = _context.sent;

            result[fieldName] = [{}];
            result[fieldName][0].uploadedAt = new Date();
            result[fieldName][0].src = downloadURL;
            result[fieldName][0].type = rawFile.type;

            if (!(rawFile.type.indexOf('image/') === 0)) {
              _context.next = 28;
              break;
            }

            _context.prev = 17;
            _context.next = 20;
            return getImageSize(file);

          case 20:
            imageSize = _context.sent;

            result[fieldName][0].width = imageSize.width;
            result[fieldName][0].height = imageSize.height;
            _context.next = 28;
            break;

          case 25:
            _context.prev = 25;
            _context.t0 = _context['catch'](17);

            console.error('Failed to get image dimensions');

          case 28:
            return _context.abrupt('return', result);

          case 29:
            return _context.abrupt('return', false);

          case 30:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[17, 25]]);
  }));

  return function upload(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

var save = function () {
  var _ref2 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee2(id, data, previous, resourceName, resourcePath, firebaseSaveFilter, uploadResults, isNew, timestampFieldNames) {
    var _Object$assign3;

    var _Object$assign2;

    return _regenerator2['default'].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (uploadResults) {
              uploadResults.map(function (uploadResult) {
                return uploadResult ? (0, _assign2['default'])(data, uploadResult) : false;
              });
            }

            if (isNew) {
              (0, _assign2['default'])(data, (_Object$assign2 = {}, _Object$assign2[timestampFieldNames.createdAt] = new Date(), _Object$assign2));
            }

            data = (0, _assign2['default'])(previous, (_Object$assign3 = {}, _Object$assign3[timestampFieldNames.updatedAt] = new Date(), _Object$assign3), data);

            if (!data.id) {
              data.id = id;
            }

            _context2.next = 6;
            return _app2['default'].firestore().doc(resourcePath + '/' + data.id).set(firebaseSaveFilter(data));

          case 6:
            return _context2.abrupt('return', { data: data });

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function save(_x6, _x7, _x8, _x9, _x10, _x11, _x12, _x13, _x14) {
    return _ref2.apply(this, arguments);
  };
}();

var del = function () {
  var _ref3 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee3(id, resourceName, resourcePath, uploadFields) {
    return _regenerator2['default'].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (uploadFields.length) {
              uploadFields.map(function (fieldName) {
                return _app2['default'].storage().ref().child(resourcePath + '/' + id + '/' + fieldName)['delete']();
              });
            }

            _context3.next = 3;
            return _app2['default'].firestore().doc(resourcePath + '/' + id)['delete']();

          case 3:
            return _context3.abrupt('return', { data: id });

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function del(_x15, _x16, _x17, _x18) {
    return _ref3.apply(this, arguments);
  };
}();

var delMany = function () {
  var _ref4 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee4(ids, resourceName, previousData) {
    return _regenerator2['default'].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return ids.map(function (id) {
              return _app2['default'].firestore().doc(resourceName + '/' + id)['delete']();
            });

          case 2:
            return _context4.abrupt('return', { data: ids });

          case 3:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function delMany(_x19, _x20, _x21) {
    return _ref4.apply(this, arguments);
  };
}();

var getItemID = function getItemID(params, type, resourceName, resourcePath, resourceData) {
  var itemId = params.data.id || params.id || params.data.key || params.key;
  if (!itemId) {
    itemId = _app2['default'].firestore().collection(resourcePath).doc().id;
  }

  if (!itemId) {
    throw new Error('ID is required');
  }

  if (resourceData && resourceData[itemId] && type === _reactAdmin.CREATE) {
    throw new Error('ID already in use');
  }

  return itemId;
};

var getOne = function () {
  var _ref5 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee5(params, resourceName, resourceData) {
    var result, data;
    return _regenerator2['default'].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!params.id) {
              _context5.next = 13;
              break;
            }

            _context5.next = 3;
            return _app2['default'].firestore().collection(resourceName).doc(params.id).get();

          case 3:
            result = _context5.sent;

            if (!result.exists) {
              _context5.next = 10;
              break;
            }

            data = result.data();


            if (data && data.id == null) {
              data['id'] = result.id;
            }
            return _context5.abrupt('return', { data: data });

          case 10:
            throw new Error('Id not found');

          case 11:
            _context5.next = 14;
            break;

          case 13:
            throw new Error('Id not found');

          case 14:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function getOne(_x22, _x23, _x24) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * params example:
 * pagination: { page: 1, perPage: 5 },
 * sort: { field: 'title', order: 'ASC' },
 * filter: { author_id: 12 }
 */

var getList = function () {
  var _ref6 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee6(params, resourceName, resourceData) {
    var values, snapshots, _iterator, _isArray, _i, _ref7, snapshot, _data, keys, _params$pagination, page, perPage, _start, _end, data, ids, total;

    return _regenerator2['default'].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!params.pagination) {
              _context6.next = 34;
              break;
            }

            values = [];
            _context6.next = 4;
            return _app2['default'].firestore().collection(resourceName).get();

          case 4:
            snapshots = _context6.sent;
            _iterator = snapshots.docs, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3['default'])(_iterator);

          case 6:
            if (!_isArray) {
              _context6.next = 12;
              break;
            }

            if (!(_i >= _iterator.length)) {
              _context6.next = 9;
              break;
            }

            return _context6.abrupt('break', 22);

          case 9:
            _ref7 = _iterator[_i++];
            _context6.next = 16;
            break;

          case 12:
            _i = _iterator.next();

            if (!_i.done) {
              _context6.next = 15;
              break;
            }

            return _context6.abrupt('break', 22);

          case 15:
            _ref7 = _i.value;

          case 16:
            snapshot = _ref7;
            _data = snapshot.data();

            if (_data && _data.id == null) {
              _data['id'] = snapshot.id;
            }
            values.push(_data);

          case 20:
            _context6.next = 6;
            break;

          case 22:

            if (params.filter) {
              values = values.filter(function (item) {
                var meetsFilters = true;
                for (var _iterator2 = (0, _keys2['default'])(params.filter), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3['default'])(_iterator2);;) {
                  var _ref8;

                  if (_isArray2) {
                    if (_i2 >= _iterator2.length) break;
                    _ref8 = _iterator2[_i2++];
                  } else {
                    _i2 = _iterator2.next();
                    if (_i2.done) break;
                    _ref8 = _i2.value;
                  }

                  var key = _ref8;

                  meetsFilters = item[key] === params.filter[key];
                }
                return meetsFilters;
              });
            }

            if (params.sort) {
              values.sort((0, _sortBy2['default'])('' + (params.sort.order === 'ASC' ? '-' : '') + params.sort.field));
            }

            keys = values.map(function (i) {
              return i.id;
            });
            _params$pagination = params.pagination, page = _params$pagination.page, perPage = _params$pagination.perPage;
            _start = (page - 1) * perPage;
            _end = page * perPage;
            data = values ? values.slice(_start, _end) : [];
            ids = keys.slice(_start, _end) || [];
            total = values ? values.length : 0;
            return _context6.abrupt('return', { data: data, ids: ids, total: total });

          case 34:
            throw new Error('Error processing request');

          case 35:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function getList(_x25, _x26, _x27) {
    return _ref6.apply(this, arguments);
  };
}();

var getMany = function () {
  var _ref9 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee7(params, resourceName, resourceData) {
    var data, _iterator3, _isArray3, _i3, _ref10, id, _ref11, item;

    return _regenerator2['default'].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            data = [];
            /* eslint-disable no-await-in-loop */

            _iterator3 = params.ids, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator3['default'])(_iterator3);

          case 2:
            if (!_isArray3) {
              _context7.next = 8;
              break;
            }

            if (!(_i3 >= _iterator3.length)) {
              _context7.next = 5;
              break;
            }

            return _context7.abrupt('break', 20);

          case 5:
            _ref10 = _iterator3[_i3++];
            _context7.next = 12;
            break;

          case 8:
            _i3 = _iterator3.next();

            if (!_i3.done) {
              _context7.next = 11;
              break;
            }

            return _context7.abrupt('break', 20);

          case 11:
            _ref10 = _i3.value;

          case 12:
            id = _ref10;
            _context7.next = 15;
            return getOne({ id: id }, resourceName, resourceData);

          case 15:
            _ref11 = _context7.sent;
            item = _ref11.data;

            data.push(item);

          case 18:
            _context7.next = 2;
            break;

          case 20:
            return _context7.abrupt('return', { data: data });

          case 21:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function getMany(_x28, _x29, _x30) {
    return _ref9.apply(this, arguments);
  };
}();

var getManyReference = function () {
  var _ref12 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee8(params, resourceName, resourceData) {
    var _ref13, data, total;

    return _regenerator2['default'].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (!params.target) {
              _context8.next = 11;
              break;
            }

            if (!params.filter) params.filter = {};
            params.filter[params.target] = params.id;
            _context8.next = 5;
            return getList(params, resourceName, resourceData);

          case 5:
            _ref13 = _context8.sent;
            data = _ref13.data;
            total = _ref13.total;
            return _context8.abrupt('return', { data: data, total: total });

          case 11:
            throw new Error('Error processing request');

          case 12:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function getManyReference(_x31, _x32, _x33) {
    return _ref12.apply(this, arguments);
  };
}();

exports['default'] = {
  upload: upload,
  save: save,
  del: del,
  delMany: delMany,
  getItemID: getItemID,
  getOne: getOne,
  getList: getList,
  getMany: getMany,
  getManyReference: getManyReference,
  addUploadFeature: addUploadFeature,
  convertFileToBase64: convertFileToBase64
};
module.exports = exports['default'];