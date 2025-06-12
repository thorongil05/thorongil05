package it.antonio.training.exercises.datastructures.graph;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

class Graph {
  static final class Node {

    private final int value;
    private final Map<Integer, Node> edges = new HashMap<>();

    public Node(int value) {
      this.value = value;
    }

    public int getValue() {
      return value;
    }

    public Map<Integer, Node> getEdges() {
      return edges;
    }
  }

  private final Map<Integer, Node> graphDictionary = new HashMap<>();

  public Graph() {}

  public void addEdge(int src, int dst) {
    graphDictionary.putIfAbsent(src, new Node(src));
    Node source = graphDictionary.get(src);
    graphDictionary.putIfAbsent(dst, new Node(dst));
    Node destination = graphDictionary.get(dst);

    if (source == null) {
      throw new IllegalStateException("Source cannot be null");
    }
    if (destination == null) {
      throw new IllegalStateException("Destination cannot be null");
    }

    source.getEdges().putIfAbsent(destination.getValue(), destination);
  }

  public boolean removeEdge(int src, int dst) {
    Node source = graphDictionary.get(src);

    if (source == null) {
      return false;
    }

    Node destination = graphDictionary.get(dst);
    if (destination == null) {
      return false;
    }

    return source.getEdges().remove(dst) != null;
  }

  public boolean hasPath(int src, int dst) {
    Node source = graphDictionary.get(src);
    if (source == null) {
      return false;
    }

    Node destination = graphDictionary.get(dst);
    if (destination == null) {
      return true;
    }

    return hasPath(source, destination);
  }

  private boolean hasPath(Node source, Node destination) {
    if (source.getValue() == destination.getValue()) {
      return true;
    }
    Collection<Node> adjacenceList = source.getEdges().values();
    if (adjacenceList.isEmpty()) {
      return false;
    }
    return adjacenceList.stream().anyMatch(node -> hasPath(node, destination));
  }
}
