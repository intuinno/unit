exports.UnitChart = function(divId, spec) {

  d3.csv(spec.data, function(error, csv_data) {

    csv_data.forEach(function(d, i) {
      d.id = i;
    });

    var rootContainer = buildRootContainer(csv_data, spec);
    var layoutList = buildLayoutList(spec.layouts);

    applyLayout(rootContainer, layoutList.head);
    drawUnit(rootContainer, spec, layoutList, divId);
  });

};

var defaultSetting = {
  layout: {
    box: {
      'fill':'blue',
      'stroke':'black',
      'stroke-width': 1,
      'opacity':0.03
    }
  }
}


function buildRootContainer(csv_data, spec) {
  var myContainer = {};
  myContainer.contents = csv_data;
  myContainer.label = 'root';
  if (!spec.hasOwnProperty('padding')) {
    spec.padding = {
      'top': 10,
      'left': 30,
      'bottom': 30,
      'right': 10
    };
  }

  myContainer.visualspace = {
    'width': spec.width,
    'height': spec.height,
    'posX': 0,
    'posY': 0,
    'padding': spec.padding
  };
  myContainer.layout = 'StartOfLayout';
  myContainer.parent = 'RootContainer';

  return myContainer;
}

function buildLayoutList(layouts, rootLayout) {

  var layoutList = {};

  layoutList.head = layouts[0];

  layouts.forEach(function(layout, i, all) {

    if (i > 0) {
      layout.parent = all[i - 1];
    } else {
      layout.parent = 'StartOfLayout';
    }
    if (i < all.length - 1) {
      layout.child = all[i + 1];
    } else {
      layout.child = 'EndOfLayout';
    }
  });
  return layoutList;
}

function getKeys(data, groupby) {
  var myNest = d3.nest()
    .key(function(d) {
      return d[groupby]
    })
    .entries(data);
  return myNest.map(function(d) {
    return d.key;
  });
}

function emptyContainersFromKeys(data, groupby) {

  return getKeys(data, groupby)
    .map(function(key) {
      return {
        'contents': [],
        'label': key,
        'visualspace': {}
      };
    });
}

function calcVisualSpace(parentContainer, childContainers, layout) {

  console.log('calcVisualSpace', layout.name);


  layout.containers = childContainers;

  switch (layout.type) {
    case 'gridxy':
      calcGridxyVisualSpace(parentContainer, childContainers, layout);
      break;
    default:
      console.log('Unsupported Layout type');
      break;
  }
}

function calcGridxyVisualSpace(parentContainer, childContainers, layout) {
  switch (layout.aspect_ratio) {
    case 'fillX':
    case 'fillY':
      calcFillGridxyVisualSpace(parentContainer, childContainers, layout);
      break;
    case 'square':
    case 'parent':
    case 'custom':
      calcPackGridxyVisualSpace(parentContainer, childContainers, layout)
  }
}

function calcFillGridxyVisualSpace(parentContainer, childContainers, layout) {

  var parentVisualSpace = parentContainer.visualspace;

  if (layout.aspect_ratio === 'fillX') {
    childContainers.forEach(function(c, i, all) {
      c.visualspace.width = (1.0 * (parentVisualSpace.width - parentVisualSpace.padding.left - parentVisualSpace.padding.right)) / all.length - layout.margin.left - layout.margin.right;

      c.visualspace.height = parentVisualSpace.height - parentVisualSpace.padding.top - parentVisualSpace.padding.bottom - layout.margin.top - layout.margin.bottom;

      c.visualspace.posX = parentVisualSpace.padding.left + i * (c.visualspace.width + layout.margin.right + layout.margin.left) + layout.margin.left;

      c.visualspace.posY = parentVisualSpace.padding.top + layout.margin.top;

      c.visualspace.padding = layout.padding;
    });
  } else if (layout.aspect_ratio === 'fillY') {
    childContainers.forEach(function(c, i, all) {
      c.visualspace.height = (1.0 * (parentVisualSpace.height - parentVisualSpace.padding.top - parentVisualSpace.padding.bottom)) / all.length - layout.margin.top - layout.margin.bottom;

      c.visualspace.width = parentVisualSpace.width - parentVisualSpace.padding.left - parentVisualSpace.padding.right - layout.margin.left - layout.margin.right;

      c.visualspace.posY = parentVisualSpace.padding.top + i * (c.visualspace.height + layout.margin.top + layout.margin.bottom) + layout.margin.top;
      c.visualspace.posX = parentVisualSpace.padding.left + layout.margin.left;

      c.visualspace.padding = layout.padding;
    });
  } else {
    console.log('TODO');
  }

}

function calcPackGridxyVisualSpace(parentContainer, childContainers, layout) {

  calcPackGridxyVisualSpaceIsolated(parentContainer, childContainers, layout);

}

