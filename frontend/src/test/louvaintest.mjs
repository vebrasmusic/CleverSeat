import louvain from 'graphology-communities-louvain';
import Graph from 'graphology';

import fs from 'fs';
import path from 'path';

function loadCSVFile(filePath) {
  try {
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    return csvContent;
  } catch (error) {
    console.error('Error reading the CSV file:', error);
    return null;
  }
}

const csvFilePath = path.join('book2.csv');
const csvContent = loadCSVFile(csvFilePath);

if (csvContent) {
  const graph = loadGraphFromCSV(csvContent);

  // If you want to return some details about the algorithm's execution
  var details = louvain.detailed(graph);
  console.log(details);
} else {
  console.error('Failed to load CSV content.');
}



function loadGraphFromCSV(csvContent) {
  const lines = csvContent.split('\n');
  const graph = new Graph();

  lines.forEach(line => {
    const [source, target, weight] = line.split(',');
    if (source && target && weight) {
      if (!graph.hasNode(source)) {
        graph.addNode(source);
      }
      if (!graph.hasNode(target)) {
        graph.addNode(target);
      }
      graph.addUndirectedEdge(source, target, { weight: parseFloat(weight) });
    }
  });

  return graph;
}
