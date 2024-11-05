import Quill from "quill";

const Inline = Quill.import("blots/inline");

export class PatternBlot extends Inline {
  static blotName = "pattern";
  static tagName = "span";
  static className = "pattern-blot";

  static create(value: any) {
    const node: any = super.create();
    node.setAttribute("data-pattern", value);
    node.setAttribute("contenteditable", "false");
    return node;
  }

  static formats(node: any) {
    return node.getAttribute("data-pattern");
  }

  deleteAt(index: number, length: number) {
    this.remove();
  }
}

Quill.register(PatternBlot);
