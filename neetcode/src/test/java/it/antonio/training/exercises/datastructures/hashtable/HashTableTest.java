package it.antonio.training.exercises.datastructures.hashtable;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class HashTableTest {

    @Test
    void testCase1() {
        HashTable hashTable = new HashTable(4);
        hashTable.insert(1, 2);

        Assertions.assertEquals(2, hashTable.get(1));

        hashTable.insert(1, 3);
        Assertions.assertEquals(3, hashTable.get(1));

        Assertions.assertTrue(hashTable.remove(1));
        Assertions.assertEquals(-1, hashTable.get(1));
    }

    @Test
    void testCase2() {
        HashTable hashTable = new HashTable(2);
        Assertions.assertEquals(2, hashTable.getCapacity());

        hashTable.insert(6, 7);
        Assertions.assertEquals(4, hashTable.getCapacity());

        hashTable.insert(1, 2);
        Assertions.assertEquals(8, hashTable.getCapacity());

        hashTable.insert(3, 4);
        Assertions.assertEquals(8, hashTable.getCapacity());

        Assertions.assertEquals(3, hashTable.getSize());
    }

    @Test
    void testCase3() {
        HashTable hashTable = new HashTable(2);
        hashTable.insert(8, 0);
        hashTable.insert(16, 0);
        hashTable.insert(24, 0);

        Assertions.assertEquals(0, hashTable.get(8));
        Assertions.assertEquals(0, hashTable.get(16));
        Assertions.assertEquals(0, hashTable.get(24));

        Assertions.assertTrue(hashTable.remove(24));
        Assertions.assertEquals(-1 , hashTable.get(24));

        Assertions.assertTrue(hashTable.remove(16));
        Assertions.assertEquals(-1 , hashTable.get(16));

        Assertions.assertTrue(hashTable.remove(8));
        Assertions.assertEquals(-1 , hashTable.get(8));
    }

    @Test
    void testCase4() {
        HashTable hashTable = new HashTable(4);
        hashTable.insert(4, 4);

        Assertions.assertEquals(4, hashTable.get(4));

        hashTable.insert(4, 5);
        Assertions.assertEquals(5, hashTable.get(4));
    }

    @Test
    void testCase5() {
        HashTable hashTable = new HashTable(4);
        hashTable.insert(1, 1);

        Assertions.assertTrue(hashTable.remove(1));

        hashTable.insert(2, 2);
        Assertions.assertTrue(hashTable.remove(2));
        Assertions.assertEquals(0, hashTable.getSize());
    }

}