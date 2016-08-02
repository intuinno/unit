var spec_path = 'data/titanic_spec.json';

d3.json(spec_path, function(error, spec) {

  d3.csv(spec.data, function(error, csv_data) {

    csv_data.forEach(function(d,i) {
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

    spec.layouts.forEach(function(layout) {
      applyLayout(csv_data, myContainer,  layout);
    });

    drawUnit(myContainer, spec.mark);


  })
})

function getKeys(data, groupby) {
  var myNest = d3.nest()
                  .key(function(d) {return d[groupby]})
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
                  'label':key,
                  'visualspace':{}
                };
              });
}

function makeContainersUsingSharedScale(data, container, layout) {
  var groupby = layout.groupby;
  var newContainers= emptyContainersFromKeys(data, groupby);

  newContainers.forEach(function(c,i,all) {
    c.contents = data.filter(function(d) {
      return d[groupby] === c.label;
    });
  });

  calcVisualSpace(container, newContainers, layout);

  return newContainers;
}

function calcVisualSpace(parentContainer, childContainers, layout) {
  switch(layout.type) {
    case 'gridxy':
      console.log('gridxy');
      calcGridxyVisualSpace(parentContainer, childContainers, layout);
      break;
    default:
      console.log("Unsupported Layout type");
      break;
  }
}

function calcGridxyVisualSpace(parentContainer, childContainers, layout) {
  switch(layout.aspect_ratio) {
    case "fillX":
    case "fillY":
      calcFillGridxyVisualSpace(parentContainer, childContainers, layout);
      break;
    case "square":
    case "parent":
    case "custom":
      calcPackGridxyVisualSpace(parentContainer, childContainers,layout)
  }
}

function calcFillGridxyVisualSpace(parentContainer, childContainers,layout) {

  var parentVisualSpace = parentContainer.visualspace;

  if (layout.aspect_ratio === 'fillX') {
    childContainers.forEach(function(c,i,all) {
      c.visualspace.width = (1.0*parentVisualSpace.width)/all.length;
      c.visualspace.height = parentVisualSpace.height;
      c.visualspace.posX = i * c.visualspace.width;
      c.visualspace.posY = parentVisualSpace.posY;
    });
  } else {
    console.log("TODO");
  }

}

function calcPackGridxyVisualSpace(parentContainer, childContainers,layout) {

  console.log("TODO");

}

function makeContainersUsingIsolatedScale(data, container, layout) {

  var groupby = layout.groupby;
  var myNest = d3.nest()
                  .key(function(d) {return d[groupby]})
                  .entries(data);

  var newContainers =  myNest.map(function(d) {
    return {
      'contents':d.values,
      'isContentsContainers':true,
      'label':d.key,
      'visualspace': {}
    };
  });

  calcVisualSpace(container, newContainers, layout);

  return newContainers;
}

function applyLayout(data,container, layout) {

  if (container.isContentsContainers) {
    container.contents.forEach(function(c) {

      applyLayout(data, c, layout);
    });
  } else {

    splitContainers(data, container, layout);

  }

}

function splitContainers(data, container, layout) {
  var newContainers;

  if (layout.isScaleShared) {
    newContainers = makeContainersUsingSharedScale(data, container, layout);
  } else {
    newContainers = makeContainersUsingIsolatedScale(container.contents, container, layout);
  }
  container.contents = newContainers;
  container.isContentsContainers = true;

}

function drawUnit(leafContainers, mark) {
  console.log ("TODO: Draw leafContainers using mark", leafContainers, mark);
}
