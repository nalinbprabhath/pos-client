define(['breeze', 'knockout'], function(breeze, ko) {

  var core = breeze.core;

  var ctor = function() {
      this.name = "koES5";
  };

  ctor.prototype.initialize = function() {
  };

  ctor.prototype.getTrackablePropertyNames = function(entity) {
    var names = [];
    for (var p in entity) {
      if (p === "entityType")
          continue;
      if (p === "_$typeName")
          continue;
      if (p === "_pendingSets")
          continue;
      if (p === "_backingStore")
          continue;
      
      var propDescr = getES5PropDescriptor(entity, p);
      if(propDescr && !ko.isObservable(propDescr.get)){
         continue;
      }
      var val = entity[p];
      if (propDescr && propDescr.get) {
          names.push(p);
      }
      else if (!core.isFunction(val)) {
          names.push(p);
      }
    }
    return names;
  };

  // This method is called during Metadata initialization 
  ctor.prototype.initializeEntityPrototype = function(proto) {

    proto.getProperty = function(propertyName) {
      return this[propertyName];
    };

    proto.setProperty = function(propertyName, value) {
      this[propertyName] = value;
      // allow setProperty chaining.
      return this;
    };
  };

  // This method is called when an EntityAspect is first created - this will occur as part of the entityType.createEntity call. 
  // which can be called either directly or via standard query materialization

  // entity is either an entity or a complexObject
  ctor.prototype.startTracking = function(entity, proto) {
    
    // assign default values to the entity
    var stype = entity.entityType || entity.complexType;
    entity.__observable__ = {};
    stype.getProperties().forEach(function(prop) {
      var propName = prop.name;
      var es5Descriptor = getES5PropDescriptor(proto, propName);
      if(!es5Descriptor){
        var val = entity[propName];
        val = initializeValueForProp(entity, prop, val);
        entity[propName] = val;
        makePropDescription(entity, prop, val);
      }
    });
    
    entity.__full__ = true;
    
  };


  function initializeValueForProp(entity, prop, val) {
    if (prop.isDataProperty) {
      if (prop.isComplexProperty) {
        // TODO: right now we create Empty complexObjects here - these should actually come from the entity
        if (prop.isScalar) {
          val = prop.dataType._createInstanceCore(entity, prop);
        } else {
          val = breeze.makeComplexArray([], entity, prop);
        }
      } else if (!prop.isScalar) {
        val = breeze.makePrimitiveArray([], entity, prop);
      } else if (val === undefined) {
        val = prop.defaultValue;
      }
    } else if (prop.isNavigationProperty) {
      if (val !== undefined) {
        // throw new Error("Cannot assign a navigation property in an entity ctor.: " + prop.name);
      }
      if (prop.isScalar) {
        // TODO: change this to nullEntity later.
        val = null;
      } else {
        val = breeze.makeRelationArray([], entity, prop);
      }
    } else {
      throw new Error("unknown property: " + prop.name);
    }
    return val;
  }

  function onBeforeChange(args) {
    args._koObj._suppressBreeze = true;
  }

  function onArrayChanged(args) {
    var koObj = args.array._koObj;
    if (koObj._suppressBreeze) {
      koObj._suppressBreeze = false;
    } else {
      koObj.valueHasMutated();
    }
  }

  function makePropDescription(entity, prop, val) {

    var propName = prop.name;

    var koObj = prop.isScalar ? ko.observable(val) : ko.observableArray(val);

    var setter;

    if (prop.isScalar) {
      setter = ko.computed({
        read: koObj,
        write: function(newValue) {
          entity._$interceptor(prop, newValue, koObj);
          // koObj(newValue);
          return entity;
        }
      });
    }
    else {
      koObj.equalityComparer = function() {
        throw new Error("Collection navigation properties may NOT be set.");
      };
      
      setter = koObj;
      val._koObj = koObj;
      // code to suppress extra breeze notification when 
      // ko's array methods are called.
      koObj.subscribe(onBeforeChange, null, "beforeChange");
      // code to insure that any direct breeze changes notify ko
      val.arrayChanged.subscribe(onArrayChanged);
    }

    var descr = {
      get: setter,
      set: setter,
      enumerable: true,
      configurable: true
    };
    Object.defineProperty(entity, propName, descr);
    entity.__observable__[propName] = setter;
  }

  function getES5PropDescriptor(proto, propName) {
    if (proto.hasOwnProperty(propName)) {
      return Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(proto, propName);
    } else {
      var nextProto = Object.getPrototypeOf(proto);
      return nextProto ? getES5PropDescriptor(nextProto, propName) : null;
    }
  }

  breeze.config.registerAdapter("modelLibrary", ctor);

  return ctor;

});