function calcPackGridxyVisualSpaceIsolated(parentContainer, childContainers, layout) {

  if (isVerticalDirection(layout.direction)) {
    calcWidthFillingPackVisualSpace(parentContainer, childContainers, layout);
  } else {
    calcHeightFillingPackVisualSpace(parentContainer, childContainers, layout);
  }
}

function calcWidthFillingPackVisualSpace(parentContainer, childContainers, layout) {

  var aspect_ratio;

  switch(layout.aspect_ratio) {
    case 'square':
      aspect_ratio = 1;
      break;
    case 'parent':
      aspect_ratio = 1.0* parentContainer.visualspace.width / parentContainer.visualspace.height;
      break;
  }

  var edgeInfo = getRepetitionCountForFillingEdge(parentContainer.visualspace.width, parentContainer.visualspace.height, childContainers.length, aspect_ratio);

  applyEdgeInfo(parentContainer, childContainers, layout, edgeInfo);

}

function applyEdgeInfo(parentContainer, childContainers, layout, edgeInfo) {

  var xOrig, yOrig, xInc, yInc, numHoriElement, yOffset;

  switch (layout.direction) {
    case 'LRTB':
      xOrig = 0;
      yOrig = 0;
      xInc = edgeInfo.fillingEdgeSideUnitLength;
      yInc = edgeInfo.remainingEdgeSideUnitLength;
      numHoriElement = edgeInfo.fillingEdgeRepetitionCount;
      break;
    case 'LRBT':
      xOrig = 0;
      yOrig = parentContainer.visualspace.height - edgeInfo.remainingEdgeSideUnitLength;
      xInc = edgeInfo.fillingEdgeSideUnitLength;
      yInc = (-1.0) * edgeInfo.remainingEdgeSideUnitLength;
      numHoriElement = edgeInfo.fillingEdgeRepetitionCount;
      break;
    case 'RLBT':
    case 'RLTB':
      console.log('TODO');
      break;
  }

  childContainers.forEach(function(c, i, all) {
    c.visualspace.width = edgeInfo.fillingEdgeSideUnitLength;
    c.visualspace.height = edgeInfo.remainingEdgeSideUnitLength;
    c.visualspace.posX = xOrig + xInc * (i % numHoriElement);
    c.visualspace.posY = yOrig + yInc * (Math.floor(i / numHoriElement));
    c.visualspace.padding = layout.padding;
  })
}

//Here ratio means the apect ratio of unit.
//ratio = Filling Edge side divided by RemainingEdge side

function getRepetitionCountForFillingEdge(fillingEdge, remainingEdge, numElement, ratio) {

  var fillingEdgeRepetitionCount = 0;
  var remainingEdgeSideUnitLength, remainingEdgeRepetitionCount, numPossibleContainers, fillingEdgeSideUnitLength;

  do {

    fillingEdgeRepetitionCount++;
    fillingEdgeSideUnitLength = 1.0 * fillingEdge / fillingEdgeRepetitionCount;

    remainingEdgeSideUnitLength = fillingEdgeSideUnitLength / ratio;

    remainingEdgeRepetitionCount = Math.floor(1.0 * remainingEdge / remainingEdgeSideUnitLength);

    numPossibleContainers = remainingEdgeRepetitionCount * fillingEdgeRepetitionCount;

  }
  while (numElement > numPossibleContainers);

  return {
    'fillingEdgeRepetitionCount': fillingEdgeRepetitionCount,
    'remainingEdgeRepetitionCount': remainingEdgeRepetitionCount,
    'fillingEdgeSideUnitLength': fillingEdgeSideUnitLength,
    'remainingEdgeSideUnitLength': remainingEdgeSideUnitLength
  };

}

function isVerticalDirection(direction) {

  switch (direction) {
    case 'LRBT':
    case 'LRTB':
    case 'RLBT':
    case 'RLTB':
      return true;
      break;
    case 'BTLR':
    case 'BTRL':
    case 'TBLR':
    case 'TBLR':
      return false;
      break;
  }
}

function calcPackGridxyVisualSpaceShared(parentContainer, childContainers, layout) {

  if (isVerticalDirection(layout.direction)) {
    calcWidthFillingPackVisualSpace(parentContainer, childContainers, layout);
    var minSharedWidth = getMinAmongContainers(parentContainer, layout, 'width');
    applySharedWidthOnContainers(minSharedWidth, parentContainer, childContainers, layout);

  } else {
    calcHeightFillingPackVisualSpace(parentContainer, childContainers, layout);
    var minSharedHeight = getMinAmongContainers(childContainers, 'height');
  }
}

function getMinAmongContainers(layout, prop) {

  var shared_containers = layout.sizeSharingGroup;

  return d3.min(shared_containers, function(d) {
    return d.visualspace[prop];
  });
}

