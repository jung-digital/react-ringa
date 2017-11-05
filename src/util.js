import ReactDOM from 'react-dom';
import React from 'react';

/**
 * Walks the dom ancestors until it finds the nearest dom node that has a ref to a React Component and then
 * returns that React Component.
 *
 * @param domNode The DOM node to start with.
 * @returns {*}
 */
export function domNodeToNearestReactComponent(domNode) {
  while (domNode) {
    for (let key in domNode) {
      if (key.startsWith('__reactInternalInstance$')) {
        return domNode[key]._currentElement._owner._instance;
      }
    }

    domNode = domNode.parentNode;
  }

  return null;
}

/**
 * Walks the dom ancestors until it finds the nearest dom node that has a ref to a React Component and then returns
 * that dom node.
 *
 * @param domNode The DOM node to start with.
 * @returns {*}
 */
export function domNodeToNearestReactComponentDomNode(domNode) {
  while (domNode) {
    for (let key in domNode) {
      if (key.startsWith('__reactInternalInstance$')) {
        return domNode;
      }
    }

    domNode = domNode.parentNode;
  }

  return null;
}

/**
 * Walks the React Components up through the parent heirarchy.
 *
 * @param component A React Component instance.
 * @param callback A callback to call for each component in the ancestors.
 */
export function walkReactParents(component, callback) {
  if (component._reactInternalFiber) {
    return _walkReactParents16(component, callback);
  } else {
    return _walkReactParents15(component, callback);
  }
}

function _walkReactParents16(component, callback) {
  let ancestors = [];

  let fiber = component._reactInternalFiber;

  while (fiber) {
    let item = fiber.stateNode;

    if (item && item instanceof React.Component) {
      if (ancestors.indexOf(item) === -1) {
        ancestors.push(item);
      }
    }

    if (item && item.$ringaAlternateParentComponent) {
      item = item.$ringaAlternateParentComponent._reactInternalInstance;
      fiber = item._reactInternalFiber;
    } else {
      fiber = fiber.return;
    }
  }

  if (callback) {
    ancestors.forEach(callback);
  }

  return ancestors;
}


function _walkReactParents15(component, callback) {
  let ancestors = [];

  component = component._reactInternalInstance;

  while (component) {
    let item = component._instance || component._currentElement._owner._instance;

    if (ancestors.indexOf(item) === -1) {
      ancestors.push(item);
    }

    if (item.$ringaAlternateParentComponent) {
      component = item.$ringaAlternateParentComponent._reactInternalInstance;
    } else {
      component = component._hostParent;
    }
  }

  if (callback) {
    ancestors.forEach(callback);
  }

  return ancestors;
}

/**
 * Returns all Ringa.Controller instances that exist in the ancestor tree.
 *
 * @param component A React Component instance.
 * @returns {Array}
 */
export function getAllReactComponentAncestors(component) {
  return walkReactParents(component);
}

/**
 * Returns all Ringa.Controller instances that will hear when you dispatch an event from any of the provided React component's
 * DOM nodes or its descendants.
 *
 * @param component A React Component instance.
 * @returns {Array}
 */
export function getAllListeningControllers(component) {
  let controllers = [];
  let parents = [];

  walkReactParents(component, c => {
    parents.push(c);
    if (c.$ringaControllers && c.$ringaControllers.length) {
      controllers = controllers.concat(c.$ringaControllers);
    }
  });

  return controllers;
}

export function findComponentRoot(component, refName) {
  let domNode;

  // First look for a ref to attach to...
  if (!component.refs || !component.refs[refName]) {
    // Second use react-dom to find the root node for the component...

    domNode = ReactDOM.findDOMNode(component);

    if (!domNode) {
      console.warn(`attach(): Error finding root DOM node for React Component ${component.constructor.name}. Component ref named '${refName}' does not exist and ReactDOM findDomNode(component) did not return anything. This can happen if the render() method returns null or undefined.`);
    }

    return domNode;
  } else {
    domNode = component.refs[refName];
  }

  return domNode;
}