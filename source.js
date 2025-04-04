function createSquaresFromPoints(points, sideLength) {
  return points.map(function(feature) {
    var point = feature.geometry();
    var coordinates = point.coordinates();
    var x = ee.Number(coordinates.get(0));
    var y = ee.Number(coordinates.get(1));
    var halfSide = ee.Number(sideLength).divide(2);

    var corner1 = ee.Geometry.Point([x.subtract(halfSide), y.add(halfSide)]);
    var corner2 = ee.Geometry.Point([x.add(halfSide), y.add(halfSide)]);
    var corner3 = ee.Geometry.Point([x.add(halfSide), y.subtract(halfSide)]);
    var corner4 = ee.Geometry.Point([x.subtract(halfSide), y.subtract(halfSide)]);

    var square = ee.Geometry.Polygon([
      corner1.coordinates(),
      corner2.coordinates(),
      corner3.coordinates(),
      corner4.coordinates(),
      corner1.coordinates() 
    ]);

    return ee.Feature(square);
  });
}

function maskS2clouds(image) {
	
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var cloudShadowBitMask = 1 << 12;

  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0))
      .and(qa.bitwiseAnd(cloudShadowBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}


var squareSideLength = 0.1;
var squares = createSquaresFromPoints(geometry, squareSideLength);

var image = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(squares)
  .filterDate('2023-10-01', '2024-03-31').map(maskS2clouds).median();

var featureList = squares.toList(squares.size());

var featureCount = squares.size();

ee.List.sequence(0, featureCount.subtract(1)).evaluate(function(indices) {
  indices.forEach(function(index) {
    var feature = ee.Feature(featureList.get(index));
    var geometry = feature.geometry();
    var croppedImage = image.clip(geometry);

    Export.image.toDrive({
      image: croppedImage,
      folder: 'imagens',
      region: geometry,
      scale: 10,
      maxPixels: 1e13
    });
  });
});

Map.centerObject(geometry, 10);
Map.addLayer(geometry, {color: 'red'}, 'Points');
Map.addLayer(squares, {color: 'blue'}, 'Squares');