function applySharedWidthOnContainers(minWidth, layout) {

  var parentContainers = getParents(layout.sizeSharingGroup);

  parentContainers.forEach(function(c) {

    var edgeInfo = buildEdgeInfoFromMinWidth(c, minWidth, layout);

    applyEdgeInfo(c, c.contents, layout, edgeInfo);
  });
}

function getParents(containers) {
  var mySet = new Set();

  containers.forEach(function(d) {
    mySet.add(d.parent);
  });

  return [...mySet];
}

function buildEdgeInfoFromMinWidth(parentContainer, minWidth, layout) {

  var height;

  var horizontalRepetitionCount = Math.round(parentContainer.visualspace.width / minWidth);
  var verticalRepetitionCount = 0;
  if (layout.aspect_ratio === 'square') {
    height = minWidth;
  } else {
    console.log('TODO');
  }

  return {
    'fillingEdgeRepetitionCount': horizontalRepetitionCount,
    'remainingEdgeRepetitionCount': verticalRepetitionCount,
    'fillingEdgeSideUnitLength': minWidth,
    'remainingEdgeSideUnitLength': height
  }
}

function applyLayout(container, layout) {
  var newContainers = makeContainers(container, layout);
  calcVisualSpace(container, newContainers, layout);

  if (layout.child !== 'EndOfLayout') {
    newContainers.forEach(function(c) {
      applyLayout(c, layout.child);
    });
  }

  container.contents = newContainers;
  handleSharedSize(container, layout);



  console.log('Fininshing', layout.name);
}

function handleSharedSize(container, layout) {

  if (layout.size.isShared) {
    if (!layout.hasOwnProperty('sizeSharingGroup')) {
      layout.sizeSharingGroup = [];
    }
    layout.sizeSharingGroup = layout.sizeSharingGroup.concat(container.contents);
  } else {
    applySharedSize(layout.child);
  }
}


function applySharedSize(layout) {

  if (layout === 'EndOfLayout' || layout.size.isShared !== true) {
    return;
  }

  if (layout.child != 'EndOfLayout') {
    if (layout.child.size.isShared) {
      applySharedSize(layout.child);
    }
  }

  makeSharedSize(layout);
  layout.sizeSharingGroup = [];
}

function makeSharedSize(layout) {
  switch (layout.aspect_ratio) {
    case 'fillX':
    case 'fillY':
      makeSharedSizeFill(layout);
      break;
    case 'square':
    case 'parent':
    case 'custom':
      makeSharedSizePack(layout)
  }
}

function makeSharedSizeFill(layout) {
  console.log('TODO: makeSharedSizeFill');
}

function makeSharedSizePack(layout) {
  console.log(layout);


  if (isVerticalDirection(layout.direction)) {

    var minSharedWidth = getMinAmongContainers(layout, 'width');
    applySharedWidthOnContainers(minSharedWidth, layout);

  } else {
    calcHeightFillingPackVisualSpace(parentContainer, childContainers, layout);
    var minSharedHeight = getMinAmongContainers(childContainers, 'height');
  }

}

function makeContainers(container, layout) {

  var sharingAncestorContainer = getSharingAncestorContainer(container, layout, 'groupby');

  var sharingDomain = getSharingDomain(sharingAncestorContainer);

  if (layout.groupby.hasOwnProperty('type') && layout.groupby.type === 'numerical') {
    return makeContainersForNumericalVar(sharingDomain, container, layout);
  } else {
    return makeContainersForCategoricalVar(sharingDomain, container, layout);
  }

}

function makeContainersForCategoricalVar(sharingDomain, container, layout) {

  var newContainers = emptyContainersFromKeys(sharingDomain, layout.groupby.key);

  newContainers.forEach(function(c, i, all) {
    c.contents = container.contents.filter(function(d) {
      return d[layout.groupby.key] == c.label;
    });
    c.parent = container;
  });
  return newContainers;
}

function makeContainersForNumericalVar(sharingDomain, container, layout) {

  var groupby = layout.groupby;

  var extent = d3.extent(sharingDomain, function(d) {
    return +d[groupby.key];
  });

  var tempScale = d3.scaleLinear().domain([0, groupby.numBin]).range(extent);
  var tickArray = d3.range(groupby.numBin + 1).map(tempScale);

  var nullGroup = sharingDomain.filter(function(d) {
    return d[groupby.key] == '';

  });

  var valueGroup = sharingDomain.filter(function(d) {
    return d[groupby.key] != '';
  });

  var bins = d3.histogram()
    .domain(extent)
    .thresholds(tickArray)
    .value(function(d) {
      return +d[groupby.key];
    })(valueGroup);

  console.log(bins);

  nullGroup = [nullGroup];
  nullGroup.x0 = '';
  nullGroup.x1 = '';

  var containers = nullGroup.concat(bins);

  containers = containers.map(function(d) {
    return {
      'contents': d,
      'label': d.x0 + '-' + d.x1,
      'visualspace': {},
      'parent': container
    }
  });

  return containers;

}

