/* global docs */

'use strict';

(function () {

  var groupNodes = [];
  var container = document.getElementById('container');

  function insertAfter (newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function createSlug (text) {
    return (text || '').toLowerCase().replace(/^\s+/, '').replace(/\s+$/, '').replace(/[\s_]/gi, '-');
  }

  function createLinkedHeader (type, content) {
    var slug = createSlug(content);
    var header = document.createElement(type);
    header.setAttribute('id', slug);

    var link = document.createElement('a');
    link.setAttribute('href', '#' + slug);
    link.textContent = content;
    header.appendChild(link);

    return header;
  }

  function createArguments (args, snippet) {
    if (!args || !args.length) {
      return;
    }

    for (var i = 0; i < args.length; i += 1) {
      var arg = args[i];

      var name = document.createElement('span');
      name.setAttribute('class', 'code-argument');
      name.textContent = arg.name;
      snippet.appendChild(name);

      if (arg.type) {
        var type = document.createElement('span');
        type.setAttribute('class', 'code-type');
        type.textContent = ' <' + arg.type + '>';
        snippet.appendChild(type);
      }

      if (arg.optional) {
        var optional = document.createElement('span');
        optional.setAttribute('class', 'code-optional');
        optional.textContent = ' (Optional)';
        snippet.appendChild(optional);
      }

      if (i < args.length - 1) {
        var comma = document.createElement('span');
        comma.textContent = ', ';
        snippet.appendChild(comma);
      }
    }
  }

  function createReturns (returns, snippet) {
    if (!returns) {
      return;
    }

    var comment = document.createElement('span');
    comment.textContent = '\nReturns ';
    snippet.appendChild(comment);

    var name = document.createElement('span');
    name.setAttribute('class', 'code-return');
    name.textContent = returns.name;
    snippet.appendChild(name);

    if (returns.type) {
      var type = document.createElement('span');
      type.setAttribute('class', 'code-type');
      type.textContent = ' <' + returns.type + '>';
      snippet.appendChild(type);
    }
  }

  function createSnippet (method) {
    var snippet = document.createElement('span');

    var instance = document.createElement('span');
    instance.setAttribute('class', 'code-object');
    instance.textContent = 'canvas';
    snippet.appendChild(instance);

    var dot = document.createElement('span');
    dot.textContent = '.';
    snippet.appendChild(dot);

    var call = document.createElement('span');
    call.setAttribute('class', 'code-property');
    call.textContent = method.name;
    snippet.appendChild(call);

    var openParen = document.createElement('span');
    openParen.textContent = '(';
    snippet.appendChild(openParen);

    createArguments(method.arguments, snippet);

    var closeParen = document.createElement('span');
    closeParen.textContent = ');';
    snippet.appendChild(closeParen);

    createReturns(method.returns, snippet);

    return snippet;
  }

  function documentMethod (method) {
    var methodNode = document.createElement('div');
    methodNode.setAttribute('class', 'method');

    var methodName = createLinkedHeader('h3', method.name);
    methodNode.appendChild(methodName);

    var methodDescription = document.createElement('p');
    methodDescription.textContent = method.description;
    methodNode.appendChild(methodDescription);

    var snippet = document.createElement('pre');
    snippet.appendChild(createSnippet(method));
    methodNode.appendChild(snippet);

    return methodNode;
  }

  function createDocumentation (group, index) {
    var groupNode = document.createElement('div');
    groupNode.setAttribute('class', 'group');

    var groupName = createLinkedHeader('h2', group.name);
    groupName.setAttribute('class', 'group-header');
    groupNode.appendChild(groupName);

    for (var i = 0; i < group.methods.length; i += 1) {
      groupNode.appendChild(documentMethod(group.methods[i], i));
    }

    if (index === 0) {
      container.insertBefore(groupNode, container.childNodes[0]);
    } else {
      var hr = document.createElement('hr');
      insertAfter(hr, groupNodes[groupNodes.length - 1]);
      insertAfter(groupNode, hr);
    }

    groupNodes.push(groupNode);
  }

  for (var i = 0; i < docs.length; i += 1) {
    createDocumentation(docs[i], i);
  }

})();