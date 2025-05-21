package it.antonio.training.exercises.datastructures.binarysearchtree;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;

class TreeMapTest {

    @Test
    void testCaseOne() {
        TreeMap treeMap = new TreeMap();
        treeMap.insert(1, 2);

        Assertions.assertEquals(2, treeMap.get(1));

        treeMap.insert(4, 0);

        Assertions.assertEquals(2, treeMap.getMin());
        Assertions.assertEquals(0, treeMap.getMax());
    }

    @Test
    void testCaseTwo() {
        TreeMap treeMap = new TreeMap();
        treeMap.insert(1, 2);
        treeMap.insert(4, 2);
        treeMap.insert(3, 7);
        treeMap.insert(2, 1);

        Assertions.assertEquals(List.of(1, 2, 3, 4), treeMap.getInorderKeys());

        treeMap.remove(1);
        Assertions.assertEquals(List.of(2, 3, 4), treeMap.getInorderKeys());
    }

    @Test
    void testCaseThree() {
        TreeMap treeMap = new TreeMap();
        treeMap.insert(4, 2);
        treeMap.insert(5, 2);
        treeMap.insert(3, 7);
        treeMap.insert(2, 1);

        Assertions.assertEquals(List.of(2, 3, 4, 5), treeMap.getInorderKeys());

        treeMap.remove(4);
        Assertions.assertEquals(List.of(2, 3, 5), treeMap.getInorderKeys());
    }

    @Test
    void testCase_GetFromEmptyTree__DoesNotThrow() {
        TreeMap treeMap = new TreeMap();
        Assertions.assertEquals(-1, treeMap.get(1));

    }

    @Test
    void testCase_RemoveFromEmptyTree__ReturnDefaultValue() {
        TreeMap treeMap = new TreeMap();
        Assertions.assertDoesNotThrow(() -> treeMap.remove(1));
    }

    @Test
    void testCase_GetInOrderKeys__ReturnEmptyList() {
        TreeMap treeMap = new TreeMap();
        Assertions.assertEquals(Collections.emptyList(), treeMap.getInorderKeys());
    }

    @Test
    void testCase_DuplicateInsert__Replace() {
        TreeMap treeMap = new TreeMap();
        treeMap.insert(1, 10);
        treeMap.insert(1, 20);

        Assertions.assertEquals(20, treeMap.get(1));
    }

}