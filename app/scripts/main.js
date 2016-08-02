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
                              'posX': spec.posX,
                              'poY': spec.posY,
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

function makeContainersUsingSharedScale(data, groupby) {
  var newContainers= emptyContainersFromKeys(data, groupby);

  newContainers.forEach(function(c) {
    c.contents = data.filter(function(d) {
      return d[groupby] === c.label;
    });
  });

  return newContainers;
}

function makeContainersUsingIsolatedScale(data, groupby) {
  var myNest = d3.nest()
                  .key(function(d) {return d[groupby]})
                  .entries(data);

  return myNest.map(function(d) {
    return {
      'contents':d.values,
      'isContentsContainers':true,
      'label':d.key,
      'visualspace': {}
    };
  });
}

function applyLayout(data,container, layout) {

  if (container.isContentsContainers) {
    container.contents.forEach(function(c) {

      applyLayout(data, c, layout);
    });
  } else {

    groupbyData(data, container, layout);

  }

}

function groupbyData(data, container, layout) {
  var newContainers;

  if (layout.isScaleShared) {
    newContainers = makeContainersUsingSharedScale(data, layout.groupby);
  } else {
    newContainers = makeContainersUsingIsolatedScale(container.contents, layout.groupby);
  }
  container.contents = newContainers;
  container.isContentsContainers = true;

}

function drawUnit(leafContainers, mark) {
  console.log ("TODO: Draw leafContainers using mark", leafContainers, mark);
}
