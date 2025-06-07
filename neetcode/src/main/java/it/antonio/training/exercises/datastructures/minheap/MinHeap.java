package it.antonio.training.exercises.datastructures.minheap;

import java.util.*;

class MinHeap {

  private List<Integer> heapArray = new ArrayList<>();

  public MinHeap() {}

  public void push(int val) {
    this.heapArray.add(val);
    int currentIndex = this.heapArray.size() - 1;
    while (currentIndex >= 0
            && this.heapArray.get(currentIndex) < this.heapArray.get(getParent(currentIndex))) {
      swap(this.heapArray, currentIndex, getParent(currentIndex));
      currentIndex = getParent(currentIndex);
    }
  }

  public Integer pop() {
    if (this.heapArray == null || this.heapArray.isEmpty()) {
      return -1;
    }
    int minValue = this.heapArray.get(0);
    int lastIndex = this.heapArray.size() - 1;
    this.heapArray.set(0, this.heapArray.get(lastIndex));
    this.heapArray.remove(lastIndex);
    minHeapify(this.heapArray, 0);
    return minValue;
  }

  public Integer top() {
    if (this.heapArray == null || this.heapArray.isEmpty()) {
      return -1;
    }
    return this.heapArray.get(0);
  }

  public void heapify(List<Integer> nums) {
    for (int i = nums.size() - 1; i >= 0; i--) {
      minHeapify(nums, i);
    }
    this.heapArray = nums;
  }

  void minHeapify(List<Integer> values, int subtreeIndex) {
    if (values == null || values.isEmpty()) {
      return;
    }

    int leftChildIndex = getLeftChildIndex(subtreeIndex);
    int rightChildIndex = getRightChildIndex(subtreeIndex);

    int minIndex = subtreeIndex;

    if (leftChildIndex < values.size() && values.get(leftChildIndex) <= values.get(minIndex)) {
      minIndex = leftChildIndex;
    }

    if (rightChildIndex < values.size() && values.get(rightChildIndex) <= values.get(minIndex)) {
      minIndex = rightChildIndex;
    }

    if (minIndex != subtreeIndex) {
      swap(values, subtreeIndex, minIndex);
      minHeapify(values, minIndex);
    }
  }

  void swap(List<Integer> values, int firstIndex, int secondIndex) {
    Integer temp = values.get(firstIndex);

    values.set(firstIndex, values.get(secondIndex));
    values.set(secondIndex, temp);
  }

  @Override
  public String toString() {
    return String.format("Array form: %s\n", this.heapArray);
  }

  int getLeftChildIndex(int index) {
    return index * 2 + 1;
  }

  int getRightChildIndex(int index) {
    return index * 2 + 2;
  }

  int getParent(int index) {
    return (int) Math.floor((double) index / 2);
  }
}