function getSharingAncestorContainer(container, layout, item) {

  if (layout[item].isShared) {
    if (container.parent !== 'RootContainer') {
      return getSharingAncestorContainer(container.parent, layout.parent, item);
    }
  }
  return container;
}

function getSharingDomain(container) {

  if (isContainer(container)) {

    var leafs = [];
    container.contents.forEach(function(c) {
      var newLeaves = getSharingDomain(c);

      newLeaves.forEach(function(d) {
        leafs.push(d);
      });
    });
    return leafs;

  } else {
    return [container];
  }
}


function isContainer(container) {

  if (container.hasOwnProperty('contents') && container.hasOwnProperty('visualspace') && container.hasOwnProperty('parent')) {

    return true;
  }
  return false;
}

function drawUnit(container, spec, layoutList, divId) {

  var layouts = spec.layouts;
  var markPolicy = spec.mark;

  var svg = d3.select('#' + divId).append('svg')
    .attr('width', spec.width)
    .attr('height', spec.height);

  var rootGroup = svg.selectAll('.root')
    .data([container])
    .enter().append('g')
    .attr('class', 'root')
    .attr('transform', function(d) {
      return 'translate(' + d.visualspace.posX + ', ' + d.visualspace.posY + ')';
    })

  var currentGroup = rootGroup;
  layouts.forEach(function(layout) {

    var tempGroup = currentGroup.selectAll('.' + layout.name)
      .data(function(d) {
        return d.contents;
      })
      .enter().append('g')
      .attr('class', layout.name)
      .attr('transform', function(d) {
        return 'translate(' + d.visualspace.posX + ', ' + d.visualspace.posY + ')';
      });

    tempGroup.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', function(d) {
        return d.visualspace.width;
      })
      .attr('height', function(d) {
        return d.visualspace.height;
      })
      .style('opacity', function(d) {
        if (layout.hasOwnProperty('box') && layout.box.hasOwnProperty('opacity')) {
          return layout.box.opacity;
        } else {
          return defaultSetting.layout.box.opacity;
        }
      })
      .style('fill', function(d) {
        if (layout.hasOwnProperty('box') && layout.box.hasOwnProperty('fill')) {
          return layout.box.fill;
        } else {
          return defaultSetting.layout.box.fill;
        }
      })
      .style('stroke', function(d) {
        if (layout.hasOwnProperty('box') && layout.box.hasOwnProperty('stroke')) {
          return layout.box.stroke;
        } else {
          return defaultSetting.layout.box.stroke;
        }
      })
      .style('stroke-width', function(d) {
        if (layout.hasOwnProperty('box') && layout.box.hasOwnProperty('stroke-width')) {
          return layout.box['stroke-width'];
        } else {
          return defaultSetting.layout.box['stroke-width'];
        }
      });

    currentGroup = tempGroup;

  });

  currentGroup.append('circle')
    .attr('cx', function(d) {
      return d.visualspace.width / 2;
    })
    .attr('cy', function(d) {
      return d.visualspace.height / 2;
    })
    .attr('r', function(d) {
      return calcRadius(d, container, markPolicy, layoutList);
    })
    .style('fill', function(d) {
      return 'purple'
    });

}

function calcRadius(leafContainer, rootContainer, markPolicy, layoutList) {

  var radius;
  if (markPolicy.size.isShared) {
    radius = calcRadiusShared(leafContainer, rootContainer, markPolicy, layoutList);
  } else {
    radius = calcRadiusIsolated(leafContainer, markPolicy);
  }
  return radius;
}

function calcRadiusIsolated(leafContainer, markPolicy) {

  var width = leafContainer.visualspace.width;
  var height = leafContainer.visualspace.height;

  if (markPolicy.size.type === 'max') {
    return width > height ? height / 2.0 : width / 2.0;
  }
}

function calcRadiusShared(leafContainer, rootContainer, markPolicy, layoutList) {

  var radius;
  var leafContainersArr = buildLeafContainersArr(rootContainer, layoutList.head);

  return d3.min(leafContainersArr, function(d) {
    return calcRadiusIsolated(d, markPolicy);
  });
}

function buildLeafContainersArr(container, layout) {

  if (layout.child !== 'EndOfLayout') {

    var leafs = [];
    container.contents.forEach(function(c) {
      var newLeaves = buildLeafContainersArr(c, layout.child);

      newLeaves.forEach(function(d) {
        leafs.push(d);
      });
    });
    return leafs;

  } else {
    return container.contents;
  }
}
