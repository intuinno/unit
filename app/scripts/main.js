var spec_path = 'data/titanic_spec.json';

d3.json(spec_path, function(error, spec) {

  d3.csv(spec.data, function(error, csv_data) {

    csv_data.forEach(function(d, i) {
      d.id = i;
    });

    var myContainer = {}
    myContainer.contents = csv_data;
    myContainer.isContentsContainers = false;
    myContainer.label = 'root';
    myContainer.visualspace = {
      'width': spec.width,
      'height': spec.height,
      'posX': 0,
      'posY': 0,
    };

    var layoutList = buildLayoutList(spec.layouts);
    applyLayout(csv_data, myContainer, layoutList.head);

    console.log(myContainer);

    drawUnit(myContainer, spec, spec.mark);


  })
})

function buildLayoutList(layouts) {

  var layoutList = {};

  layoutList.head = layouts[0];

  layouts.forEach(function(layout, i, all) {

    if (i > 0) {
      layout.parent = all[i - 1];
    } else {
      layout.parent = "StartOfLayout";
    }
    if (i < all.length - 1) {
      layout.child = all[i + 1];
    } else {
      layout.child = "EndOfLayout";
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
        'isContentsContainers': false,
        'label': key,
        'visualspace': {}
      };
    });
}

function makeContainersUsingSharedScale(data, container, layout) {
  var groupby = layout.groupby;
  var newContainers = emptyContainersFromKeys(data, groupby);

  newContainers.forEach(function(c, i, all) {
    c.contents = container.contents.filter(function(d) {
      return d[groupby] === c.label;
    });
  });

  calcVisualSpace(container, newContainers, layout);

  return newContainers;
}

function calcVisualSpace(parentContainer, childContainers, layout) {
  switch (layout.type) {
    case 'gridxy':
      calcGridxyVisualSpace(parentContainer, childContainers, layout);
      break;
    default:
      console.log("Unsupported Layout type");
      break;
  }
}

function calcGridxyVisualSpace(parentContainer, childContainers, layout) {
  switch (layout.aspect_ratio) {
    case "fillX":
    case "fillY":
      calcFillGridxyVisualSpace(parentContainer, childContainers, layout);
      break;
    case "square":
    case "parent":
    case "custom":
      calcPackGridxyVisualSpace(parentContainer, childContainers, layout)
  }
}

function calcFillGridxyVisualSpace(parentContainer, childContainers, layout) {

  var parentVisualSpace = parentContainer.visualspace;

  if (layout.aspect_ratio === 'fillX') {
    childContainers.forEach(function(c, i, all) {
      c.visualspace.width = (1.0 * parentVisualSpace.width) / all.length;
      c.visualspace.height = parentVisualSpace.height;
      c.visualspace.posX = i * c.visualspace.width;
      c.visualspace.posY = 0;
    });
  } else if (layout.aspect_ratio === 'fillY') {
    childContainers.forEach(function(c, i, all) {
      c.visualspace.height = (1.0 * parentVisualSpace.height) / all.length;
      c.visualspace.width = parentVisualSpace.width;
      c.visualspace.posY = i * c.visualspace.height;
      c.visualspace.posX = 0;
    });
  } else {
    console.log("TODO");
  }

}

function calcPackGridxyVisualSpace(parentContainer, childContainers, layout) {

  console.log("TODO");

}

function makeContainersUsingIsolatedScale(data, container, layout) {

  var groupby = layout.groupby;
  var myNest = d3.nest()
    .key(function(d) {
      return d[groupby]
    })
    .entries(container.contents);

  var newContainers = myNest.map(function(d) {
    return {
      'contents': d.values,
      'isContentsContainers': false,
      'label': d.key,
      'visualspace': {}
    };
  });

  calcVisualSpace(container, newContainers, layout);

  return newContainers;
}

function applyLayout(data, container, layout) {
  var newContainers;

  if (layout.isScaleShared) {
    newContainers = makeContainersUsingSharedScale(data, container, layout);
  } else {
    newContainers = makeContainersUsingIsolatedScale(container.contents, container, layout);
  }

  if (layout.child !== "EndOfLayout") {
    newContainers.forEach(function (c) {
      applyLayout(data, c, layout.child);
    } );
  }
  container.contents = newContainers;
  container.isContentsContainers = true;
}

function drawUnit(container, spec, mark) {

  var layouts = spec.layouts;

  var svg = d3.select(".chart").append("svg")
    .attr("width", spec.width)
    .attr("height", spec.height);

  var rootGroup = svg.selectAll(".root")
    .data([container])
    .enter().append("g")
    .attr("class", "root")
    .attr("transform", function(d) {
      return "translate(" + d.visualspace.posX + ", " + d.visualspace.posY + ")";
    })

  var currentGroup = rootGroup;
  layouts.forEach(function(layout) {

    var tempGroup = currentGroup.selectAll("." + layout.name)
      .data(function(d) {
        return d.contents;
      })
      .enter().append("g")
      .attr("class", layout.name)
      .attr("transform", function(d) {
        return "translate(" + d.visualspace.posX + ", " + d.visualspace.posY + ")";
      });

    tempGroup.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", function(d) {
        return d.visualspace.width;
      })
      .attr("height", function(d) {
        return d.visualspace.height;
      })
      .style("opacity", 0.03)
      .style("fill", "blue")
      .style("stroke", "black")
      .style("stroke-width", "1");

    currentGroup = tempGroup;

  });

  currentGroup.append("circle")
    .attr("cx", function(d) {
      return d.visualspace.width / 2;
    })
    .attr("cy", function(d) {
      return d.visualspace.height / 2;
    })
    .attr("r", function(d) {
      return calcRadius(d, container, mark);
    })
    .style("fill", function(d) {
      return "purple"
    });

}

function calcRadius(leafContainer, rootContainer, markPolicy) {

  var radius;
  if (markPolicy.size.isShared) {
    radius = calcRadiusShared(leafContainer, rootContainer, markPolicy);
  } else {
    radius = calcRadiusIsolated(leafContainer, markPolicy);
  }
  return radius;
}

function calcRadiusIsolated(leafContainer, markPolicy){

  var width = leafContainer.visualspace.width;
  var height = leafContainer.visualspace.height;

  if (markPolicy.size.type === 'max') {
    return width > height ? height/2.0 : width/2.0;
  }
}
