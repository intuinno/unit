var spec_path = 'data/titanic_spec.json';

d3.json(spec_path, function(error, data) {

  console.log(data);

  d3.csv(data.data, function(error, csv_data) {

    console.log(csv_data);

    rootContainer = build_Container(csv_data, data.width, data.height, 0, 0);

    var tempContainer = rootContainer;
    data.layouts.forEach(function(layout) {
      tempContainer = tempContainer.applyLayout(layout);
    });

    leafContainer = tempContainer;

    leafContainer.drawUnit(data.mark);

  })
})
