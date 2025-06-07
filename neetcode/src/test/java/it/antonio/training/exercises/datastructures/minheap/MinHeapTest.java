package it.antonio.training.exercises.datastructures.minheap;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class MinHeapTest {

  @Test
  void testCase_ToString() {
    MinHeap minHeap = new MinHeap();
    minHeap.push(1);
    minHeap.push(2);
    minHeap.push(3);
    minHeap.push(4);
    minHeap.push(5);
    minHeap.push(6);

    System.out.println(minHeap);
  }

  @Test
  void testCase_Top_Push_Pop() {
    MinHeap minHeap = new MinHeap();
    Assertions.assertEquals(-1, minHeap.top());

    minHeap.push(1);
    Assertions.assertEquals(1, minHeap.top());
    Assertions.assertEquals(1, minHeap.pop());
    Assertions.assertEquals(-1, minHeap.pop());
  }

  @Test
  void testCase_Heapify_Pop() {
    MinHeap minHeap = new MinHeap();
    minHeap.heapify(new ArrayList<>(List.of(1, 2, 3, 4, 5)));
    System.out.println(minHeap);

    Assertions.assertEquals(1, minHeap.pop());
    System.out.println(minHeap);
    Assertions.assertEquals(2, minHeap.pop());
    System.out.println(minHeap);
    Assertions.assertEquals(3, minHeap.pop());
    System.out.println(minHeap);
    Assertions.assertEquals(4, minHeap.pop());
    System.out.println(minHeap);
    Assertions.assertEquals(5, minHeap.pop());
  }

  @Test
  void testCase_Heapify_Pop_2() {
    MinHeap minHeap = new MinHeap();
    minHeap.heapify(new ArrayList<>(List.of(1, 2, 3, 4, 5, 6, 7)));

    Assertions.assertEquals(1, minHeap.pop());
    Assertions.assertEquals(2, minHeap.pop());
    Assertions.assertEquals(3, minHeap.pop());
    Assertions.assertEquals(4, minHeap.pop());
    Assertions.assertEquals(5, minHeap.pop());
    Assertions.assertEquals(6, minHeap.pop());
    Assertions.assertEquals(7, minHeap.pop());
  }

  @Test
  void testCase_Heapify_Pop_3() {
    MinHeap minHeap = new MinHeap();
    minHeap.heapify(new ArrayList<>(List.of(5, 6, 7, 1, 2, 3, 4)));
    System.out.println(minHeap);

    Assertions.assertEquals(1, minHeap.pop());
    System.out.println(minHeap);

    Assertions.assertEquals(2, minHeap.pop());
    Assertions.assertEquals(3, minHeap.pop());
    Assertions.assertEquals(4, minHeap.pop());
    Assertions.assertEquals(5, minHeap.pop());
    Assertions.assertEquals(6, minHeap.pop());
    Assertions.assertEquals(7, minHeap.pop());
  }

  @Test
  void testCase_Heapify_Pop_4() {
    MinHeap minHeap = new MinHeap();
    minHeap.heapify(new ArrayList<>(List.of(4, 1, 3, 2, 16, 9, 10, 14, 8, 7)));
    System.out.println(minHeap);

    Assertions.assertEquals(1, minHeap.pop());
    Assertions.assertEquals(2, minHeap.pop());
    Assertions.assertEquals(3, minHeap.pop());
    Assertions.assertEquals(4, minHeap.pop());
    Assertions.assertEquals(7, minHeap.pop());
    Assertions.assertEquals(8, minHeap.pop());
    Assertions.assertEquals(9, minHeap.pop());
    Assertions.assertEquals(10, minHeap.pop());
    Assertions.assertEquals(14, minHeap.pop());
    Assertions.assertEquals(16, minHeap.pop());
  }

//  ["push", 5, "push", 2, "push", 1, "push", 10, "top", "pop", "top", "pop", "top", "pop", "top", "pop"]
  @Test
  void testCase_ErrorWithPush() {
    MinHeap minHeap = new MinHeap();
    minHeap.push(5);
    minHeap.push(2);
    minHeap.push(1);
    minHeap.push(10);

    System.out.println(minHeap);

    Assertions.assertEquals(1, minHeap.top());
    Assertions.assertEquals(1, minHeap.pop());
    Assertions.assertEquals(2, minHeap.top());
    Assertions.assertEquals(2, minHeap.pop());
    Assertions.assertEquals(5, minHeap.top());
    Assertions.assertEquals(5, minHeap.pop());
    Assertions.assertEquals(10, minHeap.top());
    Assertions.assertEquals(10, minHeap.pop());
  }

}
