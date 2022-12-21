export type Node<T> = {
  value: T;
  next: Node<T> | null;
  prev: Node<T> | null;
};

export class LinkedList<T> {
  public size = 0;
  public start: Node<T> = null;
  public end: Node<T> = null;

  static fromArray<T>(ary: T[]): LinkedList<T> {
    const list = new LinkedList<T>();
    ary.forEach((item) => list.add(item));

    return list;
  }

  constructor(value?: T) {
    if (value) {
      this.start = { value, next: null, prev: null };
      this.end = this.start;
      this.size = 1;
    }
  }

  insertNodeAfter(node: Node<T> | null, newNode: Node<T>) {
    this.size++;

    let currentNext = node?.next ?? null;

    if (currentNext) {
      currentNext.prev = newNode;
    }

    if (node) {
      node.next = newNode;
    }

    newNode.prev = node;
    newNode.next = currentNext;
  }

  insertAfter(node: Node<T> | null, value: T) {
    this.insertNodeAfter(node, { value, prev: null, next: null });
  }

  add(value: T) {
    this.insertAfter(this.end, value);

    if (this.start === null) {
      this.start = this.end;
    }
  }

  remove(node: Node<T>) {
    this.size -= 1;

    node.prev.next = node.next;
    node.next.prev = node.prev;

    node.prev = null;
    node.next = null;
  }

  get nodes(): Node<T>[] {
    const nodes: Node<T>[] = [this.start];

    let node = this.start;
    while (node !== null && node !== this.end) {
      node = node.next;
      nodes.push(node);
    }

    return nodes;
  }

  get values(): T[] {
    const result: T[] = [this.start.value];

    let node = this.start;
    while (node !== null && node !== this.end) {
      node = node.next;
      result.push(node.value);
    }

    return result;
  }

  toString(delimiter = ', ') {
    return this.values.join(delimiter);
  }
}

export class CyclicalLinkedList<T> extends LinkedList<T> {
  static fromArray<T>(ary: T[]): CyclicalLinkedList<T> {
    const list = new CyclicalLinkedList<T>();
    ary.forEach((item) => list.add(item));
    return list;
  }

  insertNodeAfter(node: Node<T> | null, newNode: Node<T>) {
    if (node === this.end) {
      this.end = newNode;
      if (this.start) {
        this.start.prev = newNode;
      }
    }

    super.insertNodeAfter(node, newNode);
  }

  remove(node: Node<T>) {
    if (node === this.start) {
      this.start = node.next;
    } else if (node === this.end) {
      this.end = node.prev;
    }
    super.remove(node);
  }
}
