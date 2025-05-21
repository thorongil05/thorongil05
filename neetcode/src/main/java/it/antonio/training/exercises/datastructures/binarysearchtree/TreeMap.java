package it.antonio.training.exercises.datastructures.binarysearchtree;

import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

class TreeMap {

    private static class Node {
        private int key;
        private int value;
        private Node parent;
        private Node left;
        private Node right;

        private int getKey() {
            return key;
        }

        public int getValue() {
            return value;
        }

        public Node getParent() {
            return parent;
        }

        public Node getLeft() {
            return left;
        }

        public Node getRight() {
            return right;
        }

        public void setKey(int key) {
            this.key = key;
        }

        public void setValue(int value) {
            this.value = value;
        }

        public void setParent(Node parent) {
            this.parent = parent;
        }

        public void setLeft(Node left) {
            this.left = left;
        }

        public void setRight(Node right) {
            this.right = right;
        }

        public String toString() {
            return String.format("%s (%s)", key, value);
        }

    }

    private Node root;

    public TreeMap() {
    }

    public void insert(int key, int val) {
        if (root == null) {
            Node node = new Node();
            node.setKey(key);
            node.setValue(val);
            System.out.println("Inserting as root " + node);
            this.root = node;
            return;
        }
        Node node = new Node();
        node.setKey(key);
        node.setValue(val);
        insert(this.root, node);
    }

    void insert(Node node, Node toInsert) {
        if (toInsert.key < node.key) {
            if (node.left == null) {
                node.setLeft(toInsert);
                toInsert.setParent(node);
            } else {
                insert(node.left, toInsert);
            }
        } else if (toInsert.key == node.key) {
            // Replace the current value
            node.value = toInsert.value;
        } else {
            if (node.right == null) {
                node.right = toInsert;
                toInsert.setParent(node);
            } else {
                insert(node.right, toInsert);
            }
        }
    }

    public int get(int key) {
        if (root == null) {
            return -1;
        }
        if (root.getKey() == key) {
            return root.getValue();
        }
        return get(root, key).map(Node::getValue).orElse(-1);
    }

    Optional<Node> get(Node node, int key) {
        if (node.getKey() == key) {
            return Optional.of(node);
        }
        if (key <= node.getKey()) {
            return Optional.ofNullable(node.getLeft()).flatMap(left -> get(left, key));
        }
        return Optional.ofNullable(node.getRight()).flatMap(right -> get(right, key));
    }

    public int getMin() {
        if (root == null) {
            return -1;
        }
        Node current = root;
        while (current.getLeft() != null) {
            current = current.getLeft();
        }
        return current.getValue();
    }

    public int getMax() {
        if (root == null) {
            return -1;
        }
        Node current = root;
        while (current.getRight() != null) {
            current = current.getRight();
        }
        return current.getValue();
    }

    public void remove(int key) {
        if (this.root == null) {
            return;
        }
        Optional<Node> toRemoveMaybe = get(root, key);
        if (toRemoveMaybe.isEmpty()) {
            return;
        }
        Node toRemove = toRemoveMaybe.get();
        if (root == toRemove) {
            if (toRemove.getLeft() != null) {
                Node toPromote = toRemove.getLeft();
                toPromote.setRight(toRemove.getRight());
                root = toPromote;
            } else {
                root = toRemove.getRight();
            }
            return;
        }
        Node parent = toRemove.getParent();
        if (toRemove == parent.getLeft()) {
            parent.setLeft(toRemove.getLeft());
        }
        if (toRemove == parent.getRight()) {
            parent.setRight(toRemove.getLeft());
        }
    }

    public List<Integer> getInorderKeys() {
        List<Integer> inorderKeys = new ArrayList<>();
        if (root != null) {
            addToInorderList(inorderKeys, root);
        }
        return inorderKeys;
    }

    void addToInorderList(List<Integer> inorderKeys, Node node) {
        Node left = node.getLeft();
        Node right = node.getRight();
        if (left != null) {
            addToInorderList(inorderKeys, left);
        }
        inorderKeys.add(node.getKey());
        if (right != null) {
            addToInorderList(inorderKeys, right);
        }
    }

}
