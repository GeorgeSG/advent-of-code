export type Node<T> = {
  value: T;
  next: Node<T> | null;
  prev: Node<T> | null;
};

export class CyclicalLinkedList<T> {
  public size = 0;
  public start: Node<T> = null;
  public end: Node<T> = null;

  static fromArray<T>(ary: T[]): CyclicalLinkedList<T> {
    const list = new CyclicalLinkedList<T>();
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

    let currentNext = node.next;
    newNode.prev = node;
    newNode.next = currentNext;

    node.next = newNode;
    currentNext.prev = newNode;

    if (node === this.end) {
      newNode.next = this.start;
      this.end = newNode;
      if (this.start) {
        this.start.prev = newNode;
      }
    }
  }

  insertAfter(node: Node<T> | null, value: T) {
    this.size += 1;
    const newNode = { value, prev: node, next: node?.next ?? null };

    if (node?.next) {
      node.next.prev = newNode;
    }

    if (node) {
      node.next = newNode;
    }

    if (node === this.end) {
      newNode.next = this.start;
      this.end = newNode;
      if (this.start) {
        this.start.prev = newNode;
      }
    }
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

    if (node === this.start) {
      this.start = node.next;
    } else if (node === this.end) {
      this.end = node.prev;
    }

    node.prev = null;
    node.next = null;
  }

  get nodes(): Node<T>[] {
    const nodes: Node<T>[] = [];

    let node = this.start;
    do {
      nodes.push(node);
      node = node.next;
    } while (node !== null && node !== this.end); // checking for this.end enables cyclical lists

    nodes.push(this.end);

    return nodes;
  }

  get values(): T[] {
    let result: T[] = [];
    let node = this.start;
    do {
      result.push(node.value);
      node = node.next;
    } while (node !== null && node !== this.end); // checking for this.end enables cyclical lists

    result.push(this.end.value);

    return result;
  }

  toString(delimiter = ', ') {
    return this.values.join(delimiter);
  }
}
