package it.antonio.training.exercises.datastructures.graph;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class GraphTest {

  @Test
  void test_AddEdgeAndHasPath_Case1__Ok() {
    Graph graph = new Graph();
    graph.addEdge(1, 2);
    graph.addEdge(2, 3);

    Assertions.assertTrue(graph.hasPath(1, 3));
    Assertions.assertFalse(graph.hasPath(3, 1));
    Assertions.assertTrue(graph.removeEdge(1, 2));
    Assertions.assertFalse(graph.hasPath(1, 3));
  }

  @Test
  void test_AddEdgeAndHasPath_Case2__Ok() {
    Graph graph = new Graph();
    graph.addEdge(1, 2);
    graph.addEdge(2, 3);
    graph.addEdge(3, 1);

    Assertions.assertTrue(graph.hasPath(1, 3));
    Assertions.assertTrue(graph.hasPath(3, 1));
  }

  @Test
  void test_AddEdgeAndHasPath_Case3__Ok() {
    Graph graph = new Graph();
    graph.addEdge(1, 2);
    graph.addEdge(1, 3);
    graph.addEdge(2, 6);
    graph.addEdge(2, 15);
    graph.addEdge(3, 4);
    graph.addEdge(15, 25);
    graph.addEdge(15, 19);

    Assertions.assertTrue(graph.hasPath(1, 2));
    Assertions.assertTrue(graph.hasPath(1, 3));
    Assertions.assertTrue(graph.hasPath(1, 4));
    Assertions.assertTrue(graph.hasPath(1, 6));
    Assertions.assertTrue(graph.hasPath(1, 19));

    Assertions.assertTrue(graph.hasPath(2, 15));
    Assertions.assertTrue(graph.hasPath(2, 6));
    Assertions.assertTrue(graph.hasPath(2, 25));

    Assertions.assertFalse(graph.hasPath(19, 6));
    Assertions.assertFalse(graph.hasPath(3, 2));
  }
}
