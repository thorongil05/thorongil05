package it.antonio.training.exercises.datastructures.hashtable;

import java.util.Optional;

class HashTable {

    private int capacity;
    private int size = 0;
    private Bucket[] buckets;

    public HashTable(int capacity) {
        this.buckets = new Bucket[capacity];
        this.capacity = capacity;
    }

    public void insert(int key, int value) {
        Bucket toBeInserted = new Bucket().setKey(key).setValue(value);
        double loadFactor = this.getLoadFactor(size + 1);
        if (loadFactor >= 0.5) {
            resize();
        }
        Optional<Bucket> bucketMaybe = moveToLastBucketIfExist(key);
        if (bucketMaybe.isPresent()) {
            Bucket existingBucket = bucketMaybe.get();
            if (existingBucket.getKey() == toBeInserted.getKey()) {
                existingBucket.setValue(toBeInserted.getValue());
            } else {
                existingBucket.setNext(toBeInserted);
                toBeInserted.setPrevious(existingBucket);
            }
        } else {
            int index = hash(key);
            buckets[index] = toBeInserted;
        }
        this.size += 1;
    }

    public int get(int key) {
        return moveToLastBucketIfExist(key)
                .filter(bucket -> bucket.getKey() == key)
                .map(Bucket::getValue).orElse(-1);
    }

    private Optional<Bucket> moveToLastBucketIfExist(int key) {
        int index = hash(key);
        if (index > capacity) {
            return Optional.empty();
        }
        Optional<Bucket> bucketMaybe = Optional.ofNullable(buckets[index]);
        if (bucketMaybe.isEmpty()) {
            return Optional.empty();
        }
        Bucket bucket = bucketMaybe.get();
        while (bucket.getKey() != key && bucket.hasNext()) {
            bucket = bucket.getNext();
        }
        return Optional.of(bucket);
    }

    public boolean remove(int key) {
        Optional<Bucket> bucketMaybe = this.moveToLastBucketIfExist(key);
        if (bucketMaybe.isEmpty()) {
            return false;
        }
        Bucket bucket = bucketMaybe.get();
        int index = hash(key);
        if (bucket.getPrevious() == null) {
            buckets[index] = bucket.getNext();
        } else {
            bucket.getPrevious().setNext(bucket.getNext());
        }
        size--;
        return true;
    }

    public int getSize() {
        return this.size;
    }

    public int getCapacity() {
        return this.capacity;
    }

    public void resize() {
        this.capacity = 2 * this.capacity;
        Bucket[] newBuckets = new Bucket[this.capacity];
        for (Bucket bucket : this.buckets) {
            if (bucket != null) {
                int index = this.hash(bucket.getKey());
                newBuckets[index] = bucket;
            }
        }
        this.buckets = newBuckets;
    }

    private double getLoadFactor(int expectedSize) {
        if (this.capacity == 0) {
            return 0;
        }
        return (double) expectedSize / this.capacity;
    }

    int hash(int key) {
        return key % capacity;
    }

    private static final class Bucket {
        private int key;
        private int value;
        private Bucket next;
        private Bucket previous;

        public int getKey() {
            return key;
        }

        public Bucket setKey(int key) {
            this.key = key;
            return this;
        }

        public int getValue() {
            return value;
        }

        public Bucket setValue(int value) {
            this.value = value;
            return this;
        }

        @Override
        public String toString() {
            if (next != null) {
                return String.format("%s -> %s (%s)", key, value, next);
            }
            return String.format("%s -> %s", key, value);
        }

        public Bucket getNext() {
            return next;
        }

        public void setNext(Bucket next) {
            this.next = next;
        }

        public boolean hasNext() {
            return this.next != null;
        }

        public Bucket getPrevious() {
            return previous;
        }

        public void setPrevious(Bucket previous) {
            this.previous = previous;
        }
    }
}

